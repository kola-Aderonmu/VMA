// src/components/User/VisitorReports.jsx src path
import React, { useState, useEffect } from "react";
import { fetchVisitorStats } from "../../services/api";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const VisitorReports = () => {
  const [stats, setStats] = useState({ daily: [], monthly: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadVisitorStats();
  }, []);

  const loadVisitorStats = async () => {
    try {
      setLoading(true);
      const data = await fetchVisitorStats();
      setStats(data);
      setLoading(false);
    } catch (err) {
      console.error("Error loading visitor stats:", err);
      setError("Failed to load visitor statistics. Please try again.");
      setLoading(false);
    }
  };

  const dailyChartData = {
    labels: stats.daily.map((stat) => stat.date),
    datasets: [
      {
        label: "Daily Visitors",
        data: stats.daily.map((stat) => stat.count),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  };

  const monthlyChartData = {
    labels: stats.monthly.map((stat) => stat.month),
    datasets: [
      {
        label: "Monthly Visitors",
        data: stats.monthly.map((stat) => stat.count),
        backgroundColor: "rgba(153, 102, 255, 0.6)",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Visitor Statistics",
      },
    },
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Visitor Reports</h2>
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-2">Daily Visitors</h3>
        <Bar data={dailyChartData} options={chartOptions} />
      </div>
      <div>
        <h3 className="text-xl font-semibold mb-2">Monthly Visitors</h3>
        <Bar data={monthlyChartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default VisitorReports;
