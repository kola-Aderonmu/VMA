// src/components/User/VisitorRequestHistory.jsx
import React, { useState, useEffect } from "react";
import {
  fetchVisitorRequests,
  cancelVisitorRequest,
  sendVisitorRequest,
  editVisitorRequest,
  deleteVisitorRequest,
} from "../../services/api";
import { FaPaperPlane, FaEye, FaEdit, FaTrashAlt } from "react-icons/fa";
import defaultMaleAvatar from "../../assets/male-avatar.png";
import defaultFemaleAvatar from "../../assets/female-avatar.png";

const VisitorRequestHistory = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // New state for search term

  useEffect(() => {
    loadVisitorRequests();
  }, []);

  const loadVisitorRequests = async () => {
    try {
      setLoading(true);
      setError(null); // Reset error state
      const data = await fetchVisitorRequests();
      setRequests(Array.isArray(data) ? data : []);
      setLoading(false);
    } catch (err) {
      console.error("Error loading visitor requests:", err);
      setError(
        err.message || "Failed to load visitor requests. Please try again."
      );
      setLoading(false);
    }
  };

  const handleCancelRequest = async (requestId) => {
    try {
      await cancelVisitorRequest(requestId);
      loadVisitorRequests(); // Reload the list after cancellation
    } catch (err) {
      console.error("Error cancelling request:", err);
      setError("Failed to cancel request. Please try again.");
    }
  };

  const handleSendRequest = async (requestId) => {
    try {
      await sendVisitorRequest(requestId);
      loadVisitorRequests(); // Reload the list after sending
    } catch (err) {
      console.error("Error sending request:", err);
      setError("Failed to send request. Please try again.");
    }
  };

  const handleEditRequest = async (requestId) => {
    try {
      await editVisitorRequest(requestId);
      loadVisitorRequests(); // Reload the list after editing
    } catch (err) {
      console.error("Error editing request:", err);
      setError("Failed to edit request. Please try again.");
    }
  };

  const handleDeleteRequest = async (requestId) => {
    try {
      await deleteVisitorRequest(requestId);
      loadVisitorRequests(); // Reload the list after deletion
    } catch (err) {
      console.error("Error deleting request:", err);
      setError("Failed to delete request. Please try again.");
    }
  };

  const filteredRequests = requests.filter((request) => {
    const { name, purpose } = request.mainVisitor;
    return (
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      purpose.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.status.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="overflow-x-auto">
      <div className="p-4">
        <input
          type="text"
          placeholder="Search by Name, Purpose, or Status"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 p-2 rounded w-full mb-4"
        />
      </div>
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr className="bg-gray-100 border-b">
            <th className="px-4 py-2">Photo</th>
            <th className="px-4 py-2">Title</th>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Purpose</th>
            <th className="px-4 py-2">Gender</th>
            <th className="px-4 py-2">Date</th>
            <th className="px-4 py-2">Time</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredRequests.map((request) => (
            <tr key={request._id} className="border-b hover:bg-gray-50">
              <td className="px-4 py-2">
                {request.mainVisitor.photoUrl ? (
                  <img
                    src={request.mainVisitor.photoUrl}
                    alt="Visitor"
                    className="w-10 h-10 rounded-full"
                  />
                ) : (
                  <img
                    src={
                      request.mainVisitor.gender === "M"
                        ? defaultMaleAvatar
                        : defaultFemaleAvatar
                    }
                    alt="Default Avatar"
                    className="w-10 h-10 rounded-full"
                  />
                )}
              </td>
              <td className="px-4 py-2">{request.mainVisitor.title}</td>
              <td className="px-4 py-2">{request.mainVisitor.name}</td>
              <td className="px-4 py-2">{request.mainVisitor.purpose}</td>
              <td className="px-4 py-2">{request.mainVisitor.gender}</td>
              <td className="px-4 py-2">
                {new Date(request.mainVisitor.visitDate).toLocaleDateString()}
              </td>
              <td className="px-4 py-2">{request.mainVisitor.visitTime}</td>
              <td className="px-4 py-2">
                <span
                  className={`px-2 py-1 rounded ${
                    request.status === "Leave"
                      ? "bg-red-500 text-white"
                      : "bg-green-500 text-white"
                  }`}
                >
                  {request.status}
                </span>
              </td>
              <td className="px-4 py-2 flex space-x-2">
                {request.status === "pending" && (
                  <button
                    onClick={() => handleSendRequest(request._id)}
                    className="text-green-500 hover:text-green-700"
                    title="Send Request"
                  >
                    <FaPaperPlane />
                  </button>
                )}
                <button
                  onClick={() => console.log("View request", request._id)}
                  className="text-blue-500 hover:text-blue-700"
                  title="View Request"
                >
                  <FaEye />
                </button>
                <button
                  onClick={() => handleEditRequest(request._id)}
                  className="text-yellow-500 hover:text-yellow-700"
                  title="Edit Request"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDeleteRequest(request._id)}
                  className="text-red-500 hover:text-red-700"
                  title="Delete Request"
                >
                  <FaTrashAlt />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VisitorRequestHistory;
