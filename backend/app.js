const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const path = require("path");

// ✅ STEP 1: Load environment variables
const dotenv = require("dotenv");
dotenv.config({ path: path.join(__dirname, "config/config.env") });

// ✅ DEBUG LOG
console.log("✅ FRONTEND_URL Loaded:", process.env.FRONTEND_URL);

// ✅ STEP 2: CORS CONFIGURATION
app.use(cors({
  origin: process.env.FRONTEND_URL, // ✅ Must be "http://localhost:3000"
  credentials: true,
}));

// ✅ STEP 3: Common Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());

// ✅ STEP 4: API ROUTES
const product = require("./routes/productRoute");
const user = require("./routes/userRoute");
const order = require("./routes/orderRoute");
const payment = require("./routes/paymentRoute");

app.use("/api/v1", product);
app.use("/api/v1", user);
app.use("/api/v1", order);
app.use("/api/v1", payment);

// ✅ STEP 5: Serve frontend in production
if (process.env.NODE_ENV === "PRODUCTION") {
  app.use(express.static(path.join(__dirname, "../frontend/build")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../frontend/build/index.html"));
  });
}

// ✅ STEP 6: Error Middleware
const errorMiddleware = require("./middleware/error");
app.use(errorMiddleware);

module.exports = app;
