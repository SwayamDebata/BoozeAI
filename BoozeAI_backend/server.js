const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/dbConnection");
const errorHandler = require("./middleware/errorHandler");
const admin = require("firebase-admin");

dotenv.config();

const serviceAccount = require("./config/firebaseServiceAccount.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const app = express();
app.get('/', (req,res)=> res.status(200).json({message: "we really cook"}))

// Middleware
app.use(express.json({ limit: "10mb" })); 
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(cookieParser());

// Connect Database
connectDB();

// Routes
app.use("/api/auth", require("./routes/authRouter"));
app.use("/api/drinks", require("./routes/drinksRouter"));

// Global Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🔥 Server running on port ${PORT}`));
