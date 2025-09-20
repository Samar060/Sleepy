// models/Reflection.js
import mongoose from "mongoose";

const reflectionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  reflection: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

export default mongoose.model("Reflection", reflectionSchema);
