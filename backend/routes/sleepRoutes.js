import express from "express";
import SleepLog from "../models/SleepLog.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// Add or update sleep log
router.post("/", auth, async (req, res) => {
  const { sleepTime, wakeTime, duration } = req.body;
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalize date to 00:00:00

  try {
    const log = await SleepLog.findOneAndUpdate(
      { user: req.user, date: today },
      { sleepTime, wakeTime, duration, date: today },
      { new: true, upsert: true }
    );
    res.json(log);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

router.get("/", auth, async (req, res) => {
  const logs = await SleepLog.find({ user: req.user }).sort({ date: -1 });
  res.json(logs);
});

export default router;
