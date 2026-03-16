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

export const addUser = async (req, res, next) => {
  console.log(req.body);
  const {
    firstname,
    lastname,
    username,
    email,
    password,
    active,
    role,
    centroid,
  } = req.body;

  try {
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email: email }, { username: username }],
      },
    });

    if (existingUser) {
      return res
        .status(409)
        .json({ message: "User with this email or username already exists." });
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
    next(error);
  }
};

export const editUserGet = async (req, res, next) => {
  const { id } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: { id: id },
      select: {
        id: true,
        firstname: true,
        lastname: true,
        username: true,
        email: true,
        role: true,
        active: true,
        centroid: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    return res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const editUserPut = async (req, res, next) => {
  const { id } = req.params;
  const { firstname, lastname, username, email, role, active, centroid } =
    req.body;

  try {
    const updateData = {
      firstname,
      lastname,
      username,
      email,
      role,
      active,
      centroid,
    };
    await prisma.user.update({
      where: {
        id: id,
      },
      data: updateData,
    });

    res.status(201).json({ message: "userupdated" });
  } catch (error) {
    next(error);
  }
};
