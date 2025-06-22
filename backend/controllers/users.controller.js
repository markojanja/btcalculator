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
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email: email }, { username: username }],
      },
    });

    if (existingUser) {
      return res.status(409).json({ message: "User with this email or username already exists." });
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

export const editUserGet = async (req, res) => {
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
    console.log(user);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    return res.status(200).json(user);
  } catch (error) {
    res.status(500).status({ message: "Something wemt wrong!" });
  }
};

export const editUserPut = async (req, res) => {
  const { id } = req.params;
  const { firstname, lastname, username, email, password, role, active, centroid } = req.body;

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const updateData = {
      firstname,
      lastname,
      username,
      email,
      password: hashedPassword,
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
    console.log(error);
    return res.status(500).json({ message: "something went wrong!" });
  }
};
