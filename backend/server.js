const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const imageRoutes = require("./routes");

const app = express();

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || origin === "http://localhost:5173" || origin.endsWith(".vercel.app")) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET","POST","PUT","DELETE"],
  allowedHeaders: ["Content-Type","Authorization"],
  credentials: true
}));


app.use(express.json());

app.use("/api/image", imageRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
