import React, { useState, useEffect } from "react";
import { Line, Pie } from "react-chartjs-2";
import { getUserDashboardStats } from "../../services/api";
import LoadingSpinner from "../common/LoadingSpinner";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const UserHome = () => {
  const [metrics, setMetrics] = useState({
    totalRequests: 0,
    pendingRequests: 0,
    approvedRequests: 0,
    rejectedRequests: 0,
    monthlyData: [], // Initialize as empty array
    recentActivity: [], // Initialize as empty array
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const data = await getUserDashboardStats();
      console.log("Dashboard Data:", data); // Checking the data structure here
      setMetrics({
        totalRequests: data.totalRequests || 0,
        pendingRequests: data.pendingRequests || 0,
        approvedRequests: data.approvedRequests || 0,
        rejectedRequests: data.rejectedRequests || 0,
        monthlyData: data.monthlyData || [],
        recentActivity: data.recentActivity || [],
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const lineChartData = {
    labels: metrics.monthlyData?.map((item) => item.month) || [],
    datasets: [
      {
        label: "Visitor Requests",
        data: metrics.monthlyData?.map((item) => item.count) || [],
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  };

  const pieChartData = {
    labels: ["Pending", "Approved", "Rejected"],
    datasets: [
      {
        data: [
          metrics.pendingRequests,
          metrics.approvedRequests,
          metrics.rejectedRequests,
        ],
        backgroundColor: [
          "#FCD34D", // yellow
          "#34D399", // green
          "#EF4444", // red
        ],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
      },
    },
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricCard
          title="Total Requests"
          value={metrics.totalRequests}
          bgColor="bg-blue-500"
          icon="📊"
        />
        <MetricCard
          title="Pending"
          value={metrics.pendingRequests}
          bgColor="bg-yellow-500"
          icon="⏳"
        />
        <MetricCard
          title="Approved"
          value={metrics.approvedRequests}
          bgColor="bg-green-500"
          icon="✅"
        />
        <MetricCard
          title="Rejected"
          value={metrics.rejectedRequests}
          bgColor="bg-red-500"
          icon="✖"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Visitor Requests Trend</h2>
          <div className="h-[300px]">
            <Line data={lineChartData} options={chartOptions} />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">
            Request Status Distribution
          </h2>
          <div className="h-[300px]">
            <Pie data={pieChartData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="mt-8 bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2">Visitor Name</th>
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {metrics.recentActivity?.length > 0 ? (
                metrics.recentActivity.map((activity, index) => (
                  <tr key={index} className="border-b">
                    <td className="px-4 py-2">{activity.visitorName}</td>
                    <td className="px-4 py-2">
                      {new Date(activity.date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2">
                      <span
                        className={`px-2 py-1 rounded-full text-sm ${
                          activity.status === "approved"
                            ? "bg-green-100 text-green-800"
                            : activity.status === "rejected"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {activity.status.charAt(0).toUpperCase() +
                          activity.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="px-4 py-2 text-center">
                    No recent activity available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const MetricCard = ({ title, value, bgColor, icon }) => (
  <div className={`${bgColor} text-white rounded-lg p-6 shadow-lg`}>
    <div className="flex justify-between items-center">
      <div>
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-3xl font-bold">{value}</p>
      </div>
      <span className="text-4xl">{icon}</span>
    </div>
  </div>
);

export default UserHome;
