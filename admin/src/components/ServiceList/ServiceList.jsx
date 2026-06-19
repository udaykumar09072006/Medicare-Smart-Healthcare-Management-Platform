import React, { useState, useEffect } from "react";
import { ArrowLeft, Trash2, Edit, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ServiceList = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:4000/api/services");
      setServices(response.data.data || response.data.services || []);
      setError(null);
    } catch (err) {
      setError("Failed to fetch services");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/api/services/${id}`);
      setServices(services.filter((s) => s._id !== id));
      setDeleteConfirm(null);
    } catch (err) {
      setError("Failed to delete service");
    }
  };

  const filteredServices = services.filter(
    (svc) =>
      svc.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      svc.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-50 p-4 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-blue-700 hover:text-blue-900 transition-colors"
        >
          <ArrowLeft size={20} /> Back
        </button>
        <button
          onClick={() => navigate("/add-ser")}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} /> Add Service
        </button>
      </div>

      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 px-6 md:px-8 py-6">
          <h1 className="text-3xl font-bold text-white">Services List</h1>
          <p className="text-blue-100 mt-2">Manage all healthcare services</p>
        </div>

        {/* Search Bar */}
        <div className="p-6 border-b border-gray-200">
          <input
            type="text"
            placeholder="Search by name or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
          />
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 m-6">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="p-8 text-center text-gray-600">Loading services...</div>
        ) : filteredServices.length === 0 ? (
          <div className="p-8 text-center text-gray-600">
            No services found. <button onClick={() => navigate("/add-ser")} className="text-blue-600 hover:underline">Add one now</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {filteredServices.map((service) => (
              <div
                key={service._id}
                className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
              >
                {service.imageUrl && (
                  <img
                    src={service.imageUrl}
                    alt={service.name}
                    className="w-full h-40 object-cover"
                  />
                )}
                <div className="p-4">
                  <h3 className="font-bold text-lg text-gray-900 mb-2">{service.name}</h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{service.description}</p>
                  
                  <div className="space-y-2 mb-4">
                    {service.category && (
                      <p className="text-sm text-gray-700">
                        <span className="font-semibold">Category:</span> {service.category}
                      </p>
                    )}
                    <p className="text-lg font-bold text-blue-600">₹{service.price || 0}</p>
                    {service.duration && (
                      <p className="text-sm text-gray-600">Duration: {service.duration} mins</p>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/edit-service/${service._id}`)}
                      className="flex-1 flex items-center justify-center gap-2 p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit size={18} /> Edit
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(service._id)}
                      className="flex-1 flex items-center justify-center gap-2 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={18} /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Delete Service?</h3>
            <p className="text-gray-600 mb-6">This action cannot be undone.</p>
            <div className="flex gap-4">
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceList;
