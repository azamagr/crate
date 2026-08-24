const Task = require("../models/Task");

// GET /api/tasks
async function getTasks(req, res, next) {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.json({ success: true, data: tasks });
  } catch (err) {
    next(err);
  }
}

// POST /api/tasks
async function createTask(req, res, next) {
  try {
    const { title, priority } = req.body;
    const task = await Task.create({ title, priority });
    res.status(201).json({ success: true, data: task });
  } catch (err) {
    if (err.name === "ValidationError") {
      const message = Object.values(err.errors)
        .map((e) => e.message)
        .join(", ");
      return res.status(400).json({ success: false, message });
    }
    next(err);
  }
}

// PUT /api/tasks/:id
async function updateTask(req, res, next) {
  try {
    const { title, priority, completed } = req.body;
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { title, priority, completed },
      { new: true, runValidators: true }
    );

    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }
    res.json({ success: true, data: task });
  } catch (err) {
    if (err.name === "ValidationError") {
      const message = Object.values(err.errors)
        .map((e) => e.message)
        .join(", ");
      return res.status(400).json({ success: false, message });
    }
    if (err.name === "CastError") {
      return res.status(400).json({ success: false, message: "Invalid task id" });
    }
    next(err);
  }
}

// DELETE /api/tasks/:id
async function deleteTask(req, res, next) {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }
    res.json({ success: true, data: task });
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(400).json({ success: false, message: "Invalid task id" });
    }
    next(err);
  }
}

module.exports = { getTasks, createTask, updateTask, deleteTask };
