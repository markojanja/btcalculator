import { PrismaClient } from "@prisma/client";
import bcryptjs from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const usersToCreate = [
    {
      firstname: "Tijana",
      lastname: "Andric",
      email: "tijana.andric@fairtradingtech.com",
      active: true,
      username: "tijana.andric",
      password: "*110600*",
      role: "ADMIN",
      centroid: true,
    },
    {
      firstname: "Marko",
      lastname: "Janjic",
      email: "marko.m.janjic@gmail.com",
      active: true,
      username: "marko.janjic",
      password: "*110600*",
      role: "ADMIN",
      centroid: true,
    },
  ];

  for (const userData of usersToCreate) {
    const existingUser = await prisma.user.findUnique({
      where: { username: userData.username },
    });

    if (!existingUser) {
      const salt = await bcryptjs.genSalt(10);
      const hashedPassword = await bcryptjs.hash(userData.password, salt);

      await prisma.user.create({
        data: {
          firstname: userData.firstname,
          lastname: userData.lastname,
          email: userData.email,
          active: userData.active,
          username: userData.username,
          password: hashedPassword,
          role: userData.role,
          centroid: userData.centroid,
        },
      });

      console.log(`✅ User "${userData.username}" created.`);
    } else {
      console.log(`⚠️ User "${userData.username}" already exists.`);
    }
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
