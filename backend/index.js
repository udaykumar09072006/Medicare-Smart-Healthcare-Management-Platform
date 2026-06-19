import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';
import express from 'express';
import { connectDB } from './config/db.js';

import appointmentRouter from './routes/appointmentRouter.js';
import doctorRouter from './routes/doctorRouter.js';
import serviceRouter from './routes/serviceRoutes.js';
import serviceAppointmentRouter from './routes/serviceAppointmentRouter.js';

const app = express();
const port = process.env.PORT || 4000;

// ⭐ IMPORTANT: ENABLE CREDENTIALS FOR CLERK COOKIE SESSION
const allowedOrigins = [
  "http://localhost:5173", // user frontend
  "http://localhost:5174", // admin dashboard (common)
  "http://localhost:5175", // Vite picked 5175 for admin during dev
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow server-to-server & tools like Postman (no origin)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true, // ✅ REQUIRED for cookies / Clerk
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);


app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ limit: "20mb", extended: true }));

// Serve locally uploaded files (fallback when Cloudinary not configured)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));

// Database Connection
const startServer = async () => {
  try {
    await connectDB();
    app.listen(port, () => {
      console.log(`Server Started on http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Failed to connect to the database:", error.message || error);
    process.exit(1);
  }
};

// Static uploads folder


// Routes (unchanged)
app.use("/api/appointments", appointmentRouter);
app.use("/api/doctors", doctorRouter);
app.use("/api/services", serviceRouter);
app.use("/api/service-appointments", serviceAppointmentRouter);

// Development fallback: return mock data if real API fails
app.get("/api/doctors/dev/mock", (req, res) => {
  res.json({ success: true, data: [], message: "Mock endpoint (dev)" });
});

// Test route
app.get('/', (req, res) => {
    res.send('API Working ');
});

startServer();
