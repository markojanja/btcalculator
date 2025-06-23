import prisma from "../db/prisma.js";

export const getFeatures = async (req, res) => {};

export const getPublishedFeatures = async (req, res) => {
  const publishedFeatures = await prisma.features.findMany({
    where: {
      published: true,
    },
  });
  if (!publishedFeatures) {
    return res.status(200).json({ message: "No new features are published yet!" });
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

export const editFeatueGet = async (req, res) => {};

export const editFeaturePost = async (req, res) => {};
