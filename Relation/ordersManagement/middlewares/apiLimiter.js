import rateLimit from "express-rate-limit";

// Define the rate limit rule
const apiLimiter = rateLimit({
  windowMs: 20 * 1000, // 20 seconds
  max: 3, // Limit each IP to 3 requests per windowMs
  message: "Too many requests, please try again later.",
  headers: true, // Include rate limit info in headers
});

export default apiLimiter;