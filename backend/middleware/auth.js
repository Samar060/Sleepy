import jwt from "jsonwebtoken";
import User from "../models/User.js";

const auth = async (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) return res.status(401).json({ msg: "No token, authorization denied" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ msg: "User not found" });

    req.user = user; // now req.user is a full user object
    next();
  } catch (err) {
    console.error("Auth middleware error:", err);
    res.status(401).json({ msg: "Invalid token" });
  }
};

export default auth;
