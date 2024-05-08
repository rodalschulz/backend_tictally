import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.MONGO_URL,
    },
  },
});

export default prisma;
