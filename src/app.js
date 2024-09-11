// const express = require("express");
// const cors = require("cors");
// const helmet = require("helmet");
// const morgan = require("morgan");
// const passport = require("passport");
// const path = require("path");

// const authRoutes = require("./routes/authRoutes");
// const taskRoutes = require("./routes/taskRoutes");
// const userRoutes = require("./routes/userRoutes");
// const { notFound, errorHandler } = require("./middleware/errorHandler");

// require("./config/database");
// require("./config/passport")(passport);
// require("dotenv").config();

// const app = express();

// // Middleware
// app.use(cors());
// app.use(helmet());
// app.use(morgan("dev"));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(passport.initialize());

// // Serve static files from the React app
// app.use(express.static(path.join(__dirname, "client/build")));

// // Routes
// app.use("/api/auth", authRoutes);
// app.use("/api/tasks", taskRoutes);
// app.use("/api/users", userRoutes);

// // Error handling
// app.use(notFound);
// app.use(errorHandler);

// // Serve static files for avatars
// app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// // For any other route, send the React app
// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "client/build", "index.html"));
// });

// module.exports = app;

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const passport = require("passport");
const path = require("path");

const authRoutes = require("./routes/authRoutes.js");
const taskRoutes = require("./routes/taskRoutes.js");
const userRoutes = require("./routes/userRoutes.js");
const notFound = require("./middleware/errorHandler").notFound;
const errorHandler = require("./middleware/errorHandler").errorHandler;

const errorHandlerModule = require("./middleware/errorHandler");

require("./config/database");
require("./config/passport")(passport);
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "client/build")));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/users", userRoutes);

// Error handling
if (typeof notFound === "function") {
  app.use(notFound);
} else {
  console.error("notFound is not a function:", notFound);
}

if (typeof errorHandler === "function") {
  app.use(errorHandler);
} else {
  console.error("errorHandler is not a function:", errorHandler);
}

// Serve static files for avatars
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// For any other route, send the React app
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client/build", "index.html"));
});

module.exports = app;
