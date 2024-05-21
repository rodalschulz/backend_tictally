import express from "express";
import v1authCtrl from "../../controllers/v1authCtrl.js";
import authentication from "../../middleware/authMw.js";
import prisma from "../../../prisma/prisma.js";

import fs from "fs";
import path from "path";
import multer from "multer";
import csv from "csv-parser";
import { fileURLToPath } from "url";

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
      orderBy: [{ date: "desc" }, { startTime: "desc" }],
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
      totalTimeMin,
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
        adjustment: +adjustment,
        totalTimeMin: +totalTimeMin,
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

v1router.patch("/users/:userId/activity-data", async (req, res) => {
  try {
    console.log("PATCH request received");
    const { userId } = req.params;
    const { entryId, data } = req.body;

    if (data.adjustment) {
      // Convert adjustment to integer
      data.adjustment = +data.adjustment;
    }
    if (data.totalTimeMin) {
      // Convert totalTimeMin to integer
      data.totalTimeMin = +data.totalTimeMin;
    }

    const dbResponse = await prisma.activity.update({
      where: {
        userId: userId,
        id: entryId,
      },
      data: data,
    });
    res.status(200).json({ response: "User activity updated correctly." });
  } catch (error) {
    console.log(`Error: ${error}`);
    res
      .status(400)
      .json({ response: "Error updating user activity data", error: error });
  }
});

// Convert import.meta.url to __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads directory exists
const uploadDirectory = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, { recursive: true });
}

// Multer config
const upload = multer({
  dest: uploadDirectory,
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== "text/csv") {
      return cb(new Error("Only CSV files are allowed!"), false);
    }
    cb(null, true);
  },
});

v1router.post(
  "/users/:userId/upload-csv",
  upload.single("file"),
  async (req, res) => {
    const { userId } = req.params;

    if (!req.file) {
      return res
        .status(400)
        .json({ error: "No file uploaded or invalid file type" });
    }

    const filePath = path.join(uploadDirectory, req.file.filename);
    const results = [];

    fs.createReadStream(filePath)
      .pipe(
        csv({
          mapHeaders: ({ header, index }) => header.trim(),
        })
      )
      .on("data", (data) => {
        const parsedData = {
          date: data["date"],
          description: data["description"],
          category: data["category"],
          subcategory: data["subcategory"],
          startTime: data["startTime"],
          endTime: data["endTime"],
          adjustment: parseInt(data["adjustment"], 10),
          totalTimeMin: parseInt(data["totalTimeMin"], 10),
          timezone: data["timezone"],
          userId: userId,
        };
        results.push(parsedData);
      })
      .on("end", async () => {
        try {
          if (results.length === 0) {
            throw new Error("No data found in CSV file");
          }

          await prisma.activity.createMany({
            data: results,
          });

          // Delete the uploaded file after processing
          fs.unlinkSync(filePath);

          res.status(200).json({
            message: "CSV file successfully uploaded and data saved.",
          });
        } catch (error) {
          console.error(error);
          // Ensure the file is deleted even if there is an error
          fs.unlinkSync(filePath);
          res.status(500).json({
            error: "An error occurred while processing the CSV file.",
          });
        }
      })
      .on("error", (error) => {
        console.error("Error reading CSV file:", error);
        // Ensure the file is deleted if there is an error
        fs.unlinkSync(filePath);
        res.status(500).json({
          error: "An error occurred while reading the CSV file.",
        });
      });
  }
);

export default v1router;
