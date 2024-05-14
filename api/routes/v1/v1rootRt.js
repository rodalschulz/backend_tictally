import express from "express";
import v1authCtrl from "../../controllers/v1authCtrl.js";
import authentication from "../../middleware/authMw.js";

import prisma from "../../../prisma/prisma.js";

const v1router = express.Router();

v1router.get("/", async (req, res) => {
  res.status(200).json({
    response: "Welcome to the API. There is no data in this base v1 endpoint.",
  });
});

v1router.post("/register", v1authCtrl.registerUser);
v1router.post("/login", v1authCtrl.loginUser);
v1router.get("/auth", v1authCtrl.isAuthenticated);

// v1router.use(authentication.authCheck);

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
