import express from "express";
import HabitLog from "../models/HabitLog.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// Add or update habit log
router.post("/", auth, async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  try {
    const log = await HabitLog.findOneAndUpdate(
      { user: req.user, date: today },
      { ...req.body, date: today },
      { new: true, upsert: true }
    );
    res.json(log);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

router.get("/", auth, async (req, res) => {
  const logs = await HabitLog.find({ user: req.user }).sort({ date: -1 });
  res.json(logs);
});

export default router;
