// models/Appointment.js
import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    /* =========================
       Ownership / Auth
    ========================== */
    owner: { type: String, required: true, index: true },
    createdBy: { type: String, default: null, index: true },

    /* =========================
       Patient Info
    ========================== */
    patientName: { type: String, required: true, trim: true },
    mobile: { type: String, required: true, trim: true },
    age: { type: Number, default: null },
    gender: { type: String, default: "" },

    /* =========================
       Doctor Info
    ========================== */
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
      index: true,
    },
    doctorName: { type: String, default: "" },
    speciality: { type: String, default: "" },

    // ✅ NEW: Doctor Image
    doctorImage: {
      url: { type: String, default: "" },        // image URL (Cloudinary / S3 / etc.)
      publicId: { type: String, default: "" },   // optional (for delete/update)
    },

    /* =========================
       Appointment Info
    ========================== */
    date: { type: String, required: true }, // YYYY-MM-DD
    time: { type: String, required: true },

    fees: { type: Number, required: true, min: 0, default: 0 },

    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Completed", "Canceled", "Rescheduled"],
      default: "Pending",
    },

    rescheduledTo: {
      date: { type: String },
      time: { type: String },
    },

    /* =========================
       Payment Info
    ========================== */
    payment: {
      method: {
        type: String,
        enum: ["Cash", "Online"],
        default: "Cash",
      },
      status: {
        type: String,
        enum: ["Pending", "Paid", "Failed", "Refunded"],
        default: "Pending",
      },
      amount: { type: Number, default: 0 },
      providerId: { type: String, default: "" },
      meta: { type: mongoose.Schema.Types.Mixed, default: {} },
    },

   

    sessionId: { type: String, default: null, index: true },

    paidAt: { type: Date, default: null },
  },
  { timestamps: true }
);

const Appointment =
  mongoose.models.Appointment ||
  mongoose.model("Appointment", appointmentSchema);

export default Appointment;
