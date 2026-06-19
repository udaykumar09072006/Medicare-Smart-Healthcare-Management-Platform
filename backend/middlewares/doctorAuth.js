// backend/middleware/doctorAuth.js
import jwt from "jsonwebtoken";
import Doctor from "../models/Doctor.js";


const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_here";

export default async function doctorAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  // 1. Check token
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Doctor not authorized, token missing",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    // 2. Verify token
    const payload = jwt.verify(token, JWT_SECRET);

    // OPTIONAL: if you store role in token
    if (payload.role && payload.role !== "doctor") {
      return res.status(403).json({
        success: false,
        message: "Access denied (not a doctor)",
      });
    }

    // 3. Fetch doctor
    const doctor = await Doctor.findById(payload.id).select("-password");

    if (!doctor) {
      return res.status(401).json({
        success: false,
        message: "Doctor not found",
      });
    }

    // 4. Attach doctor to request
    req.doctor = doctor;

    next();
  } catch (err) {
    console.error("Doctor JWT verification failed:", err);
    return res.status(401).json({
      success: false,
      message: "Token invalid or expired",
    });
  }
}
