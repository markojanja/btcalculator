import prisma from "../db/prisma.js";
import { isStaff } from "../middleware/authorize.js";

export const getFeatures = async (req, res, next) => {
  try {
    const features = await prisma.features.findMany({
      // Unpublished features are visible to staff only.
      where: isStaff(req.user) ? {} : { published: true },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: {
          select: { username: true },
        },
      },
    });

    return res.status(200).json(features);
  } catch (error) {
    next(error);
  }
};

export const featureDeatils = async (req, res, next) => {
  const { id } = req.params;
  try {
    const feature = await prisma.features.findFirst({
      where: {
        id: id,
        // Unpublished features are visible to staff only.
        ...(!isStaff(req.user) && { published: true }),
      },
      include: {
        user: {
          select: {
            username: true,
          },
        },
      },
    });
    if (!feature) {
      return res.status(404).json({ message: "Feature not found." });
    }
    return res.status(200).json(feature);
  } catch (error) {
    next(error);
  }
};

export const addFeature = async (req, res, next) => {
  const { title, description, releaseDate, released, published } = req.body;
  try {
    const newFeature = await prisma.features.create({
      data: {
        title,
        description,
        releaseDate,
        released,
        published,
        userId: req.user.id,
      },
    });
    return res.status(201).json(newFeature);
  } catch (error) {
    next(error);
  }
};

export const editFeatueGet = async (req, res, next) => {
  const { id } = req.params;
  try {
    const feature = await prisma.features.findUnique({
      where: {
        id: id,
      },
    });
    return res.status(200).json(feature);
  } catch (error) {
    next(error);
  }
};

export const editFeaturePut = async (req, res, next) => {
  const { id } = req.params;
  const { title, description, releaseDate, released, published } = req.body;
  try {
    // The original author is kept; an empty release date leaves it unchanged.
    const data = {
      title,
      description,
      released,
      releaseDate,
      published,
    };
    await prisma.features.update({
      where: {
        id: id,
      },
      data: data,
    });
    return res.status(201).json({ message: "feature updated" });
  } catch (error) {
    next(error);
  }
};
