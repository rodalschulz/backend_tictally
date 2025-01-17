import cors from "cors";

const allowedOrigins = ["https://tictally.io", "https://www.tictally.io"];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

const corsConfig = (app) => {
  const isDev = process.env.NODE_ENV === "development";

  if (isDev) {
    app.use(cors());
    console.log("Console: CORS enabled for all origins");
  } else {
    app.use(cors(corsOptions));
    console.log("Console: CORS enabled for tictally.io and www.tictally.io");
  }
};

export default { corsConfig };