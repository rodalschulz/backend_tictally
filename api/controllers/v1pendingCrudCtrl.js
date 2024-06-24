import prisma from "../../prisma/prisma.js";

const createPending = async (req, res) => {
  try {
    const { userId } = req.params;
    const { date, time, description, category, relevUrgen, periodRecurrence } =
      req.body;
    await prisma.pending.create({
      data: {
        userId: userId,
        date: date ? new Date(date) : null,
        time: time,
        description: description,
        category: category,
        relevUrgen: relevUrgen,
        periodRecurrence: periodRecurrence,
        state: false,
      },
    });
    console.log("User pending task created");
    res.status(201).json({ response: "User pending task created" });
  } catch (error) {
    console.error(error);
    res
      .status(400)
      .json({ response: "Error creating user pending task", error: error });
  }
};

const readPending = async (req, res) => {
  try {
    const { userId } = req.params;
    const { daysTotal } = req.query;

    const now = new Date();
    const filters = {
      userId: userId,
      periodRecurrence: "",
    };

    let nonRecurringTasks = [];
    if (daysTotal && !isNaN(parseInt(daysTotal))) {
      const daysForward = parseInt(daysTotal);

      const startDate = new Date(now);
      startDate.setDate(now.getDate() - 2);
      startDate.setHours(0, 0, 0, 0);

      const futureDate = new Date(now);
      futureDate.setDate(now.getDate() + daysForward);
      futureDate.setHours(23, 59, 59, 999);

      filters.OR = [
        {
          date: {
            gte: startDate,
            lte: futureDate,
          },
        },
        {
          AND: [{ date: null }, { state: false }],
        },
        {
          AND: [
            { date: null },
            { state: true },
            {
              updatedAt: {
                gte: startDate,
                lte: futureDate,
              },
            },
          ],
        },
      ];

      const queryOptions = {
        where: filters,
        orderBy: [{ date: "asc" }, { time: "asc" }],
      };

      nonRecurringTasks = await prisma.pending.findMany(queryOptions);
    }

    const recurringTasks = await prisma.pending.findMany({
      where: {
        userId: userId,
        periodRecurrence: { not: "" },
      },
      orderBy: [{ date: "asc" }, { time: "asc" }],
    });

    // Combine non-recurring and recurring tasks
    const userPendingTasks = [...nonRecurringTasks, ...recurringTasks];

    // Sort combined tasks
    userPendingTasks.sort((a, b) => {
      const relevanceOrder = {
        "HIGH | HIGH": 1,
        "HIGH | AVG": 2,
        "HIGH | LOW": 3,
        "AVG | HIGH": 4,
        "AVG | AVG": 5,
        "AVG | LOW": 6,
        "LOW | HIGH": 7,
        "LOW | AVG": 8,
        "LOW | LOW": 9,
      };

      if (relevanceOrder[a.relevUrgen] < relevanceOrder[b.relevUrgen])
        return -1;
      if (relevanceOrder[a.relevUrgen] > relevanceOrder[b.relevUrgen]) return 1;

      return 0;
    });

    res.status(200).json({ userPendingTasks });
  } catch (error) {
    console.error(error);
    res
      .status(400)
      .json({ response: "Error fetching user pending tasks", error: error });
  }
};

const updatePending = async (req, res) => {
  try {
    const { userId } = req.params;
    const { entryIds, data } = req.body;

    console.log(data.state);

    if (!Array.isArray(entryIds)) {
      return res.status(400).json({ response: "entryIds should be an array." });
    }

    const updatePromises = entryIds.map(async (entryId) => {
      const pendingTask = await prisma.pending.findUnique({
        where: {
          userId: userId,
          id: entryId,
        },
      });

      // if (data.state === true && pendingTask.periodRecurrence) {
      //   return null;
      // }

      return prisma.pending.update({
        where: {
          userId: userId,
          id: entryId,
        },
        data: data,
      });
    });

    await Promise.all(updatePromises.filter(Boolean));

    res.status(200).json({ response: "User pending tasks updated" });
  } catch (error) {
    console.error(error);
    res
      .status(400)
      .json({ response: "Error updating user pending task", error: error });
  }
};

const deletePending = async (req, res) => {
  try {
    const { userId } = req.params;
    const { entryIds } = req.body;

    await prisma.pending.deleteMany({
      where: {
        userId: userId,
        id: { in: entryIds },
      },
    });

    res.status(200).json({ response: "User pending tasks deleted" });
  } catch (error) {
    console.error(error);
    res
      .status(400)
      .json({ response: "Error deleting user pending tasks", error: error });
  }
};

export default { createPending, readPending, updatePending, deletePending };
