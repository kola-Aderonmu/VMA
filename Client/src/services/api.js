// src/services/api.js

import axios from "axios";

const API_URL = "http://localhost:5000/api";
const WEBSOCKET_URL = "ws://localhost:5000";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    let errorMessage = "An unexpected error occurred";
    if (error.response) {
      errorMessage = error.response.data.message || errorMessage;
    } else if (error.request) {
      errorMessage = "No response received from the server";
    } else {
      errorMessage = error.message;
    }
    return Promise.reject(new Error(errorMessage));
  }
);

// WebSocket connection
export const createWebSocketConnection = (onMessage, onError, onClose) => {
  const ws = new WebSocket(WEBSOCKET_URL);

  ws.onopen = () => {
    console.log("WebSocket Connected");
  };

  ws.onmessage = onMessage;
  ws.onerror = onError;
  ws.onclose = onClose;

  return ws;
};

// Authentication
export const login = (credentials) => api.post("/auth/login", credentials);
export const checkAdminStatus = () => api.get("/admincheck");

// Visitors
export const fetchVisitors = async () => {
  try {
    const response = await api.get("/admin/create-visitor");
    return response.data;
  } catch (error) {
    console.error("Error fetching visitors:", error);
    throw error;
  }
};

export const createVisitor = async (visitorData) => {
  try {
    const response = await api.post("/visitors", visitorData);
    return response.data;
  } catch (error) {
    console.error("Error creating visitor:", error);
    throw error;
  }
};

export const approveVisitor = (id) => api.put(`/visitors/${id}/approve`);
export const rejectVisitor = (id) => api.put(`/visitors/${id}/reject`);
export const updateVisitor = (id, visitorData) =>
  api.put(`/visitors/${id}`, visitorData);

// Admin
export const fetchAdminData = async () => {
  try {
    const response = await api.get("/admin/pending-users");
    return response.data;
  } catch (error) {
    console.error("Error fetching admin data:", error);
    throw error;
  }
};

// Users
export const fetchUsers = () => api.get("/users");
export const createUser = (userData) => api.post("/users", userData);
export const updateUser = (id, userData) => api.put(`/users/${id}`, userData);
export const deleteUser = (id) => api.delete(`/users/${id}`);

// Automated Responses
export const fetchAutomatedResponses = () => api.get("/automated-responses");
export const updateAutomatedResponse = (id, data) =>
  api.put(`/automated-responses/${id}`, data);

export const createVisitorRequest = async (formData) => {
  const response = await api.post("/visitor-requests", formData);
  return response.data;
};

export const fetchVisitorRequests = async () => {
  const response = await api.get("/visitor-requests");
  return response.data;
};

export const cancelVisitorRequest = async (requestId) => {
  const response = await api.delete(`/visitor-requests/${requestId}`);
  return response.data;
};

export const fetchUserProfile = async () => {
  try {
    console.log("Making request to /user/profile");
    const response = await api.get("/user/profile");
    console.log("Response received:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Detailed error:",
      error.response ? error.response.data : error.message
    );
    throw new Error(`Error fetching user profile: ${error.message}`);
  }
};

export const updateUserProfile = async (profileData) => {
  const response = await api.put("/user/profile", profileData);
  return response.data;
};

export const fetchVisitorStats = async () => {
  const response = await api.get("/visitor-stats");
  return response.data;
};

export const fetchNotifications = async () => {
  try {
    const response = await api.get("/notifications");
    return response.data;
  } catch (error) {
    console.error("Error fetching notifications:", error);
    throw error;
  }
};

// Sending a visitor request (e.g., changes status from 'pending' to 'sent')
export const sendVisitorRequest = async (requestId) => {
  try {
    const response = await api.put(`/visitor-requests/${requestId}/send`);
    return response.data;
  } catch (error) {
    console.error("Error sending visitor request:", error);
    throw error;
  }
};

// Editing a visitor request
export const editVisitorRequest = async (requestId, updatedData) => {
  try {
    const response = await api.put(
      `/visitor-requests/${requestId}`,
      updatedData
    );
    return response.data;
  } catch (error) {
    console.error("Error editing visitor request:", error);
    throw error;
  }
};

// Deleting a visitor request
export const deleteVisitorRequest = async (requestId) => {
  try {
    const response = await api.delete(`/visitor-requests/${requestId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting visitor request:", error);
    throw error;
  }
};

export const logout = async () => {
  try {
    const response = await api.post("/user/logout");
    console.log("Logout response:", response.data);
    localStorage.removeItem("token");
    return response.data;
  } catch (error) {
    console.error("Error during logout:", error);
    throw new Error("Failed to logout, please try again later.");
  }
};

export default api;