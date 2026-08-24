const express = require("express");
const cors = require("cors");
const taskRoutes = require("./routes/taskRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ success: true, message: "Checkpoint API is running" });
});

app.get("/api/health", (req, res) => {
  res.json({ success: true, status: "ok" });
});

app.use("/api/tasks", taskRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
