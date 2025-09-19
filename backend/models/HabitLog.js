import mongoose from "mongoose";

const habitLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  date: { type: Date, default: Date.now },
  exercise: Boolean,
  noCoffee: Boolean,
  noScreen: Boolean,
  readBook: Boolean,
  meditation: Boolean
});

export default mongoose.model("HabitLog", habitLogSchema);
