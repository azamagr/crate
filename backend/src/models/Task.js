const mongoose = require("mongoose");

const PRIORITIES = ["low", "medium", "high"];

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      minlength: [2, "Title must be at least 2 characters"],
      maxlength: [120, "Title can't be longer than 120 characters"],
    },
    priority: {
      type: String,
      enum: { values: PRIORITIES, message: "Priority must be low, medium, or high" },
      default: "medium",
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", taskSchema);
module.exports.PRIORITIES = PRIORITIES;
