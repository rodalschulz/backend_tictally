import prisma from "../../prisma/prisma.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

const registerUser = async (req, res) => {
  try {
    const saltRounds = 10;
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
    res
      .status(400)
      .json({ response: "User registration failed", error: error });
  }
};

const loginUser = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        username: req.body.username,
      },
    });
    console.log("User found: ", user);
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

    res
      .status(200)
      .json({ response: "User logged in", token: token, id: user._id });
  } catch (error) {
    console.log(error);
    res.status(400).json({ response: "User login failed", error: error });
  }
};

const isAuthenticated = (req, res) => {
  try {
    const JWT_SECRET = process.env.JWT_SECRET;
    const authHeader = req.headers.authorization;
    const token = authHeader.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .json({ response: false, message: "No token provided" });
    }
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    if (!decoded) {
      return res.status(401).json({ response: false, message: "Unauthorized" });
    }
    res.status(200).json({ response: true, message: "Authorized" });
  } catch (error) {
    res.status(403).json({ response: false, message: "Unauthenticated" });
  }
};

export default { registerUser, loginUser, isAuthenticated };
