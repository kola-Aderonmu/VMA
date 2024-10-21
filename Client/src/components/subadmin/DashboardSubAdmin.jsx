import React, { useState, useEffect } from "react";
import { fetchVisitors, fetchAdminData } from "../../services/api";

const DashboardSubAdmin = () => {
  const [dashboardData, setDashboardData] = useState({
    totalVisitors: 0,
    pendingApprovals: 0,
    activeVisits: 0,
    recentVisitors: [],
    visitorsByPurpose: {},
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [visitorsResponse, adminDataResponse] = await Promise.all([
          fetchVisitors(),
          fetchAdminData(),
        ]);

        console.log("Visitors Response:", visitorsResponse);
        console.log("Admin Data Response:", adminDataResponse);

        if (visitorsResponse.success && Array.isArray(visitorsResponse.data)) {
          const visitors = visitorsResponse.data;
          const adminData = adminDataResponse.data;

          const visitorsByPurpose = visitors.reduce((acc, visitor) => {
            acc[visitor.purpose] = (acc[visitor.purpose] || 0) + 1;
            return acc;
          }, {});
          setDashboardData({
            totalVisitors: visitors.length,
            pendingApprovals: visitors.filter((v) => v.status === "Pending")
              .length,
            activeVisits: visitors.filter((v) => v.status === "Active").length,
            recentVisitors: visitors.slice(-5).reverse(),
            visitorsByPurpose,
            // Add any other relevant data from adminData
          });
        } else {
          console.error("Unexpected data format:", visitorsResponse);
          setError("Unexpected data format received from server");
        }

        setLoading(false);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError(`Failed to load dashboard data: ${err.message}`);
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold mb-4">Sub-Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-2">Total Visitors</h2>
          <p className="text-3xl font-bold">{dashboardData.totalVisitors}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-2">Pending Approvals</h2>
          <p className="text-3xl font-bold">{dashboardData.pendingApprovals}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-2">Active Visits</h2>
          <p className="text-3xl font-bold">{dashboardData.activeVisits}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-2">Recent Visitors</h2>
          <ul>
            {dashboardData.recentVisitors.map((visitor, index) => (
              <li key={index} className="mb-2">
                {visitor.name} - {visitor.purpose} ({visitor.status})
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-2">Visitors by Purpose</h2>
          <ul>
            {Object.entries(dashboardData.visitorsByPurpose).map(
              ([purpose, count]) => (
                <li key={purpose} className="mb-2">
                  {purpose}: {count}
                </li>
              )
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DashboardSubAdmin;
