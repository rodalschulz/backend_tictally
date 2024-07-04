import prisma from "../../prisma/prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const deleteUser = async (req, res) => {
  try {
    console.log("Delete user started");
    const { userId } = req.params;
    const { password } = req.body;

    const JWT_SECRET = process.env.JWT_SECRET;
    const authHeader = req.headers.authorization;
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    if (decoded.id !== userId) {
      console.log("Unauthorized");
      return res.status(403).json({ response: "Unauthorized" });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      console.log("Invalid password");
      return res.status(400).json({ response: "Invalid password" });
    }

    await prisma.activity.deleteMany({
      where: { userId: userId },
    });

    await prisma.pending.deleteMany({
      where: { userId: userId },
    });

    await prisma.user.delete({
      where: { id: userId },
    });
    console.log("User's data deleted");

    res.status(200).json({ response: "User deleted" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ response: "User deletion failed", error: error });
  }
};

export default { deleteUser };
