import fs from "fs";
import path from "path";
import "dotenv/config";
import Service from "../models/Service.js";
import { connectDB } from "../config/db.js";

const services = [
  {
    name: "General Physician Consultation",
    price: 499,
    available: true,
    about: "Comprehensive health check-up and consultation for common illnesses.",
    shortDescription: "Comprehensive health check-up",
    instructions: [
      "Bring previous medical records and prescriptions.",
      "Arrive 10 minutes before your appointment.",
    ],
    imageAsset: "S1.png",
    slotsList: [
      "21 Jun 2026 — 10:00 AM",
      "22 Jun 2026 — 03:30 PM",
      "24 Jun 2026 — 11:15 AM",
    ],
  },
  {
    name: "Pediatric Consultation",
    price: 699,
    available: true,
    about: "Child health consultation including growth and development assessment.",
    shortDescription: "Child health consultation",
    instructions: [
      "Carry the child's vaccination card.",
      "Bring details of current medications.",
    ],
    imageAsset: "S2.png",
    slotsList: [
      "20 Jun 2026 — 09:30 AM",
      "23 Jun 2026 — 01:00 PM",
      "25 Jun 2026 — 04:15 PM",
    ],
  },
  {
    name: "Dental Checkup",
    price: 799,
    available: true,
    about: "Routine dental examination and oral health assessment.",
    shortDescription: "Routine dental exam",
    instructions: [
      "Brush your teeth before the appointment.",
      "Inform the dentist about any allergies.",
    ],
    imageAsset: "S3.png",
    slotsList: [
      "22 Jun 2026 — 11:00 AM",
      "24 Jun 2026 — 02:00 PM",
      "27 Jun 2026 — 05:00 PM",
    ],
  },
  {
    name: "Dermatology Consultation",
    price: 899,
    available: true,
    about: "Diagnosis and treatment of skin, hair, and nail conditions.",
    shortDescription: "Skin specialist consultation",
    instructions: [
      "Avoid applying makeup before the visit.",
      "Bring details of previous skin treatments.",
    ],
    imageAsset: "S4.png",
    slotsList: [
      "21 Jun 2026 — 12:30 PM",
      "23 Jun 2026 — 04:00 PM",
      "26 Jun 2026 — 10:45 AM",
    ],
  },
  {
    name: "Eye Examination",
    price: 599,
    available: true,
    about: "Complete eye health check and vision assessment.",
    shortDescription: "Eye health check",
    instructions: [
      "Bring your current spectacles if any.",
      "Avoid wearing contact lenses on the day of the exam.",
    ],
    imageAsset: "S5.png",
    slotsList: [
      "20 Jun 2026 — 11:30 AM",
      "24 Jun 2026 — 03:00 PM",
      "28 Jun 2026 — 09:15 AM",
    ],
  },
  {
    name: "Cardiology Consultation",
    price: 1499,
    available: true,
    about: "Heart health evaluation and cardiovascular consultation.",
    shortDescription: "Cardiac consultation",
    instructions: [
      "Carry previous ECG or heart reports.",
      "Avoid caffeine 2 hours before the appointment.",
    ],
    imageAsset: "S6.png",
    slotsList: [
      "22 Jun 2026 — 09:00 AM",
      "25 Jun 2026 — 12:00 PM",
      "29 Jun 2026 — 03:45 PM",
    ],
  },
  {
    name: "Orthopedic Consultation",
    price: 999,
    available: true,
    about: "Assessment and treatment for bone, joint, and muscle issues.",
    shortDescription: "Orthopedic consultation",
    instructions: [
      "Bring any recent X-ray or MRI reports.",
      "Wear comfortable clothing for examination.",
    ],
    imageAsset: "S7.png",
    slotsList: [
      "21 Jun 2026 — 02:15 PM",
      "26 Jun 2026 — 10:00 AM",
      "30 Jun 2026 — 04:30 PM",
    ],
  },
  {
    name: "Nutrition & Diet Consultation",
    price: 799,
    available: true,
    about: "Personalized diet planning and nutritional guidance.",
    shortDescription: "Diet and nutrition consultation",
    instructions: [
      "Bring a list of your daily meals.",
      "Inform about any food allergies or restrictions.",
    ],
    imageAsset: "S8.png",
    slotsList: [
      "23 Jun 2026 — 09:45 AM",
      "27 Jun 2026 — 01:30 PM",
      "01 Jul 2026 — 05:15 PM",
    ],
  },
];

const FRONTEND_ASSET_DIR = path.resolve(process.cwd(), "../frontend/src/assets");
const BACKEND_UPLOAD_DIR = path.resolve(process.cwd(), "public/uploads");
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:4000";

function ensureUploadDir() {
  if (!fs.existsSync(BACKEND_UPLOAD_DIR)) {
    fs.mkdirSync(BACKEND_UPLOAD_DIR, { recursive: true });
  }
}

function copyServiceAsset(assetName, serviceIndex) {
  const sourcePath = path.join(FRONTEND_ASSET_DIR, assetName);
  if (!fs.existsSync(sourcePath)) {
    throw new Error(`Asset not found: ${sourcePath}`);
  }

  const targetName = `service-${serviceIndex + 1}-${assetName}`;
  const targetPath = path.join(BACKEND_UPLOAD_DIR, targetName);
  fs.copyFileSync(sourcePath, targetPath);

  return {
    imageUrl: `${BACKEND_URL}/uploads/${targetName}`,
    imagePublicId: null,
  };
}

async function run() {
  console.log("Connecting to DB...");
  await connectDB();

  ensureUploadDir();

  for (const [index, service] of services.entries()) {
    console.log(`Seeding service: ${service.name}`);
    const existing = await Service.findOne({ name: service.name });

    let imageData;
    try {
      imageData = copyServiceAsset(service.imageAsset, index);
    } catch (err) {
      console.error(`Failed to copy asset ${service.imageAsset}:`, err.message || err);
      continue;
    }

    // build slots map and dates array from slotsList if provided
    const slotsMap = {};
    const datesArr = [];
    if (Array.isArray(service.slotsList)) {
      for (const line of service.slotsList) {
        // expected format: '21 Jun 2026 — 10:00 AM' or '21 Jun 2026 - 10:00 AM'
        const parts = String(line).split(/[-–—]/).map((s) => s.trim());
        if (parts.length < 2) continue;
        const datePart = parts[0];
        const timePart = parts[1];

        // parse date like '21 Jun 2026'
        const dateObj = new Date(datePart.replace(/\s+/g, ' '));
        if (isNaN(dateObj.getTime())) {
          // try swapping words
          continue;
        }
        const yyyy = dateObj.getFullYear();
        const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
        const dd = String(dateObj.getDate()).padStart(2, '0');
        const key = `${yyyy}-${mm}-${dd}`;
        if (!slotsMap[key]) slotsMap[key] = [];
        slotsMap[key].push(timePart);
        if (!datesArr.includes(key)) datesArr.push(key);
      }
    }

    const serviceData = {
      name: service.name,
      about: service.about,
      shortDescription: service.shortDescription,
      price: service.price,
      available: service.available,
      instructions: service.instructions,
      slots: slotsMap,
      dates: datesArr,
      imageUrl: imageData.imageUrl,
      imagePublicId: imageData.imagePublicId,
    };

    if (existing) {
      await Service.findByIdAndUpdate(existing._id, serviceData, {
        new: true,
        upsert: true,
        runValidators: true,
      });
      console.log(`Updated service: ${service.name}`);
    } else {
      await Service.create(serviceData);
      console.log(`Created service: ${service.name}`);
    }
  }

  console.log("Service seeding completed.");
  process.exit(0);
}

run().catch((err) => {
  console.error("Error seeding services:", err);
  process.exit(1);
});
