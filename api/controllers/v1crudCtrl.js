import prisma from "../../prisma/prisma.js";
import csv from "csv-parser";
import stream from "stream";

const createActivity = async (req, res) => {
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
};

const readActivities = async (req, res) => {
  try {
    const { userId } = req.params;
    const userActivityData = await prisma.activity.findMany({
      where: {
        userId: userId,
      },
      orderBy: [{ date: "desc" }, { startTime: "desc" }],
      take: 350,
    });
    res.status(200).json({ userActivityData });
  } catch (error) {
    console.error(error);
    res
      .status(400)
      .json({ response: "Error fetching user activity data", error: error });
  }
};

const updateActivity = async (req, res) => {
  try {
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
};

const deleteActivity = async (req, res) => {
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
};

const uploadActivities = async (req, res) => {
  const { userId } = req.params;

  if (!req.file) {
    return res
      .status(400)
      .json({ error: "No file uploaded or invalid file type" });
  }

  const results = [];
  const bufferStream = new stream.PassThrough();
  bufferStream.end(req.file.buffer);

  bufferStream
    .pipe(csv({ mapHeaders: ({ header, index }) => header.trim() }))
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

        res.status(200).json({
          message: "CSV file successfully uploaded and data saved.",
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({
          error: "An error occurred while processing the CSV file.",
        });
      }
    })
    .on("error", (error) => {
      console.error("Error reading CSV file:", error);
      res.status(500).json({
        error: "An error occurred while reading the CSV file.",
      });
    });
};

const downloadActivities = async (req, res) => {
  const { userId } = req.params;

  try {
    const activities = await prisma.activity.findMany({
      where: { userId: userId },
      orderBy: [{ date: "desc" }, { startTime: "desc" }],
    });

    if (!activities || activities.length === 0) {
      return res.status(404).json({ error: "No activity data found" });
    }

    const fields = [
      "date",
      "description",
      "category",
      "subcategory",
      "startTime",
      "endTime",
      "adjustment",
      "totalTimeMin",
      "timezone",
    ];

    // Manually construct the CSV
    let csv = fields.join(",") + "\n";
    activities.forEach((activity) => {
      const row = fields
        .map((field) => {
          if (field === "date") {
            // Convert the date field to ISO string
            return new Date(activity[field]).toISOString();
          }
          return activity[field] || "";
        })
        .join(",");
      csv += row + "\n";
    });

    res.header("Content-Type", "text/csv");
    res.attachment("activity-data.csv");
    return res.send(csv);
  } catch (error) {
    console.error("Error generating CSV:", error);
    res
      .status(500)
      .json({ error: "An error occurred while generating the CSV file" });
  }
};

export default {
  createActivity,
  readActivities,
  updateActivity,
  deleteActivity,
  uploadActivities,
  downloadActivities,
};
