import React, { useState, useEffect } from "react";
import { fetchVisitors } from "../../services/api";
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

const Reports = () => {
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadVisitors = async () => {
      try {
        const response = await fetchVisitors();
        setVisitors(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load visitors");
        setLoading(false);
      }
    };

    loadVisitors();
  }, []);

  const getVisitorsByStatus = () => {
    const statusCounts = visitors.reduce((acc, visitor) => {
      acc[visitor.status] = (acc[visitor.status] || 0) + 1;
      return acc;
    }, {});

    return {
      labels: Object.keys(statusCounts),
      datasets: [
        {
          label: "Visitors by Status",
          data: Object.values(statusCounts),
          backgroundColor: [
            "rgba(255, 99, 132, 0.6)",
            "rgba(54, 162, 235, 0.6)",
            "rgba(255, 206, 86, 0.6)",
          ],
        },
      ],
    };
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold mb-4">Visitor Reports</h1>
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Visitors by Status</h2>
        <Bar data={getVisitorsByStatus()} />
      </div>
      {/* Add more charts or tables as needed */}
    </div>
  );
};

export default Reports;
