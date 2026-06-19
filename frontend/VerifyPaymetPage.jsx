import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE = "http://localhost:4000";

const VerifyPaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;

    const verifyPayment = async () => {
      const params = new URLSearchParams(location.search || "");
      const sessionId = params.get("session_id");

      // user cancelled on Stripe
      if (location.pathname === "/appointment/cancel") {
        if (!cancelled)
          navigate("/appointments?payment_status=Cancelled", { replace: true });
        return;
      }

      if (!sessionId) {
        if (!cancelled)
          navigate("/appointments?payment_status=Failed", { replace: true });
        return;
      }

      try {
        // Do NOT set withCredentials unless your server expects cookies. We use plain GET to confirm.
        const res = await axios.get(`${API_BASE}/api/appointments/confirm`, {
          params: { session_id: sessionId },
          timeout: 15000,
        });

        if (cancelled) return;

        if (res?.data?.success) {
          // Payment confirmed on server -> go to appointments
          navigate("/appointments?payment_status=Paid", { replace: true });
        } else {
          navigate("/appointments?payment_status=Failed", { replace: true });
        }
      } catch (error) {
        console.error("Payment verification failed:", error);
        if (!cancelled)
          navigate("/appointments?payment_status=Failed", { replace: true });
      }
    };

    verifyPayment();
    return () => {
      cancelled = true;
    };
  }, [location, navigate]);

  return null;
};

export default VerifyPaymentPage;