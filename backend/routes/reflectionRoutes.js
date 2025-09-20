// routes/reflectionRoutes.js
import express from "express";
import Reflection from "../models/Reflection.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// Add reflection
router.post("/", auth, async (req, res) => {
  try {
    const { reflection } = req.body;
    if (!reflection) return res.status(400).json({ msg: "Reflection is required" });

    const existing = await Reflection.findOne({ user: req.user, date: { $gte: new Date().setHours(0,0,0,0), $lte: new Date().setHours(23,59,59,999) } });
    if (existing) {
      existing.reflection = reflection;
      await existing.save();
      return res.json(existing);
    }

    const newReflection = await Reflection.create({ user: req.user, reflection });
    res.json(newReflection);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// Get all reflections
router.get("/", auth, async (req, res) => {
  try {
    const reflections = await Reflection.find({ user: req.user }).sort({ date: -1 });
    res.json(reflections);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// Delete reflection by date
router.delete("/:date", auth, async (req, res) => {
  try {
    const date = new Date(req.params.date);
    await Reflection.deleteMany({
      user: req.user,
      date: { $gte: date.setHours(0,0,0,0), $lte: date.setHours(23,59,59,999) }
    });
    res.json({ msg: "Reflection deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

export default router;
