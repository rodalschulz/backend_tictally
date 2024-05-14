const validApiKey = process.env.VALID_API_KEY;

const apiKeyCheck = (req, res, next) => {
  const isDev = process.env.NODE_ENV === "development";
  if (isDev) {
    next();
  } else {
    const apiKey = req.headers["x-api-key"];

    if (!apiKey || apiKey !== validApiKey) {
      return res.status(401).json({ error: "Unauthorized. Invalid API Key." });
    }
    next();
  }
};

export default { apiKeyCheck };
