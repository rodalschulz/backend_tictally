import express from "express";
import multer from "multer";

import v1authCtrl from "./controllers/v1authCtrl.js";
import v1crudCtrl from "./controllers/v1crudCtrl.js";
import v1queryCtrl from "./controllers/v1queryCtrl.js";
import v1userConfigCtrl from "./controllers/v1userConfigCtrl.js";
import authMw from "./middleware/authMw.js";
import corsMw from "./middleware/v1corsMw.js";
import apiKeyMw from "./middleware/v1apiKeyMw.js";

const app = express();
app.use(express.json());
corsMw.corsConfig(app);
app.use(apiKeyMw.apiKeyCheck);

app.get("/", (req, res) => {
  res.redirect("/v1");
});

const v1router = express.Router();

v1router.get("/", async (req, res) => {
  res.status(200).json({
    response: "Welcome to the API. There is no data in this base v1 endpoint.",
  });
});

v1router.post("/register", v1authCtrl.registerUser);
v1router.post("/login", v1authCtrl.loginUser);
v1router.get("/auth", v1authCtrl.isAuthenticated);
v1router.get("/verify-email", v1authCtrl.verifyEmail);
v1router.use(authMw.authCheck);

v1router.get("/users/:userId/activity-data", v1crudCtrl.readActivities);
v1router.post("/users/:userId/activity-data", v1crudCtrl.createActivity);
v1router.patch("/users/:userId/activity-data", v1crudCtrl.updateActivity);
v1router.delete("/users/:userId/activity-data", v1crudCtrl.deleteActivity);

const upload = multer({ storage: multer.memoryStorage() });
v1router.post(
  "/users/:userId/upload-csv",
  upload.single("file"),
  v1crudCtrl.uploadActivities
);
v1router.get("/users/:userId/download-activity", v1crudCtrl.downloadActivities);

v1router.get("/users/:userId/query-activity-data", v1queryCtrl.queryActivities);

v1router.get(
  "/users/:userId/category-config",
  v1userConfigCtrl.readCategConfig
);
v1router.patch(
  "/users/:userId/category-config",
  v1userConfigCtrl.updateCategConfig
);

app.use("/v1", v1router);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
