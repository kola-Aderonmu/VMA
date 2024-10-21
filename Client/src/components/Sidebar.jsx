import React, { useState } from "react";
import { FaBars } from "react-icons/fa"; // Import an icon for the toggle button
import Dashboard from "../pages/DashboardAdmin";
import ApproveUsers from "../pages/ApproveUsers";
import AdminDashboard from "../components/AdminDashboard"; // Ensure this is the correct path
import VisitorsRegister from "../pages/VisitorsRegister";
import Report from "../pages/Report";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false); // State to manage sidebar collapse
  const [activeComponent, setActiveComponent] = useState("dashboard"); // State to manage which component is shown

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  // Function to render the active component based on user selection
  const renderContent = () => {
    switch (activeComponent) {
      case "dashboard":
        return <Dashboard />;
      case "approvals":
        return <AdminDashboard />;
      case "register":
        return <VisitorsRegister />;
      case "report":
        return <Report />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <aside
        className={`bg-gray-700 text-white transition-all duration-300 ${
          isOpen ? "w-40" : "w-16"
        } space-y-6 py-7 px-2`}
      >
        {/* Toggle Button */}
        <button
          className="text-white focus:outline-none"
          onClick={toggleSidebar}
        >
          <FaBars size={24} />
        </button>

        {/* Navigation Menu */}
        <nav className={`mt-10 space-y-4 ${isOpen ? "block" : "hidden"}`}>
          <a
            href="#"
            onClick={() => setActiveComponent("dashboard")} // Set active component to Dashboard
            className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 hover:text-blue-300"
          >
            Dashboard
          </a>
          <a
            href="#"
            onClick={() => setActiveComponent("approvals")} // Set active component to AdminDashboard
            className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 hover:text-blue-300"
          >
            Approvals
          </a>
          <a
            href="#"
            onClick={() => setActiveComponent("register")} // Set active component to Register
            className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 hover:text-blue-300"
          >
            Visitors Register
          </a>
          <a
            href="#"
            onClick={() => setActiveComponent("report")} // Set active component to Reports
            className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 hover:text-blue-300"
          >
            Reports
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-7">
        {/* Render the component based on active selection */}
        {renderContent()}
      </main>
    </div>
  );
};

export default Sidebar;
