// utils/cloudinary.js
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// 📌 Configure Cloudinary (env required)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/* ===========================================================
   UPLOAD FILE TO CLOUDINARY
   filePath = local path from multer (req.file.path)
   folder   = cloudinary folder e.g. "services", "doctors", "profiles"
   =========================================================== */
export async function uploadToCloudinary(filePath, folder = "Doctor") {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder,
      resource_type: "image",
    });

    // remove local file after upload
    fs.unlinkSync(filePath);

    return result;  // contains { secure_url, public_id, ... }
  } catch (err) {
    console.error("Cloudinary upload error:", err);
    throw err;
  }
}

/* ===========================================================
   DELETE FROM CLOUDINARY (optional)
   Pass public_id from database
   =========================================================== */
export async function deleteFromCloudinary(publicId) {
  try {
    if (!publicId) return;

    await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    console.error("Cloudinary delete error:", err);
    throw err;
  }
}

export default cloudinary;
