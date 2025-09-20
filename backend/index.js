import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import sleepRoutes from "./routes/sleepRoutes.js";
import habitRoutes from "./routes/habitRoutes.js";
import reflectionRoutes from "./routes/reflectionRoutes.js";
import path from "path";
import helmet from "helmet";

dotenv.config();
connectDB();

const app = express();

// CORS for development
if (process.env.NODE_ENV !== "production") {
  app.use(cors({ origin: "http://localhost:5174" }));
}

// Body parser
app.use(express.json());

// Helmet CSP
// app.use(
//   helmet({
//     contentSecurityPolicy: {
//       directives: {
//         defaultSrc: ["'self'"],
//         scriptSrc: ["'self'"],
//         styleSrc: ["'self'", "https://fonts.googleapis.com"],
//         fontSrc: ["'self'", "https://fonts.gstatic.com"],
//         imgSrc: ["'self'", "data:"],
//         connectSrc: ["'self'"], // Add deployed backend URL in production if needed
//       },
//     },
//   })
// );

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/sleep", sleepRoutes);
app.use("/api/habits", habitRoutes);
app.use("/api/reflections", reflectionRoutes);

// Serve React frontend in production
if (process.env.NODE_ENV === "production") {
  const __dirname = path.resolve();
  const frontendPath = path.join(__dirname, "../frontend/dist");

  app.use(express.static(frontendPath));

  // Catch-all route for React Router
  app.use((req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
  });
}

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
