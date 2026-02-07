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

export const getLatestTasks = async () => {
  return await prisma.tasks.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: 10,
    select: {
      id: true,
      title: true,
      status: true,
      priority: true,
      createdAt: true,
      user: {
        select: {
          firstname: true,
          lastname: true,
        },
      },
      client: {
        select: {
          name: true,
        },
      },
    },
  });
};

export const getRecentUsers = async () => {
  return await prisma.user.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: 5,
    select: {
      id: true,
      firstname: true,
      lastname: true,
      email: true,
      role: true,
    },
  });
};

export const getTasksStatusAndPriority = async (filter, excludeCompleted) => {
  return await prisma.tasks.findMany({
    orderBy: {
      createdAt: "desc",
    },
    where: {
      ...filter,
      ...(excludeCompleted && {
        AND: {
          status: {
            not: "COMPLETED",
          },
        },
      }),
    },
    include: {
      user: {
        select: {
          firstname: true,
        },
      },
      client: {
        select: {
          name: true,
        },
      },
    },
  });
};
