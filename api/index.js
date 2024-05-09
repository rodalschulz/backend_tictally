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

app.use(express.json());
app.use(cors(corsOptions));
// app.use(cors());

// app.use((req, res, next) => {
//   const userAgent = req.get("User-Agent");
//   const allowedUserAgent =
//     "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";
//   if (userAgent === allowedUserAgent) {
//     next();
//   } else {
//     res.status(403).send("Forbidden");
//   }
// });

app.get("/", (req, res) => {
  res.redirect("/v1");
});

app.use("/v1", v1router);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
