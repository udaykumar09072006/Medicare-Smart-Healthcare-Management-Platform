import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },

    // ⚠️ Plain text password (NOT hashed)
    password: {
      type: String,
      required: true,
      select: false,
    },

    name: { type: String, required: true, trim: true },
    specialization: { type: String, default: "" },

    imageUrl: { type: String, default: null },
    imagePublicId: { type: String, default: null },

    experience: { type: String, default: "" },
    qualifications: { type: String, default: "" },
    location: { type: String, default: "" },
    about: { type: String, default: "" },

    fee: { type: Number, default: 0 },
    availability: {
      type: String,
      enum: ["Available", "Unavailable"],
      default: "Available",
    },

    schedule: { type: Map, of: [String], default: {} },
    success: { type: String, default: "" },
    patients: { type: String, default: "" },
    rating: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// text search
doctorSchema.index({ name: "text", specialization: "text" });

const Doctor =
  mongoose.models.Doctor || mongoose.model("Doctor", doctorSchema);

export default Doctor;
