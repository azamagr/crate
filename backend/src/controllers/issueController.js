const Issue = require("../models/Issue");

// GET /api/issues
async function getIssues(req, res, next) {
  try {
    const issues = await Issue.find().sort({ createdAt: -1 });
    res.json({ success: true, data: issues });
  } catch (err) {
    next(err);
  }
}

// POST /api/issues
async function createIssue(req, res, next) {
  try {
    const { title, description, priority } = req.body;
    const issue = await Issue.create({ title, description, priority });
    res.status(201).json({ success: true, data: issue });
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

// DELETE /api/issues/:id
async function deleteIssue(req, res, next) {
  try {
    const issue = await Issue.findByIdAndDelete(req.params.id);
    if (!issue) {
      return res.status(404).json({ success: false, message: "Issue not found" });
    }
    res.json({ success: true, data: issue });
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(400).json({ success: false, message: "Invalid issue id" });
    }
    next(err);
  }
}

module.exports = { getIssues, createIssue, deleteIssue };
