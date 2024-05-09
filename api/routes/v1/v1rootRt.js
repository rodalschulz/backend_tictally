import express from "express";
import v1authCtrl from "../../controllers/v1authCtrl.js";
import authentication from "../../middleware/authMw.js";

import prisma from "../../../prisma/prisma.js";

const v1router = express.Router();

v1router.get("/", async (req, res) => {
  const usernames = await prisma.user.findMany({
    select: {
      username: true,
      role: true,
    },
  });
  res.status(200).json({ usernames });
});

v1router.post("/register", v1authCtrl.registerUser);
v1router.post("/login", v1authCtrl.loginUser);

v1router.use(authentication.authCheck);

v1router.get("/members", async (req, res) => {
  const members = await prisma.user.findMany({
    select: {
      username: true,
      email: true,
    },
  });
  res.status(200).json({ members });
});

export default v1router;
