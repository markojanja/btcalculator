import prisma from "../db/prisma.js";

export const myTasks = async (req, res) => {
  const user = req.user;
  console.log("Fetching tasks...");
  const COLUMNS = [
    { title: "TODO", colStatus: "TODO" },
    { title: "IN PROGRESS", colStatus: "IN_ROGRESS" },
    { title: "CS TICKET", colStatus: "CS_TICKET" },
    { title: "IT TICKET", colStatus: "IT_TICKET" },
    { title: "COMPLETED", colStatus: "COMPLETED" },
  ];

  try {
    const tasks = await prisma.tasks.findMany({
      where: {
        userId: user.id,
      },
      include: {
        user: {
          select: {
            username: true,
          },
        },
      },
    });

    const data = COLUMNS.map((col) => ({
      ...col,
      tasks: tasks.filter((task) => task.status === col.colStatus),
    }));

    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

export const addTask = async (req, res) => {
  try {
    const task = req.body;

    const newTask = await prisma.tasks.create({
      data: {
        title: task.title,
        description: task.description,
        priority: task.priority,
        status: task.status,
        userId: req.user.id,
      },
      include: {
        user: {
          select: {
            username: true,
          },
        },
      },
    });

    return res.status(200).json({ message: "Task created", task: newTask });
  } catch (error) {
    return res.status(500).json({ error: "Something went wrong" });
  }
};

export const editTask = async (req, res) => {
  const data = req.body;
  try {
    const updatedTask = await prisma.tasks.update({
      where: {
        id: data.id,
      },
      data: {
        title: data.title,
        description: data.description,
        status: data.status,
        priority: data.priority,
      },
    });
    res.status(200).json({ message: "Task updated", task: updatedTask });
  } catch (error) {
    return res.status(500).json({ error: "Something went wrong" });
  }
};

export const deleteTask = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.tasks.delete({
      where: {
        id: id,
      },
    });
    res.status(200).json({ message: "task deleted" });
  } catch (error) {
    return res.status(500).json({ error: "Something went wrong" });
  }
};
