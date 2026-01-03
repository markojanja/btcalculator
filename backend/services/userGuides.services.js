import prisma from "../db/prisma.js";

export const getAllGuides = async () => {
  return await prisma.guides.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      user: {
        select: {
          username: true,
        },
      },
    },
  });
};
