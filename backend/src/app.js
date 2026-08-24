const express = require("express");
const cors = require("cors");
const issueRoutes = require("./routes/issueRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ success: true, message: "Crate API is running" });
});

app.get("/api/health", (req, res) => {
  res.json({ success: true, status: "ok" });
});

app.use("/api/issues", issueRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
