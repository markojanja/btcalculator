import express from "express";
import prisma from "../db/prisma.js";

const router = express.Router();

router.get("/stats/users/:id", async (req, res, next) => {
  const { id } = req.params;

  try {
    const result = await prisma.$queryRaw`
  SELECT
    COUNT(*)::INT AS "totalTasks",

    COUNT(*) FILTER (
      WHERE "status" = 'COMPLETED'
    )::INT AS "completed",

    COUNT(*) FILTER (
      WHERE "status" = 'CS_TICKET'
    )::INT AS "csTicket",

    COUNT(*) FILTER (
      WHERE "status" = 'IT_TICKET'
    )::INT AS "itTicket"

  FROM "Tasks"
  WHERE "userId" = ${id};
`;

    return res.json(result[0]);
  } catch (error) {
    console.log("FULL ERROR:", error);
    next(error);
  }
});

export default router;
