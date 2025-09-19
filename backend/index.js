import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import sleepRoutes from "./routes/sleepRoutes.js";
import habitRoutes from "./routes/habitRoutes.js";
import path from "path";

dotenv.config();
connectDB();

const app = express();

if (process.env.NODE_ENV !== "production") {
  app.use(cors({ origin: "http://localhost:5174" }));
}

app.use(express.json());

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/sleep", sleepRoutes);
app.use("/api/habits", habitRoutes);

// Serve React frontend in production
if (process.env.NODE_ENV === "production") {
  const __dirname = path.resolve();
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  // Catch-all route
app.get("*",(req,res)=>{
  res.sendFile(path.join(__dirname,"../frontend","dist","index.html"))
})
}

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
