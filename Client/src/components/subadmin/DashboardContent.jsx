import React, { useState, useEffect, useCallback } from "react";
import { FaBell, FaUserPlus, FaChartPie, FaChartBar } from "react-icons/fa";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from "chart.js";
import { fetchVisitors, createVisitor } from "../../services/api";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

const DashboardContent = () => {
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newRequests, setNewRequests] = useState(0);

  const loadVisitors = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetchVisitors();
      console.log("Visitors response:", response); // Add this line
      if (response && Array.isArray(response)) {
        setVisitors(response);
      } else {
        console.error("Unexpected data format:", response);
        setVisitors([]);
        setError("Unexpected data format received from server");
      }
      setLoading(false);
    } catch (err) {
      console.error("Error loading visitors:", err);
      if (err.response) {
        console.error("Response data:", err.response.data);
        console.error("Response status:", err.response.status);
      }
      setError(`Failed to load visitors: ${err.message}`);
      setVisitors([]);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadVisitors();
    // Set up WebSocket for real-time notifications here
  }, [loadVisitors]);

  const getTotalVisitorsForWeek = () => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    return visitors.filter(
      (visitor) => new Date(visitor.visitDate) >= oneWeekAgo
    ).length;
  };

  const getTotalVisitorsForDay = () => {
    const today = new Date().toDateString();
    return visitors.filter(
      (visitor) => new Date(visitor.visitDate).toDateString() === today
    ).length;
  };

  const handleCreateNewVisitor = async () => {
    try {
      const newVisitor = {
        title: "Mr",
        name: "John",
        surname: "Doe",
        phoneNumber: "1234567890",
        address: "123 Main St",
        officeOfVisit: "HR",
        timeOfVisit: new Date().toISOString(),
      };
      await createVisitor(newVisitor);
      toast.success("New visitor created successfully");
      loadVisitors();
    } catch (error) {
      console.error("Error creating new visitor:", error);
      toast.error("Failed to create new visitor");
    }
  };

  const pieChartData = {
    labels: ["Male", "Female", "Group"],
    datasets: [
      {
        data: [
          visitors.filter((v) => v.category === "Male").length,
          visitors.filter((v) => v.category === "Female").length,
          visitors.filter((v) => v.category === "Group").length,
        ],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
        hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
      },
    ],
  };

  const barChartData = {
    labels: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ],
    datasets: [
      {
        label: "Visitors per Day",
        data: [12, 19, 3, 5, 2, 3, 9], // Replace with actual data
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  if (error)
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        {error}
      </div>
    );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">SubAdmin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <DashboardBox
          title="Total Visitors for the Week"
          value={getTotalVisitorsForWeek()}
        />
        <DashboardBox
          title="Total Visitors for the Day"
          value={getTotalVisitorsForDay()}
        />
        <DashboardBox
          title="Requests"
          value={newRequests}
          icon={<FaBell className="text-yellow-500" />}
          onClick={() => {
            /* Handle requests view */
          }}
        />
        <DashboardBox
          title="New Visitors"
          value="Create"
          icon={<FaUserPlus className="text-green-500" />}
          onClick={handleCreateNewVisitor}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Visitors by Category</h2>
          <Pie data={pieChartData} />
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Visitors per Day</h2>
          <Bar data={barChartData} />
        </div>
      </div>
    </div>
  );
};

const DashboardBox = ({ title, value, icon, onClick }) => (
  <div
    className="bg-white p-6 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow duration-300"
    onClick={onClick}
  >
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-lg font-semibold">{title}</h3>
      {icon}
    </div>
    <p className="text-3xl font-bold">{value}</p>
  </div>
);

export default DashboardContent;
