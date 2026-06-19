// src/App.jsx
import React, { useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

// Pages
import Home from "./pages/Home/Home";
import Doctors from "./pages/Doctors/Doctors";
import Contact from "./pages/Contact/Contact";
import Service from "./pages/Service/Service";
import DoctorDetail from "./pages/DoctorDetail/DoctorDetail";
import ServiceDetailPage from "./pages/ServiceDetailPage/ServiceDetailPage";
import Appointments from "./pages/Appointments/Appointments";
import Login from "./pages/Login/Login";

// Doctor Admin
import DHome from "./pages/DHome/DHome";
import List from "./pages/List/List";
import EditProfile from "./pages/EditProfile/EditProfile";

// Lucide icon
import { CircleChevronUp } from "lucide-react";
import VerifyPaymentPage from "../VerifyPaymetPage";
import VerifyServicePaymentPage from "../VerifyServicePaymentPage";

/* ================= Scroll To Top ================= */
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [pathname]);

  return null;
};

/* ================= Floating Scroll Button ================= */
const ScrollButton = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 200);
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <button
      onClick={scrollTop}
      className={`fixed right-4 bottom-6 z-50 w-11 h-11 rounded-full flex items-center justify-center 
      bg-emerald-600 text-white shadow-lg transition-all duration-300 
      ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"} 
      hover:scale-110 hover:shadow-xl`}
      title="Go to top"
    >
      <CircleChevronUp size={22} />
    </button>
  );
};

/* ================= Main App ================= */
const App = () => {
  // Lock horizontal overflow globally
  useEffect(() => {
    document.body.style.overflowX = "hidden";
    document.documentElement.style.overflowX = "hidden";
    return () => {
      document.body.style.overflowX = "auto";
      document.documentElement.style.overflowX = "auto";
    };
  }, []);

  return (
    <>
      <ScrollToTop />

      <div className="overflow-x-hidden bg-white text-gray-900">
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/doctors" element={<Doctors />} />
          <Route path="/doctors/:id" element={<DoctorDetail />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/services" element={<Service />} />
          <Route path="/services/:id" element={<ServiceDetailPage />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/doctor-admin/login" element={<Login />} />

          {/* ✅ STRIPE PAYMENT ROUTES */}
          <Route path="/appointment/success" element={<VerifyPaymentPage />} />
          <Route path="/appointment/cancel" element={<VerifyPaymentPage />} />

          <Route
            path="/service-appointment/success"
            element={<VerifyServicePaymentPage />}
          />
          <Route
            path="/service-appointment/cancel"
            element={<VerifyServicePaymentPage />}
          />

          {/* Doctor Admin */}
          <Route path="/doctor-admin/:id" element={<DHome />} />
          <Route path="/doctor-admin/:id/appointments" element={<List />} />
          <Route
            path="/doctor-admin/:id/profile/edit"
            element={<EditProfile />}
          />
            {/* Simple debug route to verify React is rendering */}
            <Route path="/_debug" element={<div className="p-8 text-xl">Debug: React app is rendering</div>} />
        </Routes>
      </div>

      <ScrollButton />
    </>
  );
};

export default App;
