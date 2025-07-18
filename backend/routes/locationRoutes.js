const express = require('express');
const Location = require('../models/Location');
const router = express.Router();

router.get('/latest/:deviceId', async (req, res) => {
  const location = await Location.findOne({ deviceId: req.params.deviceId }).sort({ timestamp: -1 });
  res.json(location);
});

router.get('/history/:deviceId', async (req, res) => {
  const history = await Location.find({ deviceId: req.params.deviceId }).sort({ timestamp: 1 });
  res.json(history);
});

module.exports = router;

