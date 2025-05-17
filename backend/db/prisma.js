import { PrismaClient } from "@prisma/client";

const databaseUrl =
  process.env.NODE_ENV === "production"
    ? process.env.DATABASE_URL_PROD
    : process.env.DATABASE_URL_DEV;

process.env.DATABASE_URL = databaseUrl;

const prisma = new PrismaClient();

export default prisma;
