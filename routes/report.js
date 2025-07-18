const express = require("express");
const axios = require("axios");

const ReportController = require("../controllers/report.controller");

const router = express.Router();
router.post("/report", ReportController.postCreateReport);
router.delete("/report/:reviewId", ReportController.deleteReportById);

module.exports = router;