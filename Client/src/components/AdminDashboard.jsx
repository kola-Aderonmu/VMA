import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaEdit,
  FaTrashAlt,
  FaCheckCircle,
  FaTimes,
  FaSignOutAlt,
} from "react-icons/fa";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [pendingUsers, setPendingUsers] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  const fetchPendingUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:5000/api/admin/pending-users",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();

      if (Array.isArray(data)) {
        setPendingUsers(data);
      } else {
        setPendingUsers([]);
        setError("Unexpected response format. Please try again later.");
      }
    } catch (error) {
      console.error("Error fetching pending users:", error);
      setError("Failed to fetch pending users. Please try again later.");
      setPendingUsers([]);
    }
  };

  const approveUser = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/admin/approve-user/${userId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        alert("User approved successfully!");
        fetchPendingUsers();
      } else {
        alert("Failed to approve user.");
      }
    } catch (error) {
      console.error("Error approving user:", error);
      alert("An error occurred, please try again later.");
    }
  };

  const rejectUser = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/admin/reject-user/${userId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        alert("User rejected successfully!");
        fetchPendingUsers();
      } else {
        alert("Failed to reject user.");
      }
    } catch (error) {
      console.error("Error rejecting user:", error);
      alert("An error occurred, please try again later.");
    }
  };

  const deleteUser = async (userId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/admin/delete-user/${userId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        alert("User deleted successfully!");
        fetchPendingUsers();
      } else {
        alert("Failed to delete user.");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("An error occurred, please try again later.");
    }
  };
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6 shadow-slate-500 shadow-lg rounded-lg p-6">
        Pending User Approvals
      </h2>
      <button
        onClick={handleLogout}
        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded flex items-center"
      >
        <FaSignOutAlt className="mr-2" /> Logout
      </button>
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-2">
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <ul>
          {pendingUsers.length > 0 ? (
            pendingUsers.map((user) => (
              <li
                key={user._id}
                className="flex items-center justify-between p-4 border-b border-gray-200"
              >
                <div>
                  <p className="text-lg font-semibold text-gray-700">
                    {user.fullName} ({user.serviceNumber})
                  </p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
                <div className="flex space-x-4">
                  <button
                    onClick={() => approveUser(user._id)}
                    className="text-green-500 hover:text-green-700 transition"
                    title="Approve User"
                  >
                    <FaCheckCircle size={20} />
                  </button>
                  <button
                    onClick={() => rejectUser(user._id)}
                    className="text-red-500 hover:text-red-700 transition"
                    title="Reject User"
                  >
                    <FaTimes size={20} />
                  </button>
                  <button
                    onClick={() => deleteUser(user._id)}
                    className="text-red-500 hover:text-red-700 transition"
                    title="Delete User"
                  >
                    <FaTrashAlt size={20} />
                  </button>
                </div>
              </li>
            ))
          ) : (
            <p className="text-center text-gray-500">No pending users.</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default AdminDashboard;
