const express = require("express");
const Operator = require("../db/OperatorProfile");
const DelegationManager = require("../db/DelegationManager");
const TVLOverTime = require("../db/TVLOverTime");
const router = express.Router();
const connectDB = require("../db/db");

connectDB();

router.get("/unique-operators", async (req, res) => {
  try {
    const operators = await Operator.find().sort({ totalTVL: -1 });
    res.json({ success: true, data: operators });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch operators",
      error: error.message,
    });
  }
});

router.get("/operator-shares/:operator", async (req, res) => {
  const { operator } = req.params;
  try {
    const operatorData = await TVLOverTime.find({ operator: operator }).sort({
      timestamp: 1,
    });
    if (operatorData.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No data found for this operator." });
    }
    const chartData = operatorData.map((item) => ({
      x: item.timestamp,
      y: item.totalTVL,
    }));
    res.json({ success: true, data: chartData });
  } catch (error) {
    console.error("Error fetching operator shares:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      details: error.message,
    });
  }
});

router.get("/operator/:operator", async (req, res) => {
  const { operator } = req.params;
  try {
    const operatorData = await Operator.find({
      operatorAddress: operator,
    });

    res.json({ success: true, data: operatorData });
  } catch (error) {
    console.error("Error fetching operator shares:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      details: error.message,
    });
  }
});

module.exports = router;
