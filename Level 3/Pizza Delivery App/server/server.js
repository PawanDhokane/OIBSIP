const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./configs/db");
const startStockChecker = require('./utils/stockChecker');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

startStockChecker();

const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test route
app.get("/", (req, res) => {
  res.json({ message: "Pizza Delivery API is running" });
});

// Routes 
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/pizza", require("./routes/pizzaRoutes"));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use("/api/inventory", require("./routes/inventoryRoutes"));

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  const statusCode = err.statusCode || 500;
  
  res.status(statusCode).json({ 
    success: false, 
    message: err.message || 'Server Error'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
