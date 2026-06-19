import React, { useState, useEffect } from "react";
import { ArrowLeft, CheckCircle, Clock, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const DoctorAppointments = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:4000/api/appointments");
      setAppointments(response.data.data || response.data.appointments || []);
      setError(null);
    } catch (err) {
      setError("Failed to fetch appointments");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "canceled":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
        return <CheckCircle size={18} />;
      case "completed":
        return <CheckCircle size={18} />;
      case "canceled":
        return <XCircle size={18} />;
      case "pending":
        return <Clock size={18} />;
      default:
        return null;
    }
  };

  const filteredAppointments =
    filter === "all"
      ? appointments
      : appointments.filter((apt) => {
          const status = apt.status || apt.payment?.status || "";
          return status.toLowerCase() === filter.toLowerCase();
        });

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-purple-50 p-4 md:p-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-purple-700 hover:text-purple-900 mb-6 transition-colors"
      >
        <ArrowLeft size={20} /> Back
      </button>

      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 md:px-8 py-6">
          <h1 className="text-3xl font-bold text-white">Doctor Appointments</h1>
          <p className="text-purple-100 mt-2">View and manage all doctor appointments</p>
        </div>

        {/* Filter Buttons */}
        <div className="p-6 border-b border-gray-200 flex flex-wrap gap-3">
          {["all", "pending", "confirmed", "completed", "canceled"].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-full font-medium transition-colors capitalize ${
                filter === status
                  ? "bg-purple-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 m-6">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="p-8 text-center text-gray-600">Loading appointments...</div>
        ) : filteredAppointments.length === 0 ? (
          <div className="p-8 text-center text-gray-600">No appointments found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Patient</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Doctor</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Date & Time</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Fee</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredAppointments.map((appointment, idx) => (
                  <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{appointment.patientName || "Unknown"}</p>
                        <p className="text-sm text-gray-500">{appointment.mobile || "-"}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">{appointment.doctorId?.name || appointment.doctorName || "Unknown"}</p>
                      <p className="text-sm text-gray-500">{appointment.doctorId?.specialization || appointment.speciality || appointment.specialization || "-"}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {appointment.date ? (
                        <>
                          {new Date(`${appointment.date}T00:00:00`).toLocaleDateString()}
                          <br />
                          {appointment.time || "-"}
                        </>
                      ) : appointment.appointmentDate ? (
                        <>
                          {new Date(appointment.appointmentDate).toLocaleDateString()}
                          <br />
                          {appointment.appointmentTime || "-"}
                        </>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="px-6 py-4 font-semibold text-purple-600">
                      ₹{typeof appointment.fees === "number" ? appointment.fees : appointment.fee || 0}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                          appointment.status
                        )}`}
                      >
                        {getStatusIcon(appointment.status)}
                        {appointment.status || "Unknown"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="p-6 border-t border-gray-200 text-sm text-gray-600">
          Total: {filteredAppointments.length} appointments
        </div>
      </div>
    </div>
  );
};

export default DoctorAppointments;
