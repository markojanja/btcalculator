import prisma from "../db/prisma.js";

export const getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({});
    return res.status(200).json(users);
  } catch (error) {
    console.log(error);
  }
};
