require("dotenv").config();
const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const rateLimit = require("express-rate-limit");
const cors = require("cors");
const linkDatabase = require("./config/db.js");

// Route imports
const visitorRoutes = require("./routes/visitor");
const adminRoutes = require("./routes/admin");
const adminCheckRoutes = require("./routes/admincheck");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/userRoutes");

// Initialize the app
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// WebSocket setup
wss.on("connection", (ws) => {
  console.log("Client connected");
  ws.on("message", (message) => {
    console.log("Received:", message);
  });
  ws.on("close", () => {
    console.log("Client disconnected");
  });
});

function broadcast(data) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
}

// Environment validation
if (!process.env.JWT_SECRET || !process.env.REFRESH_TOKEN_SECRET) {
  console.error(
    "Missing required environment variables. Please check your .env file."
  );
  process.exit(1);
}

// Rate limiters
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again later.",
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 8,
  message:
    "Too many login attempts from this IP, please try again after 15 minutes.",
});

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(globalLimiter);
app.use(express.json());

// Database connection
linkDatabase();

// Route configurations
app.use("/api/visitors", visitorRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/admincheck", adminCheckRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/auth/login", loginLimiter);
app.use("/api/auth/superadmin/login", loginLimiter);
app.use("/api/user", userRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/api/dashboard", userRoutes);

// Server startup
const port = process.env.PORT || 5000;
server.listen(port, () => {
  console.log(`\nBackend Created!\nServer is running on port ${port}`);
});
