const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const connectDB = require("./config/db");
const cors = require("cors");

// Route files
const projects = require("./routes/projects");
const notes = require("./routes/notes");
const auth = require("./routes/auth");

// Load env files
dotenv.config({ path: "./config/config.env" });

// Connect to database
connectDB();

// Initialize app
const app = express();

// Cors
app.use(cors());

// Body Parser
app.use(express.json());

// Dev logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Mount router
app.use("/api/v1/projects", projects);
app.use("/api/v1/notes", notes);
app.use("/api/v1/auth", auth);

// Port
const PORT = process.env.PORT || 5000;

// Starting server
const server = app.listen(PORT, console.log(`Server running on port:${PORT}`));

// Handle unhandled promise rejections

process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err}`);
  server.close(() => process.exit(1));
});
