import prisma from "../../prisma/prisma.js";

const createPending = async (req, res) => {
  try {
    const { userId } = req.params;
    const {
      date,
      time,
      description,
      relevance,
      urgency,
      recurring,
      periodRecurrence,
    } = req.body;
    await prisma.pending.create({
      data: {
        userId: userId,
        date: date,
        time: time,
        description: description,
        relevance: relevance,
        urgency: urgency,
        recurring: recurring === "true",
        periodRecurrence: periodRecurrence,
        completed: false,
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

    const filters = {
      userId: userId,
    };

    if (daysTotal && !isNaN(parseInt(daysTotal))) {
      const daysForward = parseInt(daysTotal);
      const now = new Date();
      const futureDate = new Date(now);
      futureDate.setDate(now.getDate() + daysForward);

      futureDate.setHours(23, 59, 59, 999);

      filters.date = {
        lte: futureDate,
      };
    }

    const queryOptions = {
      where: filters,
      orderBy: [{ date: "desc" }, { time: "desc" }],
    };

    const userPendingTasks = await prisma.pending.findMany(queryOptions);

    res.status(200).json({ userPendingTasks });
  } catch (error) {
    console.error(error);
    res
      .status(400)
      .json({ response: "Error fetching user pending tasks", error: error });
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

export default { createPending, readPending, deletePending };
