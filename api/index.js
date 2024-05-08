import express from "express";
import cors from "cors";
import v1router from "./routes/v1/v1rootRt.js";

const app = express();
const port = 3000;

const allowedOrigins = ["https://frontend-dummy.vercel.app/"];
const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

app.use(express.json());
// Use CORS middleware with specific origin validation
app.use(cors(corsOptions));

app.get("/", (req, res) => {
  res.redirect("/v1");
});

app.use("/v1", v1router);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
