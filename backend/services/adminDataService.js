import prisma from "../db/prisma.js";

export const getTasksByStatus = async () => {
  return await prisma.tasks.groupBy({
    by: ["status"],
    _count: { status: true },
  });
};

export const getTasksByPriority = async () => {
  return await prisma.tasks.groupBy({
    by: ["priority"],
    where: {
      status: {
        not: "COMPLETED",
      },
    },
    _count: { priority: true },
  });
};

export const getTasksByUser = async () => {
  const users = await prisma.user.findMany({
    where: {
      tasks: {
        some: {
          status: {
            in: ["TODO", "IN_PROGRESS"],
          },
        },
      },
    },
    select: {
      firstname: true,
      _count: {
        select: {
          tasks: {
            where: {
              status: {
                in: ["TODO", "IN_PROGRESS"],
              },
            },
          },
        },
      },
    },
  });
  return users.map((user) => ({
    userId: user.id,
    firstname: user.firstname,
    count: user._count.tasks,
  }));
};
