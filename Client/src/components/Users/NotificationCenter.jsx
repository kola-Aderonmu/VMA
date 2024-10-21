// src/components/User/NotificationCenter.jsx
import React, { useState, useEffect } from "react";
import { fetchNotifications } from "../../services/api";

const NotificationCenter = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const data = await fetchNotifications();
      setNotifications(data);
      setLoading(false);
    } catch (err) {
      console.error("Error loading notifications:", err);
      setError("Failed to load notifications. Please try again.");
      setLoading(false);
    }
  };

  if (loading) return <div>Loading notifications...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Notifications</h2>
      {notifications.length === 0 ? (
        <p>No notifications</p>
      ) : (
        <ul className="space-y-2">
          {notifications.map((notification) => (
            <li
              key={notification._id}
              className={`p-2 rounded ${
                notification.type === "success"
                  ? "bg-green-100"
                  : notification.type === "warning"
                  ? "bg-yellow-100"
                  : "bg-blue-100"
              }`}
            >
              {notification.message}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NotificationCenter;
