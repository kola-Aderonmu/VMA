require("dotenv").config();
const express = require("express");
const http = require("http");
const WebSocket = require("ws");

const rateLimit = require("express-rate-limit");
const cors = require("cors");
const { config } = require("dotenv");
const linkDatabase = require("./config/db.js");
const visitorRoutes = require("./routes/visitor");
const adminRoutes = require("./routes/admin");
const adminCheckRoutes = require("./routes/admincheck"); // Importing admincheck.js
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/userRoutes");
const authenticateUser = require("./middleware/authMiddleware");

// Initialize the app
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on("connection", (ws) => {
  console.log("Client connected");

  ws.on("message", (message) => {
    console.log("Received:", message);
    // Handle incoming messages if needed
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});

// Broadcast to all clients
function broadcast(data) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
}
config();

console.log("JWT_SECRET:", process.env.JWT_SECRET);
console.log("REFRESH_TOKEN_SECRET:", process.env.REFRESH_TOKEN_SECRET);

if (!process.env.JWT_SECRET || !process.env.REFRESH_TOKEN_SECRET) {
  console.error(
    "Missing required environment variables. Please check your .env file."
  );
  process.exit(1);
}

// Create a limiter for all routes
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
});

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173", //  port frontend is running on
    credentials: true,
  })
);
app.use(globalLimiter);
app.use(express.json());

// Create a stricter limiter for login attempts
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 8, // Limit each IP to 8 login requests per windowMs
  message:
    "Too many login attempts from this IP, please try again after 15 minutes.",
});

// Connect to the database
linkDatabase();

// Routes
app.use("/api/visitors", visitorRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/admincheck", adminCheckRoutes); // This handles login
app.use("/api/auth", authRoutes);
app.use("/api/auth/login", loginLimiter);
app.use("/api/auth/superadmin/login", loginLimiter);
app.use("/api/user", userRoutes);
app.use("/api", userRoutes);
// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`\nBackend Created!\nServer is running on port ${port}`);
});
