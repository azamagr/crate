const express = require("express");
const { getIssues, createIssue, deleteIssue } = require("../controllers/issueController");

const router = express.Router();

router.route("/").get(getIssues).post(createIssue);
router.route("/:id").delete(deleteIssue);

module.exports = router;
