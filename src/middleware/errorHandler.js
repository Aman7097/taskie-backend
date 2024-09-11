// errorHandler.js

// Custom error response function
const errorResponse = (res, statusCode, message) => {
  res.status(statusCode).json({
    success: false,
    error: message,
  });
};

// Not Found middleware
exports.notFound = (req, res, next) => {
  errorResponse(res, 404, "Resource not found, Hello There");
};

// Global error handling middleware
exports.errorHandler = (err, req, res, next) => {
  console.error(err);

  let statusCode = err.statusCode || 500;
  let message = err.message || "Server Error";

  // Mongoose duplicate key error
  if (err.code === 11000) {
    statusCode = 400;
    message = "Duplicate field value entered";
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((val) => val.message)
      .join(", ");
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token. Please log in again!";
  }
  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Your token has expired! Please log in again.";
  }

  // Send error response
  errorResponse(res, statusCode, message);
};
