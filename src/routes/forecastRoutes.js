const express = require("express");
const router = express.Router();
const forecastController = require("../controllers/forecastController");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/", authMiddleware, forecastController.getForecast);

module.exports = router;
