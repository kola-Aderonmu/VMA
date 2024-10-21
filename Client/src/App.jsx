import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Loader from "./components/Loader";
import LoginForm from "./components/Login";
import Dashboard from "./components/Dashboard";
import VisitorManagement from "./components/subadmin/VisitorManagement";
import UserManagement from "./components/subadmin/UserManagement";
import AutomatedResponses from "./components/subadmin/AutomatedResponses";
import AdminDashboard from "./components/AdminDashboard";
import AdminLogin from "./components/AdminLogin";
import ProtectedRoute from "./components/ProtectedRoute";
import SubAdminDashboard from "./components/SubAdminDashboard";
import DashboardSubAdmin from "./components/subadmin/DashboardSubAdmin";
import DashboardContent from "./components/subadmin/DashboardContent";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-toastify/dist/ReactToastify.css";
import UserDashboard from "./components/Users/UserDashboard";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1 className="">Oppss! Something went wrong.</h1>;
    }

    return this.props.children;
  }
}

function App() {
  const [loading, setLoading] = useState(true);

  const handleLoaderFinish = () => {
    setLoading(false);
  };

  return (
    <ErrorBoundary>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Router>
        {loading ? (
          <Loader onFinish={handleLoaderFinish} />
        ) : (
          <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/adminlogin" element={<AdminLogin />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/subadmindashboard" element={<SubAdminDashboard />}>
                <Route
                  path="dashboardsubadmin"
                  element={<DashboardSubAdmin />}
                />
                <Route path="visitors" element={<VisitorManagement />} />
                <Route path="users" element={<UserManagement />} />
                <Route
                  path="automated-responses"
                  element={<AutomatedResponses />}
                />
                {/* Add a route for settings if you have a Settings component */}
                {/* <Route path="settings" element={<Settings />} /> */}
              </Route>
              <Route path="/userdashboard" element={<UserDashboard />}>
                {/* Include all route component for users here */}
              </Route>
              <Route path="/admindashboard" element={<AdminDashboard />} />
            </Route>

            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        )}
      </Router>
    </ErrorBoundary>
  );
}
export default App;
