import React from "react";
import { Bar, Doughnut, Bubble } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
} from "chart.js";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement
);

const Dashboard = () => {
  // Dummy data
  const visitorsToday = 150;
  const visitorsThisWeek = 1230;
  const visitorsThisMonth = 5200;

  const barChartData = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "Visitors",
        data: [
          1200, 1900, 800, 1500, 2000, 2200, 1700, 1600, 2300, 1900, 2500, 2100,
        ],
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  };

  const doughnutData = {
    labels: ["Male", "Female", "Group"],
    datasets: [
      {
        label: "Page Views",
        data: [300, 450, 700],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
        hoverOffset: 4,
      },
    ],
  };

  const bubbleChartData = {
    datasets: [
      {
        label: "Visitors Stat",
        data: [
          { x: 100, y: 300, r: 10 },
          { x: 200, y: 400, r: 15 },
          { x: 300, y: 200, r: 25 },
        ],
        backgroundColor: "rgba(255, 99, 132, 0.6)",
      },
    ],
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-semibold mb-6"> Dashboard</h1>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-xl">Visitors Today</h3>
          <p className="text-4xl font-bold">{visitorsToday}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-xl">Visitors This Week</h3>
          <p className="text-4xl font-bold">{visitorsThisWeek}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-xl">Visitors This Month</h3>
          <p className="text-4xl font-bold">{visitorsThisMonth}</p>
        </div>
      </div>

      {/* Graphs Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-xl mb-4">Visitors per Month</h3>
          <Bar data={barChartData} />
        </div>

        {/* Doughnut Chart */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-xl mb-4">Page Views</h3>
          <Doughnut data={doughnutData} />
        </div>

        {/* Bubble Chart */}
        <div className="bg-white p-4 rounded-lg shadow-md col-span-2">
          <h3 className="text-xl mb-4">Visitor Stats</h3>
          <Bubble data={bubbleChartData} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
