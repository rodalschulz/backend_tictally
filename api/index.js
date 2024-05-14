import express from "express";
import v1router from "./routes/v1/v1rootRt.js";
import corsMw from "./middleware/v1corsMw.js";
import apiKeyMw from "./middleware/v1apiKeyMw.js";

const app = express();
app.use(express.json());
corsMw.corsConfig(app);
app.use(apiKeyMw.apiKeyCheck);

app.get("/", (req, res) => {
  res.redirect("/v1");
});
app.use("/v1", v1router);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
