import prisma from "../db/prisma.js";

export const getFeatures = async (req, res) => {
  if (req.user.role === "ADMIN" || req.user.role === "MANAGER") {
    const getAllFeatures = await prisma.features.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: {
          select: { username: true },
        },
      },
    });

    return res.status(200).json(getAllFeatures);
  }
  const publishedFeatures = await prisma.features.findMany({
    orderBy: {
      createdAt: "desc",
    },
    where: {
      published: true,
    },
    include: {
      user: {
        select: {
          username: true,
        },
      },
    },
  });
  if (!publishedFeatures) {
    return res
      .status(200)
      .json({ message: "No new features are published yet!" });
  }
  return res.status(200).json(publishedFeatures);
};

export const featureDeatils = async (req, res) => {
  const { id } = req.params;
  try {
    const feature = await prisma.features.findUnique({
      where: {
        id: id,
      },
      include: {
        user: {
          select: {
            username: true,
          },
        },
      },
    });
    return res.status(200).json(feature);
  } catch (error) {
    return res.status(500).json({ message: "something went wrong!" });
  }
};

export const addFeature = async (req, res) => {
  const { title, description, releaseDate, released, published } = req.body;
  console.log(req.body, req.user.id);
  try {
    const formattedDate = new Date(releaseDate);

    const newFeature = await prisma.features.create({
      data: {
        title,
        description,
        releaseDate: formattedDate,
        released,
        published,
        userId: req.user.id,
      },
    });
    return res.status(201).json(newFeature);
  } catch (error) {
    return res.status(500).json({ message: "something went wrong!" });
  }
};

export const editFeatueGet = async (req, res) => {
  const { id } = req.params;
  try {
    const feature = await prisma.features.findUnique({
      where: {
        id: id,
      },
    });
    return res.status(200).json(feature);
  } catch (error) {
    return res.status(500).json({ message: "something went wrong!" });
  }
};

export const editFeaturePut = async (req, res) => {
  const { id } = req.params;
  const { title, description, releaseDate, released, published } = req.body;
  try {
    const data = {
      title,
      description,
      released,
      releaseDate: releaseDate ? new Date(releaseDate) : null,
      published,
      userId: req.user.id,
    };
    console.log(data);
    const featureToEdit = await prisma.features.update({
      where: {
        id: id,
      },
      data: data,
    });
    return res.status(201).json({ message: "feature updated" });
  } catch (error) {
    return res.status(500).json({ message: "something went wrong!" });
  }
};
