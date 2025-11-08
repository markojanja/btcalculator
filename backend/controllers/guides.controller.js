import prisma from "../db/prisma.js";

export const getGuides = async (req, res) => {
  console.log("visited");
  try {
    const data = await prisma.guides.findMany({});

    return res.status(200).json({ data });
  } catch (error) {
    return res.status(500).json({ error: "Something went wrong!!" });
  }
};
