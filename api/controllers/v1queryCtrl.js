import prisma from "../../prisma/prisma.js";
import datetimeUtl from "../utils/datetimeUtl.js";

const queryActivities = async (req, res) => {
  try {
    const { userId } = req.params;
    const { description, category, subcategory, date, date2 } = req.query;

    const filters = {
      userId: userId,
      ...(description && {
        description: { contains: description, mode: "insensitive" },
      }),
      ...(category && { category: category }),
      ...(subcategory && { subcategory: subcategory }),
      ...(date && !date2 && { date: new Date(date) }),
      ...(date &&
        date2 && {
          date: {
            gte: new Date(date),
            lte: new Date(date2),
          },
        }),
    };

    const userActivityData = await prisma.activity.findMany({
      where: filters,
      orderBy: [{ date: "desc" }, { startTime: "desc" }],
    });

    userActivityData.sort((a, b) => {
      if (a.date > b.date) {
        return -1;
      } else if (a.date < b.date) {
        return 1;
      } else {
        return (
          datetimeUtl.timeStringToMinutes(b.startTime) -
          datetimeUtl.timeStringToMinutes(a.startTime)
        );
      }
    });

    let totalSum = 0;
    for (const entry of userActivityData) {
      totalSum += entry.totalTimeMin;
    }
    res.status(200).json({ userActivityData, totalSum });
  } catch (error) {
    console.error(error);
    res
      .status(400)
      .json({ response: "Error fetching user activity data", error: error });
  }
};

const querySubcatsToTrack = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log(userId);
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    const subcatsToTrack = user.categConfig.subcatsToTrack;
    const subcatResults = {};

    for (const entry of subcatsToTrack) {
      const subcat = entry.subcat;
      const startDate = entry.startDate;

      const queriedData = await prisma.activity.findMany({
        where: {
          userId: userId,
          subcategory: subcat,
          date: {
            gte: new Date(startDate),
            lte: new Date(),
          },
        },
      });

      let subcatSum = 0;
      queriedData.forEach((entry) => {
        subcatSum += entry.totalTimeMin;
      });

      subcatResults[subcat] = subcatSum;
    }

    res.status(200).json({ subcatResults });
  } catch (error) {
    console.error(error);
    res
      .status(400)
      .json({ response: "Error fetching subcats to track", error: error });
  }
};

export default { queryActivities, querySubcatsToTrack };
