import prisma from "../../prisma/prisma.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
dotenv.config();

import crypto from "crypto";
import email from "../utils/sendEmail.js";

const baseURL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3600"
    : "https://tictally.io";

const JWT_SECRET = process.env.JWT_SECRET;

const registerUser = async (req, res) => {
  try {
    const saltRounds = 10;
    const password = await bcrypt.hash(req.body.password, saltRounds);
    const verificationToken = crypto.randomBytes(32).toString("hex");

    const user = await prisma.user.create({
      data: {
        username: req.body.username.toLowerCase(),
        email: req.body.email.toLowerCase(),
        password: password,
        verificationToken: verificationToken,
        verified: false,
      },
    });

    const subject = "Email Verification";
    const text = `Please verify your email by clicking the following link: ${baseURL}/verify-email?token=${verificationToken}`;

    await email.sendEmail(user.email, subject, text);

    res.status(201).json({
      response:
        "User successfully registered. Please check your email to verify your account. Don't forget to check your spam folder.",
    });
    console.log("User successfully registered. Verification email sent.");
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .json({ response: "User registration failed", error: error });
  }
};

const verifyEmail = async (req, res) => {
  const { token } = req.query;
  console.log(token);

  try {
    const user = await prisma.user.findFirst({
      where: { verificationToken: token },
    });

    if (!user) {
      console.log("Invalid or expired verification token");
      return res
        .status(400)
        .json({ response: "Invalid or expired verification token" });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { verified: true, verificationToken: "" },
    });

    res.status(200).json({ response: "Email successfully verified" });
    console.log("Email successfully verified. You can now sign in.");
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .json({ response: "Email verification failed", error: error });
  }
};

const loginUser = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        username: req.body.username.toLowerCase(),
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
    if (!user.verified) {
      return res.status(400).json({ response: "Email not verified" });
    }
    console.log("user:", user);

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.globalRole },
      JWT_SECRET,
      {
        expiresIn: "6h",
      }
    );
    console.log("Console: User logged in");

    res
      .status(200)
      .json({ response: "User logged in", token: token, id: user.id });
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
    res
      .status(200)
      .json({ response: true, message: "Authorized", id: decoded.id });
  } catch (error) {
    res.status(403).json({ response: false, message: "Unauthenticated" });
  }
};

const passwordRecovery = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { email: req.body.email.toLowerCase() },
    });

    if (!user) {
      return res.status(400).json({ response: "User not found" });
    }

    const verificationToken = crypto.randomBytes(32).toString("hex");

    await prisma.user.update({
      where: { id: user.id },
      data: { verificationToken: verificationToken },
    });

    const subject = "Password Recovery";
    const text = `Please click the following link to reset your password: ${baseURL}/password-reset?token=${verificationToken}`;

    await email.sendEmail(user.email, subject, text);
    res.status(200).json({ response: "Password recovery email sent" });
  } catch (error) {
    res
      .status(400)
      .json({ response: "Password recovery failed", error: error });
  }
};

const passwordReset = async (req, res) => {
  try {
    const { token, password } = req.body;

    const user = await prisma.user.findFirst({
      where: { verificationToken: token },
    });

    if (!user) {
      return res.status(400).json({ response: "Invalid or expired token" });
    }

    const saltRounds = 10;
    const newPassword = await bcrypt.hash(password, saltRounds);

    await prisma.user.update({
      where: { id: user.id },
      data: { password: newPassword, verificationToken: "" },
    });

    res.status(200).json({ response: "Password successfully reset" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ response: "Password reset failed", error: error });
  }
};

export default {
  registerUser,
  loginUser,
  isAuthenticated,
  verifyEmail,
  passwordRecovery,
  passwordReset,
};
