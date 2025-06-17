import prisma from "../db/prisma.js";
import bcrypt from "bcryptjs";

export const getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({});
    return res.status(200).json(users);
  } catch (error) {
    console.log(error);
  }
};

export const addUser = async (req, res) => {
  console.log(req.body);
  const { firstname, lastname, username, email, password, active, role, centroid } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (existingUser) {
      return res.status(401).json({ message: "User with this email already exists." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userToAdd = {
      firstname,
      lastname,
      username,
      password: hashedPassword,
      email,
      active,
      role,
      centroid,
    };

    const newUser = await prisma.user.create({
      data: {
        ...userToAdd,
      },
    });

    return res.status(200).json({ message: "user created!", newUser });
  } catch (error) {
    console.log(error);
  }
};
