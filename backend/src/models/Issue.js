const mongoose = require("mongoose");

const PRIORITIES = ["low", "medium", "high"];
const STATUSES = ["open", "closed"];

const issueSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      minlength: [3, "Title must be at least 3 characters"],
      maxlength: [120, "Title can't be longer than 120 characters"],
    },
    description: {
      type: String,
      trim: true,
      default: "",
      maxlength: [1000, "Description can't be longer than 1000 characters"],
    },
    priority: {
      type: String,
      enum: { values: PRIORITIES, message: "Priority must be low, medium, or high" },
      default: "medium",
    },
    status: {
      type: String,
      enum: STATUSES,
      default: "open",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Issue", issueSchema);
module.exports.PRIORITIES = PRIORITIES;
module.exports.STATUSES = STATUSES;
