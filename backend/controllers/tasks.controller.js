import prisma from "../db/prisma.js";

export const myTasks = async (req, res) => {
  const user = req.user;
  console.log("Fetching tasks...");
  const COLUMNS = [
    { title: "TODO", colStatus: "TODO" },
    { title: "IN PROGRESS", colStatus: "IN_PROGRESS" },
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
    const { title, description, priority, status } = req.body;

    console.log(req.body);

    const newTask = await prisma.tasks.create({
      data: {
        title,
        description,
        priority,
        status,
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
  const { id, title, description, status, priority, userId } = req.body;
  try {
    const updatedFields = {};
    if (title) updatedFields.title = title;
    if (description) updatedFields.description = description;
    if (status) updatedFields.status = status;
    if (priority) updatedFields.priority = priority;
    if (userId) updatedFields.userId = userId;

    const updatedTask = await prisma.tasks.update({
      where: { id },
      data: updatedFields,
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
