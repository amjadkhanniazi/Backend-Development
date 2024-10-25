const rateLimit = require("express-rate-limit");

// Define the rate limit rule
const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 min
  max: 20, // Limit each IP to 3 requests per windowMs
  message: "Too many requests, please try again later.",
  headers: true, // Include rate limit info in headers
});

module.exports = apiLimiter;