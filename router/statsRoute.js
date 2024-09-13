const express = require("express");
const {
  trackBookController,
  trackUserController,
  dateRangeTrackController,
} = require("../Controller/statsController.js");
const router = express.Router();

router.get("/track-book/:id", trackBookController);

router.get("/track-user/:id", trackUserController);

router.get("/date-range", dateRangeTrackController);

module.exports = router;
