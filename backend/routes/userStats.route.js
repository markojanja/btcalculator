import express from "express";
import prisma from "../db/prisma.js";
import { canAccess } from "../utils/helpers.js";

const router = express.Router();

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

// Profile statistics for one user. Users can see their own; staff can see
// anyone's (see canAccess).
router.get("/stats/users/:id", async (req, res, next) => {
  const { id } = req.params;
  if (!canAccess(req.user, id)) {
    return res
      .status(403)
      .json({ message: "You can only view your own stats." });
  }

  try {
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

    return res.json({
      ...counts[0],
      commentsWritten,
      guidesWritten,
      lastActivity: lastTask?.updatedAt ?? null,
      recentTasks,
      topClients,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
