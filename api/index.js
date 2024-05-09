import express from "express";
import cors from "cors";
import v1router from "./routes/v1/v1rootRt.js";

const app = express();

const allowedOrigins = ["https://frontend-dummy.vercel.app"];
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

app.use(cors(corsOptions));
// app.use(cors());
app.use(express.json());

const validApiKey = process.env.VALID_API_KEY;
const apiKeyMiddleware = (req, res, next) => {
  const apiKey = req.headers["x-api-key"];

  if (!apiKey || apiKey !== validApiKey) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
};
app.use(apiKeyMiddleware);

app.get("/", (req, res) => {
  res.redirect("/v1");
});

app.use("/v1", v1router);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
