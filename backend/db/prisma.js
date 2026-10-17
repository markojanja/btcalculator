import { PrismaClient } from "@prisma/client";

const databaseUrl =
  process.env.NODE_ENV === "production"
    ? process.env.DATABASE_URL_PROD
    : process.env.DATABASE_URL;

process.env.DATABASE_URL = databaseUrl;

// Password hashes are never returned unless a query opts in with
// `omit: { password: false }` (login and password change only).
const prisma = new PrismaClient({
  omit: {
    user: { password: true },
  },
});

export default prisma;
