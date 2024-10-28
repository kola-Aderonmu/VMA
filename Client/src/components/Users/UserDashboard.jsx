import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CreateVisitorRequest from "./CreateVisitorRequest";
import VisitorRequestHistory from "./VisitorRequestHistory.jsx";
import UserProfile from "./UserProfile";
import VisitorReports from "./VisitorReports";
import NotificationCenter from "./NotificationCenter";
import { FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import { fetchUserProfile, logout } from "../../services/api";

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState("history");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const tabs = [
    {
      id: "history",
      label: "Request History",
      component: VisitorRequestHistory,
    },
    { id: "profile", label: "Profile", component: UserProfile },
    { id: "reports", label: "Reports", component: VisitorReports },
    {
      id: "notifications",
      label: "Notifications",
      component: NotificationCenter,
    },
  ];

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        console.log("Fetching user profile...");
        const userData = await fetchUserProfile();
        console.log("User data received:", userData);

        const firstName = userData.fullName.split(" ")[0];
        const capitalizedFirstName =
          firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();

        setUser({ ...userData, firstName: capitalizedFirstName });
      } catch (error) {
        console.error("Error fetching user profile:", error);
        console.error("Error details:", error.response?.data || error.message);
        navigate("/login");
      }
    };

    loadUserProfile();
  }, [navigate]);

  const renderActiveComponent = () => {
    const ActiveComponent = tabs.find((tab) => tab.id === activeTab)?.component;
    return ActiveComponent ? <ActiveComponent /> : null;
  };

  const handleLogout = async () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      try {
        await logout();
        navigate("/login");
      } catch (error) {
        console.error("Error during logout:", error);
        window.alert("Failed to logout. Please try again.");
      }
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-2xl font-bold text-gray-800">
                  Welcome Back, {user.firstName}
                </h1>
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-gray-700 mr-4">{user.office}</span>
              <FaUserCircle className="text-gray-600 text-2xl mr-2" />
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded inline-flex items-center"
              >
                <FaSignOutAlt className="mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <div className="flex space-x-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`px-4 py-2 rounded-md transition-colors duration-200 ${
                  activeTab === tab.id
                    ? "bg-blue-500 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
          >
            Create Request
          </button>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6">
          {renderActiveComponent()}
        </div>
      </div>

      {/* Modal for Creating Visitor Request */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-3/4 max-w-4xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Create Visitor Request
              </h3>

              <div className="mt-2 px-7 py-3">
                <CreateVisitorRequest
                  isOpen={isModalOpen}
                  onClose={() => setIsModalOpen(false)}
                />
              </div>

              <div className="items-center px-4 py-3 text-center">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
