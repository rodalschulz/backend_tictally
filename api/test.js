import prisma from "../prisma/prisma.js";

const users = await prisma.user.findMany();
console.log(user);
