import express from "express";

const router = express.Router();

router.get("/tasks/my_tasks", async (req, res) => {
  console.log(req.user);

  return res.status(200).json({ message: "some data" });
});

export default router;
