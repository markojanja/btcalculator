import express from "express";
import prisma from "../db/prisma.js";
import { canAccess } from "../utils/helpers.js";

const router = express.Router();

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

// Task statistics for people who work tasks (SUPPORT).
const supportStats = async (id) => {
  const weekAgo = new Date(Date.now() - WEEK_MS);

  const [
    counts,
    recentTasks,
    clientGroups,
    commentsWritten,
    guidesWritten,
    lastTask,
  ] = await Promise.all([
    // All task counts in one pass over the user's tasks
    prisma.$queryRaw`
      SELECT
        COUNT(*)::INT AS "totalTasks",
        COUNT(*) FILTER (WHERE "status" = 'TODO')::INT AS "todo",
        COUNT(*) FILTER (WHERE "status" = 'IN_PROGRESS')::INT AS "inProgress",
        COUNT(*) FILTER (WHERE "status" = 'COMPLETED')::INT AS "completed",
        COUNT(*) FILTER (WHERE "status" = 'CS_TICKET')::INT AS "csTicket",
        COUNT(*) FILTER (WHERE "status" = 'IT_TICKET')::INT AS "itTicket",
        COUNT(*) FILTER (
          WHERE "priority" = 'HIGH' AND "status" <> 'COMPLETED'
        )::INT AS "highPriorityOpen",
        COUNT(*) FILTER (WHERE "createdAt" >= ${weekAgo})::INT AS "createdLast7Days"
      FROM "Tasks"
      WHERE "userId" = ${id};
    `,
    prisma.tasks.findMany({
      where: { userId: id },
      orderBy: { updatedAt: "desc" },
      take: 5,
      select: {
        id: true,
        title: true,
        status: true,
        priority: true,
        updatedAt: true,
        client: { select: { name: true } },
      },
    }),
    prisma.tasks.groupBy({
      by: ["clientId"],
      where: { userId: id, clientId: { not: null } },
      _count: { _all: true },
      orderBy: { _count: { clientId: "desc" } },
      take: 3,
    }),
    prisma.taskComments.count({ where: { userId: id } }),
    prisma.guides.count({ where: { userId: id } }),
    prisma.tasks.findFirst({
      where: { userId: id },
      orderBy: { updatedAt: "desc" },
      select: { updatedAt: true },
    }),
  ]);

  // Names for the top clients
  const clients = await prisma.clients.findMany({
    where: { id: { in: clientGroups.map((g) => g.clientId) } },
    select: { id: true, name: true },
  });
  const topClients = clientGroups.map((g) => ({
    name: clients.find((c) => c.id === g.clientId)?.name ?? "Unknown",
    count: g._count._all,
  }));

  return {
    kind: "support",
    ...counts[0],
    commentsWritten,
    guidesWritten,
    lastActivity: lastTask?.updatedAt ?? null,
    recentTasks,
    topClients,
  };
};

// ADMIN and MANAGER don't work tasks themselves: they comment on and edit
// them, write guides and features, and add clients. Their profile shows that
// work plus an overview of the team's open tasks.
const staffStats = async (id) => {
  const weekAgo = new Date(Date.now() - WEEK_MS);

  const [
    commentsWritten,
    commentsLast7Days,
    tasksCommentedOn,
    recentComments,
    guidesWritten,
    guidesPublished,
    featuresWritten,
    featuresReleased,
    clientsAdded,
    recentGuides,
    recentFeatures,
    team,
  ] = await Promise.all([
    prisma.taskComments.count({ where: { userId: id } }),
    prisma.taskComments.count({
      where: { userId: id, createdAt: { gte: weekAgo } },
    }),
    prisma.taskComments.groupBy({ by: ["taskId"], where: { userId: id } }),
    prisma.taskComments.findMany({
      where: { userId: id },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        description: true,
        createdAt: true,
        task: { select: { id: true, title: true, status: true } },
      },
    }),
    prisma.guides.count({ where: { userId: id } }),
    prisma.guides.count({ where: { userId: id, published: true } }),
    prisma.features.count({ where: { userId: id } }),
    prisma.features.count({ where: { userId: id, released: true } }),
    prisma.clients.count({ where: { userId: id } }),
    prisma.guides.findMany({
      where: { userId: id },
      orderBy: { createdAt: "desc" },
      take: 3,
      select: { id: true, title: true, published: true, createdAt: true },
    }),
    prisma.features.findMany({
      where: { userId: id },
      orderBy: { createdAt: "desc" },
      take: 3,
      select: { id: true, title: true, published: true, createdAt: true },
    }),
    // Team overview: everyone's open work right now
    prisma.$queryRaw`
      SELECT
        COUNT(*) FILTER (WHERE "status" IN ('TODO', 'IN_PROGRESS'))::INT AS "open",
        COUNT(*) FILTER (WHERE "status" IN ('CS_TICKET', 'IT_TICKET'))::INT AS "tickets",
        COUNT(*) FILTER (
          WHERE "priority" = 'HIGH' AND "status" <> 'COMPLETED'
        )::INT AS "highPriorityOpen",
        COUNT(*) FILTER (WHERE "createdAt" >= ${weekAgo})::INT AS "createdLast7Days"
      FROM "Tasks";
    `,
  ]);

  // Latest thing this person did that we have a date for
  const lastActivity =
    [
      recentComments[0]?.createdAt,
      recentGuides[0]?.createdAt,
      recentFeatures[0]?.createdAt,
    ]
      .filter(Boolean)
      .sort((a, b) => b - a)[0] ?? null;

  return {
    kind: "staff",
    commentsWritten,
    commentsLast7Days,
    tasksCommentedOn: tasksCommentedOn.length,
    guidesWritten,
    guidesPublished,
    featuresWritten,
    featuresReleased,
    clientsAdded,
    lastActivity,
    recentComments,
    recentContent: [
      ...recentGuides.map((g) => ({ ...g, type: "guide" })),
      ...recentFeatures.map((f) => ({ ...f, type: "feature" })),
    ]
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, 5),
    team: team[0],
  };
};

// Profile statistics for one user. Users can see their own; staff can see
// anyone's (see canAccess). The shape depends on the user's role (`kind`).
router.get("/stats/users/:id", async (req, res, next) => {
  const { id } = req.params;
  if (!canAccess(req.user, id)) {
    return res
      .status(403)
      .json({ message: "You can only view your own stats." });
  }

  try {
    const target = await prisma.user.findUnique({
      where: { id },
      select: { role: true },
    });
    if (!target) {
      return res.status(404).json({ message: "User not found." });
    }

    const stats =
      target.role === "SUPPORT" ? await supportStats(id) : await staffStats(id);
    return res.json(stats);
  } catch (error) {
    next(error);
  }
});

export default router;
