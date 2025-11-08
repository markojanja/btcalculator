import { getAllGuides } from "../services/userGuides.services.js";
import prisma from "../db/prisma.js";

export const getGuides = async (req, res) => {
  try {
    const data = await getAllGuides();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: "Something went wrong!!" });
  }
};

export const addGuide = async (req, res) => {
  const { title, description, published } = req.body;
  console.log(req.body, req.user.id);
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
    return res.status(500).json({ message: "something went wrong!" });
  }
};

export const editGuide = async (req, res) => {
  try {
  } catch (error) {}
};

export const deleteGuide = async (req, res) => {
  try {
  } catch (error) {}
};
