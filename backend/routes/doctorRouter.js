// routes/doctorRouter.js
import express from "express";
import multer from "multer";

import {
  createDoctor,
  getDoctors,
  getDoctorById,
  updateDoctor,
  deleteDoctor,
  toggleAvailability,
  doctorLogin,
} from "../controllers/doctorController.js";

import doctorAuth from "../middlewares/doctorAuth.js";

const upload = multer({ dest: "/tmp" });

const doctorRouter = express.Router();




doctorRouter.get("/", getDoctors);
doctorRouter.post("/login", doctorLogin);
doctorRouter.get("/:id", getDoctorById);
doctorRouter.post("/", upload.single("image"), createDoctor);
doctorRouter.put(
  "/:id",
  doctorAuth,
  upload.single("image"),
  updateDoctor
);
doctorRouter.post(
  "/:id/toggle-availability",
  doctorAuth,
  toggleAvailability
);
doctorRouter.delete("/:id", deleteDoctor);

export default doctorRouter;
