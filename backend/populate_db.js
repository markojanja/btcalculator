import { PrismaClient } from "@prisma/client";
import bcryptjs from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminUsername = "tijana.andric";

  const existingAdmin = await prisma.user.findUnique({
    where: { username: adminUsername },
  });

  if (!existingAdmin) {
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash("*110600*", salt);

    await prisma.user.create({
      data: {
        username: adminUsername,
        password: hashedPassword,
        role: "ADMIN",
      },
    });

    console.log("✅ Admin user created.");
  } else {
    console.log("⚠️ Admin user already exists.");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
