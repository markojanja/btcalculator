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
      orderBy: {
        createdAt: "desc",
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

export const editClientGet = async (req, res) => {
  const { id } = req.params;

  try {
    const client = await prisma.clients.findUnique({
      where: {
        id: id,
      },
    });

    return res.status(200).json(client);
  } catch (error) {
    return res.status(500).json("Something went wrong!");
  }
};

export const editClientPost = async (req, res) => {
  const { id } = req.params;
  const { name, status, server, platform } = req.body;
  console.log(req.body);

  try {
    const data = { name, status, server: [server], platform: platform };
    console.log(data);
    await prisma.clients.update({
      where: {
        id: id,
      },
      data: data,
    });
    return res.status(201).json({ message: "client updated" });
  } catch (error) {
    return res.status(500).json("Something went wrong!");
  }
};

export const activeClients = async (req, res) => {
  try {
    const activeClients = await prisma.clients.findMany({
      where: {
        status: "ACTIVE",
      },
      select: {
        id: true,
        name: true,
      },
    });

    return res.status(200).json(activeClients);
  } catch (error) {
    return res.status(500).json("Something went wrong!");
  }
};
