import prisma from "../db/prisma.js";

export const getClients = async (req, res) => {
  try {
    const data = await prisma.clients.findMany({
      include: {
        user: {
          select: {
            username: true,
          },
        },
      },
    });

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json("Something went wrong!");
  }
};

export const addClient = async (req, res) => {
  const { name, status, server, platform } = req.body;
  console.log(req.body);

  try {
    const newClient = await prisma.clients.create({
      data: {
        name,
        status,
        server: [server],
        platform: platform,
        userId: req.user.id,
      },
    });

    return res.status(200).json(newClient);
  } catch (error) {
    console.log(error);
    return res.status(500).json("Something went wrong!");
  }
};

export const editClientGet = async (req, res) => {};

export const editClientPost = async (req, res) => {};
