import prisma from "../../prisma/prisma.js";

const readCategConfig = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        categConfig: true,
      },
    });
    res.status(200).json({ user });
  } catch (error) {
    console.log(`Error: ${error}`);
    res.status(400).json({
      response: "Error fetching user category configuration",
      error: error,
    });
  }
};

const updateCategConfig = async (req, res) => {
  try {
    console.log("updateCategConfig");
    const { userId } = req.params;
    const { data } = req.body;

    if (typeof data !== "object") {
      return res.status(400).json({
        response: "Data must be an object",
      });
    }

    // More validation logic can be added here

    const dbResponse = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        categConfig: data,
      },
    });
    res
      .status(200)
      .json({ response: "User category configuration updated correctly." });
  } catch (error) {
    console.log(`Error: ${error}`);
    res.status(400).json({
      response: "Error updating user category configuration",
      error: error,
    });
  }
};

export default { readCategConfig, updateCategConfig };
