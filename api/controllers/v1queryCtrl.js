import prisma from "../../prisma/prisma.js";

const queryActivities = async (req, res) => {
  try {
    const { userId } = req.params;
    const { description, category, subcategory, date } = req.query;

    const filters = {
      userId: userId,
      ...(description && {
        description: { contains: description, mode: "insensitive" },
      }),
      ...(category && { category: category }),
      ...(subcategory && { subcategory: subcategory }),
      ...(date && { date: new Date(date) }),
    };

    const userActivityData = await prisma.activity.findMany({
      where: filters,
      orderBy: [{ date: "desc" }, { startTime: "desc" }],
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

export default { queryActivities };
