import prisma from "../../prisma/prisma.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

const registerUser = async (req, res) => {
  try {
    const saltRounds = 8;
    const password = await bcrypt.hash(req.body.password, saltRounds);
    const user = await prisma.user.create({
      data: {
        username: req.body.username,
        email: req.body.email,
        password: password,
      },
    });
    res.status(201).json({ response: "User successfully registered" });
    console.log("User successfully registered");
  } catch (error) {
    console.log(error);
    res.status(400).json({ response: "User registration failed" });
  }
};

const loginUser = async (req, res) => {
  try {
    console.log("Console: Checking user's credentials");
    const user = await prisma.user.findUnique({
      where: {
        username: req.body.username,
      },
    });
    if (!user) {
      return res.status(400).json({ response: "User not found" });
    }
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword) {
      return res.status(400).json({ response: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );
    console.log("Console: User logged in");

    res.status(200).json({ response: "User logged in", token: token });
  } catch (error) {
    console.log(error);
    res.status(400).json({ response: "User login failed" });
  }
};

export default { registerUser, loginUser };
