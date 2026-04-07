import { getAllGuides } from "../services/userGuides.services.js";
import prisma from "../db/prisma.js";

export const getGuides = async (req, res, next) => {
  try {
    const data = await getAllGuides();
    return res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

export const getGuide = async (req, res, next) => {
  const { id } = req.params;
  try {
    const guide = await prisma.guides.findUnique({
      where: {
        id: id,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });
    return res.status(200).json(guide);
  } catch (error) {
    next(error);
  }
};

export const addGuide = async (req, res, next) => {
  const { title, description, published } = req.body;

  try {
    const newGuide = await prisma.guides.create({
      data: {
        title,
        description,
        published,
        userId: req.user.id,
      },
    });
    return res.status(201).json(newGuide);
  } catch (error) {
    next(error);
  }
};

export const editGuideGet = async (req, res, next) => {
  const { id } = req.params;

  try {
    const guide = await prisma.guides.findUnique({
      where: {
        id: id,
      },
    });
    return res.status(200).json(guide);
  } catch (error) {
    next(error);
  }
};

export const editGuidePut = async (req, res, next) => {
  const { id } = req.params;
  const { title, description, published } = req.body;
  try {
    const data = {
      title,
      description,
      published,
    };
    console.log(data);
    const guidesToEdit = await prisma.guides.update({
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

//todo
export const deleteGuide = async (req, res) => {
  try {
  } catch (error) {}
};
