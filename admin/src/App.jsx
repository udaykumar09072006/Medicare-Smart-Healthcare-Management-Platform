import React from "react";
import { Routes, Route } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { Link } from "react-router-dom";

// Import your pages
import Home from "./pages/Home/Home";
import Add from "./pages/Add/Add";
import List from "./pages/List/List";
import Appointments from "./pages/Appointments/Appointments";
import SerDashboard from "./pages/SerDashboard/SerDashboard";
import AddSer from "./pages/AddSer/AddSer";
import ListService from "./pages/ListService/ListService";
import ServiceAppointments from "./pages/ServiceAppointments/ServiceAppointments";
import Hero from "./components/Hero/Hero";

function RequireAuth({ children }) {
  const { isLoaded, isSignedIn } = useUser();

  if (!isLoaded) return null; // prevent flicker
  if (!isSignedIn)
    return (
      <div className="min-h-screen font-mono flex items-center justify-center bg-linear-to-b from-emerald-50 via-green-50 to-emerald-100 px-4">
        <div className="text-center">
          {/* Animated text */}
          <p className="text-emerald-800 font-semibold text-lg sm:text-2xl mb-4 animate-fade-in">
            Please sign in to view this page
          </p>

          {/* Button on new line */}
          <div className="flex justify-center">
            <Link
              to="/"
              className="px-4 py-2 text-sm rounded-full bg-emerald-600 text-white shadow-sm
                       hover:bg-emerald-700 hover:shadow-md
                       transition-all duration-300 ease-in-out
                       animate-bounce-subtle"
            >
              HOME
            </Link>
          </div>
        </div>
      </div>
    );
  return children;
}

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Hero />} />
      <Route
        path="/h"
        element={
          <RequireAuth>
            <Home />
          </RequireAuth>
        }
      />
      <Route
        path="/add"
        element={
          <RequireAuth>
            <Add />
          </RequireAuth>
        }
      />
      <Route
        path="/list"
        element={
          <RequireAuth>
            <List />
          </RequireAuth>
        }
      />
      <Route
        path="/appointments"
        element={
          <RequireAuth>
            <Appointments />
          </RequireAuth>
        }
      />
      <Route
        path="/service-dashboard"
        element={
          <RequireAuth>
            <SerDashboard />
          </RequireAuth>
        }
      />
      <Route
        path="/add-service"
        element={
          <RequireAuth>
            <AddSer />
          </RequireAuth>
        }
      />
      <Route
        path="/add-ser"
        element={
          <RequireAuth>
            <AddSer />
          </RequireAuth>
        }
      />
      <Route
        path="/edit-service/:id"
        element={
          <RequireAuth>
            <AddSer />
          </RequireAuth>
        }
      />
      <Route
        path="/list-service"
        element={
          <RequireAuth>
            <ListService />
          </RequireAuth>
        }
      />
      <Route
        path="/service-appointments"
        element={
          <RequireAuth>
            <ServiceAppointments />
          </RequireAuth>
        }
      />
    </Routes>
  );
};

export default App;
