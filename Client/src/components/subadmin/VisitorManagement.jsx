import React, { useState, useEffect, useCallback } from "react";
import {
  fetchVisitors,
  approveVisitor,
  rejectVisitor,
  updateVisitor,
} from "../../services/api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import EditVisitorModal from "./EditVisitorModal";

const WEBSOCKET_URL = "ws://localhost:5000";

const VisitorManagement = () => {
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [visitorsPerPage] = useState(10);
  const [editingVisitor, setEditingVisitor] = useState(null);

  const loadVisitors = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetchVisitors();

      if (response.success && Array.isArray(response.data)) {
        setVisitors(response.data);
      } else {
        console.error("Unexpected data format:", response);
        setVisitors([]);
        setError("Unexpected data format received from server");
      }
      setLoading(false);
    } catch (err) {
      console.error("Error loading visitors:", err);
      setError("Failed to load visitors");
      setVisitors([]);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadVisitors();

    const ws = new WebSocket(WEBSOCKET_URL);
    ws.onopen = () => {
      console.log("WebSocket Connected");
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "NEW_VISITOR") {
        setVisitors((prevVisitors) => [...prevVisitors, data.visitor]);
        toast.info(`New visitor: ${data.visitor.name}`);
      } else if (data.type === "UPDATE_VISITOR") {
        setVisitors((prevVisitors) =>
          prevVisitors.map((v) => (v.id === data.visitor.id ? data.visitor : v))
        );
        toast.info(`Visitor updated: ${data.visitor.name}`);
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      toast.error(
        "WebSocket connection error. Real-time updates may not work."
      );
    };

    ws.onclose = () => {
      console.log("WebSocket Disconnected");
      toast.warn("WebSocket disconnected. Reconnecting...");
      // Implement reconnection logic here if needed
    };

    return () => {
      ws.close();
    };
  }, [loadVisitors]);

  const handleEdit = (visitor) => {
    setEditingVisitor(visitor);
  };

  const handleUpdateVisitor = async (updatedVisitor) => {
    try {
      const response = await updateVisitor(updatedVisitor.id, updatedVisitor);
      if (response.data && response.data.success) {
        toast.success("Visitor updated successfully");
        setEditingVisitor(null);
        loadVisitors();
      } else {
        toast.error("Failed to update visitor");
      }
    } catch (err) {
      console.error("Error updating visitor:", err);
      toast.error("Failed to update visitor");
    }
  };

  const handleApprove = async (id) => {
    try {
      const response = await approveVisitor(id);
      if (response.data && response.data.success) {
        toast.success("Visitor approved successfully");
        loadVisitors();
      } else {
        toast.error("Failed to approve visitor");
      }
    } catch (err) {
      console.error("Error approving visitor:", err);
      toast.error("Failed to approve visitor");
    }
  };

  const handleReject = async (id) => {
    try {
      const response = await rejectVisitor(id);
      if (response.data && response.data.success) {
        toast.success("Visitor rejected successfully");
        loadVisitors();
      } else {
        toast.error("Failed to reject visitor");
      }
    } catch (err) {
      console.error("Error rejecting visitor:", err);
      toast.error("Failed to reject visitor");
    }
  };

  const filteredVisitors = visitors.filter((visitor) => {
    return (
      (filter === "All" || visitor.status === filter) &&
      (visitor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        visitor.purpose.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  // Get current visitors
  const indexOfLastVisitor = currentPage * visitorsPerPage;
  const indexOfFirstVisitor = indexOfLastVisitor - visitorsPerPage;
  const currentVisitors = filteredVisitors.slice(
    indexOfFirstVisitor,
    indexOfLastVisitor
  );

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container mx-auto px-4">
      <ToastContainer />
      <h1 className="text-2xl font-bold mb-4">Sub Admin Dashbaord</h1>

      <div className="mb-4 flex justify-between items-center">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="All">All</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
        <input
          type="text"
          placeholder="Search visitors..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border rounded"
        />
      </div>

      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Name</th>
            <th className="py-2 px-4 border-b">Purpose</th>
            <th className="py-2 px-4 border-b">Status</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentVisitors.map((visitor) => (
            <tr key={visitor.id}>
              <td className="py-2 px-4 border-b">{visitor.name}</td>
              <td className="py-2 px-4 border-b">{visitor.purpose}</td>
              <td className="py-2 px-4 border-b">{visitor.status}</td>
              <td className="py-2 px-4 border-b">
                <button
                  onClick={() => handleApprove(visitor.id)}
                  className="bg-green-500 text-white px-2 py-1 rounded mr-2"
                  disabled={visitor.status !== "Pending"}
                >
                  Approve
                </button>
                <button
                  onClick={() => handleReject(visitor.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                  disabled={visitor.status !== "Pending"}
                >
                  Reject
                </button>
                <button
                  onClick={() => handleEdit(visitor)}
                  className="bg-blue-500 text-white px-2 py-1 rounded"
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4 flex justify-center">
        {Array.from(
          { length: Math.ceil(filteredVisitors.length / visitorsPerPage) },
          (_, i) => (
            <button
              key={i}
              onClick={() => paginate(i + 1)}
              className={`mx-1 px-3 py-1 border rounded ${
                currentPage === i + 1 ? "bg-blue-500 text-white" : ""
              }`}
            >
              {i + 1}
            </button>
          )
        )}

        {editingVisitor && (
          <EditVisitorModal
            visitor={editingVisitor}
            onClose={() => setEditingVisitor(null)}
            onUpdate={handleUpdateVisitor}
          />
        )}
      </div>
    </div>
  );
};

export default VisitorManagement;
