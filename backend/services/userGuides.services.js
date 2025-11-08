import prisma from "../db/prisma.js";

export const getAllGuides = async () => {
  return await prisma.guides.findMany({
    include: {
      user: {
        select: {
          username: true,
        },
      },
    },
  });
};
