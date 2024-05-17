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

v1router.use(authentication.authCheck);

v1router.get("/users/:userId/activity-data", async (req, res) => {
  try {
    const { userId } = req.params;
    const userActivityData = await prisma.activity.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        date: "desc", // Order by the `date` field in descending order
      },
    });
    res.status(200).json({ userActivityData });
  } catch (error) {
    console.error(error);
    res
      .status(400)
      .json({ response: "Error fetching user activity data", error: error });
  }
});

v1router.post("/users/:userId/activity-data", async (req, res) => {
  try {
    const { userId } = req.params;
    const {
      date,
      description,
      category,
      subcategory,
      startTime,
      endTime,
      adjustment,
      timezone,
    } = req.body;
    const newUserActivity = await prisma.activity.create({
      data: {
        userId: userId,
        date: date,
        description: description,
        category: category,
        subcategory: subcategory,
        startTime: startTime,
        endTime: endTime,
        adjustment: adjustment,
        timezone: timezone,
      },
    });
    res.status(201).json({ response: "User activity data created" });
  } catch (error) {
    console.error(error);
    res
      .status(400)
      .json({ response: "Error creating user activity data", error: error });
  }
});

v1router.delete("/users/:userId/activity-data", async (req, res) => {
  try {
    const { userId } = req.params;
    const { entryId } = req.body;
    const dbResponse = await prisma.activity.delete({
      where: {
        userId: userId,
        id: entryId,
      },
    });
    res.status(200).json({ response: "User activity deleted correctly." });
  } catch (error) {
    console.log(`Error: ${error}`);
    res
      .status(400)
      .json({ response: "Error deleting user activity data", error: error });
  }
});

export default v1router;
