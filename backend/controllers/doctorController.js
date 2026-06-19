// controllers/doctorController.js
import jwt from "jsonwebtoken";
import Doctor from "../models/Doctor.js";
import { uploadToCloudinary, deleteFromCloudinary } from "../utils/cloudinary.js";
import fs from "fs";
import path from "path";

/* ---------------- Helpers ---------------- */

const parseTimeToMinutes = (t = "") => {
  const [time = "0:00", ampm = ""] = (t || "").split(" ");
  const [hh = 0, mm = 0] = time.split(":").map(Number);
  let h = hh % 12;
  if ((ampm || "").toUpperCase() === "PM") h += 12;
  return h * 60 + (mm || 0);
};

function dedupeAndSortSchedule(schedule = {}) {
  const out = {};
  Object.entries(schedule).forEach(([date, slots]) => {
    if (!Array.isArray(slots)) return;
    const uniq = Array.from(new Set(slots));
    uniq.sort((a, b) => parseTimeToMinutes(a) - parseTimeToMinutes(b));
    out[date] = uniq;
  });
  return out;
}

function parseScheduleInput(s) {
  if (!s) return {};
  if (typeof s === "string") {
    try {
      s = JSON.parse(s);
    } catch {
      return {};
    }
  }
  return dedupeAndSortSchedule(s || {});
}

function normalizeDocForClient(raw = {}) {
  const doc = { ...raw };

  // convert Mongoose Map to plain object
  if (doc.schedule && typeof doc.schedule.forEach === "function") {
    const obj = {};
    doc.schedule.forEach((val, key) => {
      obj[key] = Array.isArray(val) ? val : [];
    });
    doc.schedule = obj;
  } else if (!doc.schedule || typeof doc.schedule !== "object") {
    doc.schedule = {};
  }

  doc.availability = doc.availability === undefined ? "Available" : doc.availability;
  doc.patients = doc.patients ?? "";
  doc.rating = doc.rating ?? 0;
  doc.fee = doc.fee ?? doc.fees ?? 0;

  return doc;
}

/* ---------------- Controller ---------------- */

export async function createDoctor(req, res) {
  try {
    const body = req.body || {};
    if (!body.email || !body.password || !body.name) {
      return res.status(400).json({ success: false, message: "email, password and name are required" });
    }

    const emailLC = (body.email || "").toLowerCase();
    if (await Doctor.findOne({ email: emailLC })) {
      return res.status(409).json({ success: false, message: "Email already in use" });
    }

    let imageUrl = body.imageUrl || null;
    let imagePublicId = body.imagePublicId || null;
    if (req.file?.path) {
      try {
        const uploaded = await uploadToCloudinary(req.file.path, "doctors");
        imageUrl = uploaded?.secure_url || uploaded?.url || imageUrl;
        imagePublicId = uploaded?.public_id || uploaded?.publicId || imagePublicId;
      } catch (uploadErr) {
        console.warn("Cloudinary upload failed, attempting local fallback:", uploadErr?.message || uploadErr);
        // attempt to move the temp file into a public uploads folder so it can be served
        try {
          const uploadsDir = path.join(process.cwd(), "public", "uploads");
          if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
          const filename = `${Date.now()}-${path.basename(req.file.path)}`;
          const dest = path.join(uploadsDir, filename);
          fs.renameSync(req.file.path, dest);
          // set imageUrl to backend-served uploads
          const backendUrl = process.env.BACKEND_URL || `http://localhost:4000`;
          imageUrl = `${backendUrl}/uploads/${filename}`;
          imagePublicId = null;
          console.warn("Saved upload to local fallback:", imageUrl);
        } catch (fsErr) {
          console.warn("Failed to move temp upload to local uploads:", fsErr?.message || fsErr);
          try {
            if (req.file?.path && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
          } catch (unlinkErr) {
            console.warn("Failed to remove temp upload file:", unlinkErr?.message || unlinkErr);
          }
        }
      }
    }

    const schedule = parseScheduleInput(body.schedule);

    const doc = new Doctor({
      email: emailLC,
      password: body.password,
      name: body.name,
      specialization: body.specialization || "",
      imageUrl,
      imagePublicId,
      availability: body.availability || "Available",
      experience: body.experience || "",
      qualifications: body.qualifications || "",
      location: body.location || "",
      about: body.about || "",
      fee: body.fee !== undefined ? Number(body.fee) : 0,
      schedule,
      success: body.success || "",
      patients: body.patients || "",
      rating: body.rating !== undefined ? Number(body.rating) : 0,
    });

    await doc.save();

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.warn("JWT_SECRET is not set");
      return res.status(500).json({ success: false, message: "Server misconfiguration" });
    }

    const token = jwt.sign({ id: doc._id.toString(), email: doc.email, role: "doctor" }, secret, { expiresIn: "7d" });

    const out = normalizeDocForClient(doc.toObject());
    delete out.password;

    return res.status(201).json({ success: true, data: out, token });
  } catch (err) {
    console.error("createDoctor error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

export const getDoctors = async (req, res) => {
  try {
    const { q = "", limit: limitRaw = 200, page: pageRaw = 1 } = req.query;
    const limit = Math.min(500, Math.max(1, parseInt(limitRaw, 10) || 200));
    const page = Math.max(1, parseInt(pageRaw, 10) || 1);
    const skip = (page - 1) * limit;

    const match = {};
    if (q && typeof q === "string" && q.trim()) {
      const re = new RegExp(q.trim(), "i");
      match.$or = [{ name: re }, { specialization: re }, { speciality: re }, { email: re }];
    }

    const docs = await Doctor.aggregate([
      { $match: match },
      {
        $lookup: {
          from: "appointments",
          localField: "_id",
          foreignField: "doctorId",
          as: "appointments",
        },
      },
      {
        $addFields: {
          appointmentsTotal: { $size: "$appointments" },
          appointmentsCompleted: {
            $size: {
              $filter: { input: "$appointments", as: "a", cond: { $in: ["$$a.status", ["Confirmed", "Completed"]] } }
            }
          },
          appointmentsCanceled: {
            $size: {
              $filter: { input: "$appointments", as: "a", cond: { $eq: ["$$a.status", "Canceled"] } }
            }
          },
          earnings: {
            $sum: {
              $map: {
                input: {
                  $filter: { input: "$appointments", as: "a", cond: { $in: ["$$a.status", ["Confirmed", "Completed"]] } }
                },
                as: "p",
                in: { $ifNull: ["$$p.fees", 0] }
              }
            }
          }
        }
      },
      { $project: { appointments: 0 } },
      { $sort: { name: 1 } },
      { $skip: skip },
      { $limit: limit }
    ]);

    const normalized = docs.map((d) => ({
      _id: d._id,
      id: d._id,
      name: d.name || "",
      specialization: d.specialization || d.speciality || "",
      fee: d.fee ?? d.fees ?? d.consultationFee ?? 0,
      imageUrl: d.imageUrl || d.image || d.avatar || null,
      appointmentsTotal: d.appointmentsTotal || 0,
      appointmentsCompleted: d.appointmentsCompleted || 0,
      appointmentsCanceled: d.appointmentsCanceled || 0,
      earnings: d.earnings || 0,
      availability: d.availability ?? "Available",
      schedule: (d.schedule && typeof d.schedule === "object") ? d.schedule : {},
      patients: d.patients ?? "",
      rating: d.rating ?? 0,
      about: d.about ?? "",
      experience: d.experience ?? "",
      qualifications: d.qualifications ?? "",
      location: d.location ?? "",
      success: d.success ?? "",
      raw: d,
    }));

    const total = await Doctor.countDocuments(match);

    return res.json({ success: true, data: normalized, doctors: normalized, meta: { page, limit, total } });
  } catch (err) {
    console.error("getDoctors:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export async function getDoctorById(req, res) {
  try {
    const { id } = req.params;
    const doc = await Doctor.findById(id).select("-password").lean();
    if (!doc) return res.status(404).json({ success: false, message: "Doctor not found" });
    return res.json({ success: true, data: normalizeDocForClient(doc) });
  } catch (err) {
    console.error("getDoctorById error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

export async function updateDoctor(req, res) {
  try {
    const { id } = req.params;
    const body = req.body || {};

    if (!req.doctor || String(req.doctor._id || req.doctor.id) !== String(id)) {
      return res.status(403).json({ success: false, message: "Not authorized to update this doctor" });
    }

    const existing = await Doctor.findById(id);
    if (!existing) return res.status(404).json({ success: false, message: "Doctor not found" });

    if (req.file?.path) {
      const uploaded = await uploadToCloudinary(req.file.path, "doctors");
      if (uploaded) {
        const previousPublicId = existing.imagePublicId;
        existing.imageUrl = uploaded.secure_url || uploaded.url || existing.imageUrl;
        existing.imagePublicId = uploaded.public_id || uploaded.publicId || existing.imagePublicId;
        if (previousPublicId && previousPublicId !== existing.imagePublicId) {
          deleteFromCloudinary(previousPublicId).catch((e) => console.warn("deleteFromCloudinary warning:", e?.message || e));
        }
      }
    } else if (body.imageUrl) {
      existing.imageUrl = body.imageUrl;
    }

    if (body.schedule) existing.schedule = parseScheduleInput(body.schedule);

    const updatable = ["name", "specialization", "experience", "qualifications", "location", "about", "fee", "availability", "success", "patients", "rating"];
    updatable.forEach((k) => { if (body[k] !== undefined) existing[k] = body[k]; });

    if (body.email && body.email !== existing.email) {
      const other = await Doctor.findOne({ email: body.email.toLowerCase() });
      if (other && other._id.toString() !== id) return res.status(409).json({ success: false, message: "Email already in use" });
      existing.email = body.email.toLowerCase();
    }

    if (body.password) existing.password = body.password;

    await existing.save();

    const out = normalizeDocForClient(existing.toObject());
    delete out.password;
    return res.json({ success: true, data: out });
  } catch (err) {
    console.error("updateDoctor error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

export async function deleteDoctor(req, res) {
  try {
    const { id } = req.params;
    const existing = await Doctor.findById(id);
    if (!existing) return res.status(404).json({ success: false, message: "Doctor not found" });

    if (existing.imagePublicId) {
      try {
        await deleteFromCloudinary(existing.imagePublicId);
      } catch (e) {
        console.warn("deleteFromCloudinary warning:", e?.message || e);
      }
    }

    await Doctor.findByIdAndDelete(id);
    return res.json({ success: true, message: "Doctor removed" });
  } catch (err) {
    console.error("deleteDoctor error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

export async function toggleAvailability(req, res) {
  try {
    const { id } = req.params;
    if (!req.doctor || String(req.doctor._id || req.doctor.id) !== String(id)) {
      return res.status(403).json({ success: false, message: "Not authorized to change availability for this doctor" });
    }

    const doc = await Doctor.findById(id);
    if (!doc) return res.status(404).json({ success: false, message: "Doctor not found" });

    if (typeof doc.availability === "boolean") doc.availability = !doc.availability;
    else doc.availability = doc.availability === "Available" ? "Unavailable" : "Available";

    await doc.save();
    const out = normalizeDocForClient(doc.toObject());
    delete out.password;
    return res.json({ success: true, data: out });
  } catch (err) {
    console.error("toggleAvailability error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

// export async function doctorLogin(req, res) {
//   try {
//     const { email, password } = req.body || {};
//     if (!email || !password) return res.status(400).json({ success: false, message: "Email and password required" });

//     const doc = await Doctor.findOne({ email: email.toLowerCase() }).select("+password");
//     if (!doc) return res.status(401).json({ success: false, message: "Invalid credentials" });

//     // Direct comparison (NO bcrypt)
//     if (doc.password !== password) return res.status(401).json({ success: false, message: "Invalid credentials" });

//     const secret = process.env.JWT_SECRET;
//     if (!secret) return res.status(500).json({ success: false, message: "JWT_SECRET not configured" });

//     const token = jwt.sign({ id: doc._id.toString(), email: doc.email, role: "doctor" }, secret, { expiresIn: "7d" });

//     const out = doc.toObject();
//     delete out.password;
//     return res.json({ success: true, token, data: out });
//   } catch (err) {
//     console.error("doctorLogin error:", err);
//     return res.status(500).json({ success: false, message: "Server error" });
//   }
// }


export async function doctorLogin(req, res) {
  try {
    const { email, password } = req.body || {};

    console.log("Login Request:", { email, password });

    const doc = await Doctor.findOne({
      email: email.toLowerCase(),
    }).select("+password");

    console.log("Doctor Found:", doc);

    if (!doc)
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });

    console.log("DB Password:", doc.password);
    console.log("Entered Password:", password);

    if (doc.password !== password)
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error("JWT_SECRET is not configured");
      return res.status(500).json({ success: false, message: "Server misconfiguration" });
    }

    const token = jwt.sign({ id: doc._id.toString(), email: doc.email, role: "doctor" }, secret, {
      expiresIn: "7d",
    });

    const out = normalizeDocForClient(doc.toObject());
    delete out.password;

    return res.json({ success: true, token, data: out });
  } catch (err) {
    console.error("doctorLogin error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}