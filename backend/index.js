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
// In production we want to allow Vercel frontend origins as well.
// For simplicity and to avoid blocking valid deployed frontends, echo
// the incoming origin back (this allows credentials when needed).
app.use(
  cors({
    origin: function (origin, callback) {
      // allow server-to-server & tools like Postman (no origin)
      if (!origin) return callback(null, true);
      // Echo back the requesting origin — this enables CORS for any
      // browser origin while still setting a specific Access-Control-Allow-Origin header.
      return callback(null, true);
    },
    credentials: true, // required for cookies / Clerk when used
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
