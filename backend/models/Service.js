// models/Service.js
import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    about: { type: String, default: "" },
    shortDescription: { type: String, default: "" },

    price: { type: Number, default: 0 },
    available: { type: Boolean, default: true },

    // ✅ FIXED: Cloudinary fields
    imageUrl: { type: String, default: null },
    imagePublicId: { type: String, default: null },

    dates: { type: [String], default: [] },
    slots: { type: Map, of: [String], default: {} },

    instructions: { type: [String], default: [] },

    totalAppointments: { type: Number, default: 0 },
    completed: { type: Number, default: 0 },
    canceled: { type: Number, default: 0 },
  },
  { timestamps: true }
);

serviceSchema.index({ name: "text", shortDescription: "text" });

const Service =
  mongoose.models.Service || mongoose.model("Service", serviceSchema);

export default Service;
