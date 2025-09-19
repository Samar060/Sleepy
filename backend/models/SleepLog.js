import mongoose from "mongoose";

const sleepLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  date: { type: Date, default: Date.now },
  sleepTime: String,
  wakeTime: String,
  duration: Number
});

export default mongoose.model("SleepLog", sleepLogSchema);
