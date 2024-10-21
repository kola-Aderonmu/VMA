import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  if (!token) {
    // Redirect to the login page if not logged in
    return <Navigate to="/login" replace />;
  }

  // Check if the user is a subadmin and trying to access the subadmin dashboard
  if (user) {
    if (
      user.role === "superadmin" &&
      window.location.pathname.startsWith("/admindashboard")
    ) {
      return <Outlet />;
    }
    if (
      user.role === "subadmin" &&
      window.location.pathname.startsWith("/subadmindashboard")
    ) {
      return <Outlet />;
    }
    if (
      user.role === "office" &&
      window.location.pathname.startsWith("/userdashboard")
    ) {
      return <Outlet />;
    }
  }

  // If the user doesn't have the right role for the current route, redirect to their appropriate dashboard
  if (user.role === "superadmin") {
    return <Navigate to="/admindashboard" replace />;
  } else if (user.role === "subadmin") {
    return <Navigate to="/subadmindashboard" replace />;
  } else if (user.role === "office") {
    return <Navigate to="/userdashboard" replace />;
  }

  // Default fallback - If the user is logged in but doesn't have the right role for the current route, redirect to a default page
  return <Navigate to="/dashboard" replace />;
};

export default ProtectedRoute;
