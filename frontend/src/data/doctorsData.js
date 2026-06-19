// src/data/doctorsData.js

import HD1 from "../assets/HD1.png";
import HD2 from "../assets/HD2.png";
import HD3 from "../assets/HD3.png";
import HD4 from "../assets/HD4.png";
import HD5 from "../assets/HD5.png";
import HD6 from "../assets/HD6.png";
import HD7 from "../assets/HD7.png";
import HD8 from "../assets/HD8.png";

import D1 from "../assets/D1.png";
import D2 from "../assets/D2.png";
import D3 from "../assets/D3.png";
import D4 from "../assets/D4.png";
import D5 from "../assets/D5.png";
import D6 from "../assets/D6.png";
import D7 from "../assets/D7.png";
import D8 from "../assets/D8.png";
import D12 from "../assets/D12.png";
import D9 from "../assets/D9.png";
import D10 from "../assets/D10.png";
import D11 from "../assets/D11.png";

export const doctors = [
  // 1 ----------------------------
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    specialization: "Cardiologist",
    image: HD1,
    status: "available",
    available: true,
    experience: "12 years",
    qualifications: "MBBS, MD (Cardiology)",
    location: "City Hospital, Block A",
    about: "Expert in heart rhythm, cardiac care, and coronary interventions.",
    fee: 700,
    schedule: {
      "2025-02-18": ["09:00 AM", "10:00 AM", "11:30 PM", "12:30 PM", "11:30 AM"],
      "2025-02-19": ["02:00 PM", "03:30 PM", "05:00 PM"],
      "2025-02-20": ["10:00 AM", "12:00 PM"],
      "2025-02-21": ["10:00 AM", "12:00 PM"],
      "2025-02-22": ["2:00 PM", "12:00 PM"],
      "2025-02-23": ["12:00 AM", "12:00 PM"],
      "2025-02-25": ["11:00 AM", "12:00 PM"],
    },
    success: "98%",
    patients: "2k+",
    rating: 4.9,
  },

  // 2 ----------------------------
  {
    id: 2,
    name: "Dr. Michael Chen",
    specialization: "Neurologist",
    image: HD2,
    status: "unavailable",
    available: false,
    experience: "15 years",
    qualifications: "MBBS, DM (Neurology)",
    location: "NeuroCare Center, 2nd Floor",
    about: "Expert in migraine, stroke, epilepsy and neuro disorders.",
    fee: 900,
    schedule: {
      "2025-02-18": ["10:00 AM", "11:00 AM"],
      "2025-02-19": ["03:00 PM", "04:30 PM"],
      "2025-02-20": ["09:30 AM"],
    },
    success: "89%",
    patients: "1.8k+",
    rating: 4.5,
  },

  // 3 ----------------------------
  {
    id: 3,
    name: "Dr. Emily Rodriguez",
    specialization: "Pediatrician",
    image: HD3,
    status: "available",
    available: true,
    experience: "8 years",
    qualifications: "MBBS, DCH",
    location: "Sunrise Pediatrics, Sector 12",
    about: "Child specialist focusing on growth, nutrition, and immunity.",
    fee: 500,
    schedule: {
      "2025-02-18": ["09:30 AM", "11:00 AM"],
      "2025-02-19": ["01:30 PM", "03:00 PM"],
      "2025-02-20": ["10:00 AM"],
    },
    success: "97%",
    patients: "3.2k+",
    rating: 4.8,
  },

  // 4 ----------------------------
  {
    id: 4,
    name: "Dr. James Wilson",
    specialization: "Orthopedic Surgeon",
    image: HD4,
    status: "unavailable",
    available: false,
    experience: "18 years",
    qualifications: "MBBS, MS (Orthopedics)",
    location: "OrthoPlus Clinic",
    about: "Joint replacement & sports injury expert.",
    fee: 1200,
    schedule: {
      "2025-02-18": ["10:30 AM"],
      "2025-02-19": ["12:00 PM", "03:00 PM"],
      "2025-02-20": ["05:30 PM"],
    },
    success: "92%",
    patients: "1.5k+",
    rating: 4.6,
  },

  // 5 ----------------------------
  {
    id: 5,
    name: "Dr. Priya Sharma",
    specialization: "Dermatologist",
    image: HD5,
    status: "available",
    available: true,
    experience: "10 years",
    qualifications: "MBBS, DDV",
    location: "SkinCare Hub, Green Plaza",
    about: "Acne, pigmentation, hair fall & skin treatment specialist.",
    fee: 600,
    schedule: {
      "2025-02-18": ["09:00 AM", "10:30 AM", "12:00 PM"],
      "2025-02-19": ["03:30 PM", "05:00 PM"],
      "2025-02-20": ["11:00 AM"],
    },
    success: "94%",
    patients: "2.7k+",
    rating: 4.7,
  },

  // 6 ----------------------------
  {
    id: 6,
    name: "Dr. Robert Brown",
    specialization: "Psychiatrist",
    image: HD6,
    status: "unavailable",
    available: false,
    experience: "20 years",
    qualifications: "MBBS, MD (Psychiatry)",
    location: "MindWell Clinic",
    about: "Mood disorders, anxiety, therapy & behavioral care.",
    fee: 1100,
    schedule: {
      "2025-02-18": ["11:00 AM", "01:00 PM"],
      "2025-02-19": ["03:00 PM", "05:00 PM"],
      "2025-02-20": ["09:00 AM"],
    },
    success: "90%",
    patients: "3.1k+",
    rating: 4.4,
  },

  // 7 ----------------------------
  {
    id: 7,
    name: "Dr. Lisa Wang",
    specialization: "Gynecologist",
    image: HD7,
    status: "available",
    available: true,
    experience: "11 years",
    qualifications: "MBBS, DGO",
    location: "Women's Health Center",
    about: "Infertility, antenatal & gyne care expert.",
    fee: 750,
    schedule: {
      "2025-02-18": ["09:15 AM", "10:45 AM"],
      "2025-02-19": ["02:00 PM", "04:00 PM"],
      "2025-02-20": ["11:30 AM"],
    },
    success: "96%",
    patients: "2.4k+",
    rating: 4.9,
  },

  // 8 ----------------------------
  {
    id: 8,
    name: "Dr. David Kim",
    specialization: "Oncologist",
    image: HD8,
    status: "available",
    available: true,
    experience: "16 years",
    qualifications: "MBBS, DM (Oncology)",
    location: "CancerCare Institute",
    about:
      "Specialist in chemotherapy, targeted therapy & cancer care.",
    fee: 1500,
    schedule: {
      "2025-02-18": ["10:00 AM", "11:30 AM"],
      "2025-02-19": ["02:30 PM", "04:30 PM"],
      "2025-02-20": ["09:00 AM"],
    },
    success: "93%",
    patients: "2.9k+",
    rating: 4.6,
  },

  // 9 ----------------------------
  {
    id: 9,
    name: "Dr. Rohan Mehta",
    specialization: "ENT Specialist",
    image: D2,
    status: "available",
    available: true,
    experience: "9 years",
    qualifications: "MBBS, MS (ENT)",
    location: "City ENT Clinic",
    about: "Sinus, ear infection, tonsils & throat care.",
    fee: 550,
    schedule: {
      "2025-02-18": ["09:00 AM"],
      "2025-02-19": ["11:00 AM"],
      "2025-02-20": ["04:00 PM"],
    },
    success: "95%",
    patients: "1.9k+",
    rating: 4.7,
  },

  // 10 ----------------------------
  {
    id: 10,
    name: "Dr. Kavita Rao",
    specialization: "General Physician",
    image: D1,
    status: "available",
    available: true,
    experience: "7 years",
    qualifications: "MBBS",
    location: "Healthy Life Clinic",
    about: "General checkups, infections & viral fever expert.",
    fee: 400,
    schedule: {
      "2025-02-18": ["09:30 AM"],
      "2025-02-19": ["02:00 PM"],
      "2025-02-20": ["10:30 AM"],
    },
    success: "97%",
    patients: "2.3k+",
    rating: 4.8,
  },

  // 11 ----------------------------
  {
    id: 11,
    name: "Dr. Sameer Ali",
    specialization: "Pulmonologist",
    image: D4,
    status: "available",
    available: true,
    experience: "14 years",
    qualifications: "MBBS, MD (Pulmonary Medicine)",
    location: "LungCare Center",
    about: "Asthma, COPD & lung infection specialist.",
    fee: 900,
    schedule: {
      "2025-02-18": ["10:00 AM"],
      "2025-02-19": ["03:00 PM"],
      "2025-02-20": ["09:00 AM"],
    },
    success: "91%",
    patients: "2.1k+",
    rating: 4.5,
  },

  // 12 ----------------------------
  {
    id: 12,
    name: "Dr. Aditi Verma",
    specialization: "Dentist",
    image: D3,
    status: "available",
    available: true,
    experience: "6 years",
    qualifications: "BDS, MDS",
    location: "Smile Dental Care",
    about: "Braces, root canal, cleaning & whitening expert.",
    fee: 500,
    schedule: {
      "2025-02-18": ["12:00 PM"],
      "2025-02-19": ["03:00 PM"],
      "2025-02-20": ["10:00 AM"],
    },
    success: "96%",
    patients: "1.6k+",
    rating: 4.7,
  },

  // 13 ----------------------------
  {
    id: 13,
    name: "Dr. Neha Kapoor",
    specialization: "Physiotherapist",
    image: D5,
    status: "available",
    available: true,
    experience: "9 years",
    qualifications: "BPT, MPT",
    location: "Rehab & Cure Center",
    about: "Sports injuries, muscle pain & recovery.",
    fee: 600,
    schedule: {
      "2025-02-18": ["09:00 AM"],
      "2025-02-19": ["12:30 PM"],
      "2025-02-20": ["03:30 PM"],
    },
    success: "94%",
    patients: "2.2k+",
    rating: 4.6,
  },

  // 14 ----------------------------
  {
    id: 14,
    name: "Dr. Ishaan Khanna",
    specialization: "Psychologist",
    image: D6,
    status: "available",
    available: true,
    experience: "10 years",
    qualifications: "BA, MA Psychology",
    location: "Mind Balance Clinic",
    about: "Therapy, depression, stress & relationship issues.",
    fee: 700,
    schedule: {
      "2025-02-18": ["01:00 PM"],
      "2025-02-19": ["03:00 PM"],
      "2025-02-20": ["11:00 AM"],
    },
    success: "90%",
    patients: "1.3k+",
    rating: 4.4,
  },

  // 15 ----------------------------
  {
    id: 15,
    name: "Dr. Virat Anand",
    specialization: "Eye Specialist",
    image: D7,
    status: "available",
    available: true,
    experience: "13 years",
    qualifications: "MBBS, MS (Ophthalmology)",
    location: "Vision Care Hospital",
    about: "Cataract, specs check & full eye treatment.",
    fee: 800,
    schedule: {
      "2025-02-18": ["10:00 AM"],
      "2025-02-19": ["12:00 PM"],
      "2025-02-20": ["02:00 PM"],
    },
    success: "95%",
    patients: "2.6k+",
    rating: 4.8,
  },

  // 16 ----------------------------
  {
    id: 16,
    name: "Dr. Jatin Arora",
    specialization: "Gastroenterologist",
    image: D8,
    status: "available",
    available: true,
    experience: "17 years",
    qualifications: "MBBS, DM (Gastro)",
    location: "Digestive Health Clinic",
    about: "Stomach, liver & intestine treatment with GI endoscopy.",
    fee: 1300,
    schedule: {
      "2025-02-18": ["11:00 AM"],
      "2025-02-19": ["03:30 PM"],
      "2025-02-20": ["10:00 AM"],
    },
    success: "93%",
    patients: "3.4k+",
    rating: 4.7,
  },

  // 17 ----------------------------
  {
    id: 17,
    name: "Dr. Aarav Singh",
    specialization: "Urologist",
    image: D9,
    status: "available",
    available: true,
    experience: "12 years",
    qualifications: "MBBS, MS, MCh (Urology)",
    location: "UroPlus Hospital",
    about: "Kidney stones, UTI & prostate treatment.",
    fee: 1400,
    schedule: {
      "2025-02-18": ["09:45 AM"],
      "2025-02-19": ["02:30 PM"],
      "2025-02-20": ["04:00 PM"],
    },
    success: "92%",
    patients: "1.8k+",
    rating: 4.5,
  },

  // 18 ----------------------------
  {
    id: 18,
    name: "Dr. Megha Shah",
    specialization: "Nutritionist",
    image: D10,
    status: "available",
    available: true,
    experience: "8 years",
    qualifications: "BSc, MSc Nutrition",
    location: "FitLife Clinic",
    about: "Weight loss, diabetes diet, PCOS & healthy plans.",
    fee: 500,
    schedule: {
      "2025-02-18": ["11:00 AM"],
      "2025-02-19": ["01:00 PM"],
      "2025-02-20": ["03:00 PM"],
    },
    success: "94%",
    patients: "2.0k+",
    rating: 4.7,
  },

  // 19 ----------------------------
  {
    id: 19,
    name: "Dr. Helena Grace",
    specialization: "Radiologist",
    image: D11,
    status: "available",
    available: true,
    experience: "10 years",
    qualifications: "MBBS, MD (Radiology)",
    location: "Metro Diagnostics Center",
    about: "X-ray, MRI, CT-scan, ultrasound diagnostic expert.",
    fee: 1000,
    schedule: {
      "2025-02-18": ["10:00 AM"],
      "2025-02-19": ["12:00 PM"],
      "2025-02-20": ["03:00 PM"],
    },
    success: "95%",
    patients: "2.3k+",
    rating: 4.8,
  },

  // 20 ----------------------------
  {
    id: 20,
    name: "Dr. Kabir Malhotra",
    specialization: "Nephrologist",
    image: D12,
    status: "available",
    available: true,
    experience: "14 years",
    qualifications: "MBBS, DM (Nephrology)",
    location: "KidneyCare Institute",
    about: "Kidney specialist: dialysis, transplant, kidney disorders.",
    fee: 1600,
    schedule: {
      "2025-02-18": ["09:00 AM", "09:00 PM"],
      "2025-02-19": ["02:00 PM"],
      "2025-02-20": ["05:00 PM"],
    },
    success: "91%",
    patients: "2.9k+",
    rating: 4.6,
  },
];

export default doctors;
