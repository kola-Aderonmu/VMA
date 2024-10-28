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

const VisitorRequestHistory = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      await editVisitorRequest(requestId); // Trigger your edit functionality/modal
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

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div>
      {requests.length === 0 ? (
        <p>No visitor requests found.</p>
      ) : (
        <ul className="space-y-4">
          {requests.map((request) => (
            <li key={request._id} className="border p-4 rounded">
              <h3 className="font-semibold">{request.mainVisitor.name}</h3>
              <p>Purpose: {request.purpose}</p>
              <p>Date: {new Date(request.visitDate).toLocaleDateString()}</p>
              <p>Time: {request.visitTime}</p>
              <p>Status: {request.status}</p>

              <div className="flex space-x-4 mt-2">
                {/* Sent Button */}
                {request.status === "pending" && (
                  <button
                    onClick={() => handleSendRequest(request._id)}
                    className="text-green-500 hover:text-green-700"
                    title="Send Request"
                  >
                    <FaPaperPlane />
                  </button>
                )}

                {/* View Button */}
                <button
                  onClick={() => console.log("View request", request._id)}
                  className="text-blue-500 hover:text-blue-700"
                  title="View Request"
                >
                  <FaEye />
                </button>

                {/* Edit Button */}
                <button
                  onClick={() => handleEditRequest(request._id)}
                  className="text-yellow-500 hover:text-yellow-700"
                  title="Edit Request"
                >
                  <FaEdit />
                </button>

                {/* Delete Button */}
                <button
                  onClick={() => handleDeleteRequest(request._id)}
                  className="text-red-500 hover:text-red-700"
                  title="Delete Request"
                >
                  <FaTrashAlt />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default VisitorRequestHistory;
