import React, { useState, useEffect } from "react";
import { Users, Briefcase, Calendar, TrendingUp, Plus, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    doctors: 0,
    services: 0,
    appointments: 0,
    serviceAppointments: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [doctorsRes, servicesRes, appointmentsRes, serviceAppointmentsRes] =
        await Promise.all([
          axios.get("http://localhost:4000/api/doctors"),
          axios.get("http://localhost:4000/api/services"),
          axios.get("http://localhost:4000/api/appointments"),
          axios.get("http://localhost:4000/api/service-appointments"),
        ]);

      setStats({
        doctors: doctorsRes.data.data?.length || doctorsRes.data.doctors?.length || 0,
        services: servicesRes.data.data?.length || servicesRes.data.services?.length || 0,
        appointments:
          appointmentsRes.data.appointments?.length ||
          appointmentsRes.data.data?.length ||
          0,
        serviceAppointments:
          serviceAppointmentsRes.data.appointments?.length ||
          serviceAppointmentsRes.data.data?.length ||
          0,
      });
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ icon: Icon, title, count, color, actions }) => (
    <div
      className={`bg-gradient-to-br ${color} rounded-lg p-6 text-white shadow-lg hover:shadow-xl transition-shadow`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <p className="text-sm opacity-90">{title}</p>
          <p className="text-4xl font-bold mt-2">{loading ? "-" : count}</p>
        </div>
        <Icon size={32} className="opacity-75" />
      </div>
      <div className="flex gap-2 mt-4">
        {actions.map((action) => (
          <button
            key={action.label}
            onClick={() => navigate(action.path)}
            className="flex items-center gap-1 px-3 py-1 bg-white bg-opacity-20 hover:bg-opacity-30 rounded text-sm font-medium transition-all duration-200"
          >
            {action.icon === "plus" ? <Plus size={16} /> : <Eye size={16} />}
            {action.label}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Welcome to the MEDICARE Admin Panel</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={Users}
            title="Total Doctors"
            count={stats.doctors}
            color="from-emerald-500 to-green-600"
            actions={[
              { label: "Add", path: "/add", icon: "plus" },
              { label: "View", path: "/list", icon: "view" },
            ]}
          />
          <StatCard
            icon={Briefcase}
            title="Total Services"
            count={stats.services}
            color="from-blue-500 to-cyan-600"
            actions={[
              { label: "Add", path: "/add-service", icon: "plus" },
              { label: "View", path: "/list-service", icon: "view" },
            ]}
          />
          <StatCard
            icon={Calendar}
            title="Doctor Appointments"
            count={stats.appointments}
            color="from-purple-500 to-pink-600"
            actions={[
              { label: "View All", path: "/appointments", icon: "view" },
            ]}
          />
          <StatCard
            icon={TrendingUp}
            title="Service Appointments"
            count={stats.serviceAppointments}
            color="from-orange-500 to-red-600"
            actions={[
              { label: "View All", path: "/service-appointments", icon: "view" },
            ]}
          />
        </div>

        {/* Quick Actions Section */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              onClick={() => navigate("/add")}
              className="bg-gradient-to-r from-emerald-500 to-green-600 text-white p-6 rounded-lg hover:shadow-lg transition-shadow flex items-center justify-center gap-3"
            >
              <Plus size={24} />
              <span className="font-semibold">Add Doctor</span>
            </button>
            <button
              onClick={() => navigate("/add-service")}
              className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white p-6 rounded-lg hover:shadow-lg transition-shadow flex items-center justify-center gap-3"
            >
              <Plus size={24} />
              <span className="font-semibold">Add Service</span>
            </button>
            <button
              onClick={() => navigate("/list")}
              className="bg-gradient-to-r from-purple-500 to-pink-600 text-white p-6 rounded-lg hover:shadow-lg transition-shadow flex items-center justify-center gap-3"
            >
              <Users size={24} />
              <span className="font-semibold">View Doctors</span>
            </button>
            <button
              onClick={() => navigate("/list-service")}
              className="bg-gradient-to-r from-orange-500 to-red-600 text-white p-6 rounded-lg hover:shadow-lg transition-shadow flex items-center justify-center gap-3"
            >
              <Briefcase size={24} />
              <span className="font-semibold">View Services</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
