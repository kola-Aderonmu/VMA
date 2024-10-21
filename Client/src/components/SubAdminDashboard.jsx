import React, { useState } from "react";
import {
  FaBars,
  FaChartBar,
  FaCog,
  FaSignOutAlt,
  FaUserFriends,
  FaClipboardList,
  FaUsers,
} from "react-icons/fa";
import { useNavigate, Link, Outlet } from "react-router-dom";
import { logout } from "../utils/auth";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SubAdminDashboard = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`bg-gray-800 text-white transition-all duration-300 ${
          isOpen ? "w-64" : "w-20"
        } space-y-6 py-7 px-2`}
      >
        {/* Toggle Button */}
        <button
          className="text-white focus:outline-none w-full flex justify-center"
          onClick={toggleSidebar}
        >
          <FaBars size={24} />
        </button>

        {/* Navigation Menu */}
        <nav className="mt-10 space-y-4">
          <Link
            to="/subadmindashboard"
            className="flex items-center py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 hover:text-blue-300"
          >
            <FaChartBar className="mr-3" />
            {isOpen && "Dashboard"}
          </Link>
          <Link
            to="/subadmindashboard/visitors"
            className="flex items-center py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 hover:text-blue-300"
          >
            <FaUserFriends className="mr-3" />
            {isOpen && "Visitors"}
          </Link>
          <Link
            to="/subadmindashboard/users"
            className="flex items-center py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 hover:text-blue-300"
          >
            <FaUsers className="mr-3" />
            {isOpen && "User Management"}
          </Link>
          <Link
            to="/subadmindashboard/automated-responses"
            className="flex items-center py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 hover:text-blue-300"
          >
            <FaClipboardList className="mr-3" />
            {isOpen && "Automated Responses"}
          </Link>
          <Link
            to="/subadmindashboard/settings"
            className="flex items-center py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 hover:text-blue-300"
          >
            <FaCog className="mr-3" />
            {isOpen && "Settings"}
          </Link>
        </nav>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 hover:text-red-300 mt-auto"
        >
          <FaSignOutAlt className="mr-3" />
          {isOpen && "Logout"}
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-7 overflow-auto">
        <ToastContainer />
        <Outlet />
      </main>
    </div>
  );
};

export default SubAdminDashboard;
