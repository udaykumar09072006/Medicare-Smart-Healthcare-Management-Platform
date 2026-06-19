"use client";

import React from "react";
import AnimatedNavbar from "../Navbar/Navbar";
import logoImg from "../../assets/logo.png";
import { heroStyles } from "../../assets/dummyStyles";

export default function Hero({ role = "admin", userName = "Doctor" }) {
  const isDoctor = role === "doctor";

  return (
    <div className={heroStyles.container}>
      {/* Navbar */}
      <AnimatedNavbar />

      {/* Centered Hero */}
      <main className={heroStyles.mainContainer}>
        <section className={heroStyles.section}>
          {/* Soft decorative background */}
          <div className={heroStyles.decorativeBg.container}>
            <div className={heroStyles.decorativeBg.blurBackground}>
              <div className={heroStyles.decorativeBg.blurShape} />
            </div>

            <div className={heroStyles.contentBox}>
              {/* Image */}
              <div className={heroStyles.logoContainer}>
                <img
                  src={logoImg}
                  alt="Medtek"
                  className={heroStyles.logo}
                />
              </div>

              {/* Heading */}
              <h1 className={heroStyles.heading}>
                {isDoctor
                  ? `Welcome, Dr. ${userName}`
                  : "WELCOME TO MEDICARE ADMIN PANEL"}
              </h1>

              <p className={heroStyles.description}>
                {isDoctor
                  ? "Access your patient records, manage appointments, and review medical reports securely from your dashboard."
                  : "Manage hospital operations, doctors, staff, patient records, and system settings from a centralized control panel."}
              </p>

              {/* Info Cards */}
              <div className={heroStyles.infoCards.container}>
                <div className={heroStyles.infoCards.card}>
                  <h3 className={heroStyles.infoCards.cardTitle}>
                    Secure Access
                  </h3>
                  <p className={heroStyles.infoCards.cardText}>
                    Role-based login with protected medical data.
                  </p>
                </div>

                <div className={heroStyles.infoCards.card}>
                  <h3 className={heroStyles.infoCards.cardTitle}>
                    Real-time Management
                  </h3>
                  <p className={heroStyles.infoCards.cardText}>
                    Monitor hospital activity and patient flow.
                  </p>
                </div>

                <div className={heroStyles.infoCards.card}>
                  <h3 className={heroStyles.infoCards.cardTitle}>
                    Medical Dashboard
                  </h3>
                  <p className={heroStyles.infoCards.cardText}>
                    Clean, fast, and doctor-friendly interface.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}