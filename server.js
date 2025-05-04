const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const authRoutes = require("./routes/authRoute");
const userRoute = require("./routes/userRoute");
const profileRoute = require("./routes/profileRoute");
const skillRoute = require("./routes/skillRoute");
const categoryRoute = require("./routes/categoryRoute");
const resumeRoute = require("./routes/resumeRoute");
const faceHugRoute = require("./routes/faceHugRoute");

const path = require("path");
const cors = require("cors");
const uploadRoute = require("./routes/uploadRoute");
const seedSuperAdmin = require("./utils/seedSuperAdmin");
const seedSkills = require("./utils/seedSkills");

// Load environment variables
dotenv.config();

// Initialize the express app
const app = express();

// Use CORS middleware
app.use(
  cors({
    origin: process.env.UI_WEB_URL, // Allow requests only from this origin (your frontend URL)
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"], // Allow only these methods (can be adjusted as needed)
    credentials: true, // Enable cookies if needed
  })
);

app.use(express.urlencoded({ extended: true })); // Important for form data
// Middleware to parse incoming JSON requests
app.use(express.json());

app.use("/faces", express.static(path.join(__dirname, "faces")));
app.use("/images", express.static(path.join(__dirname, "uploads")));

// Connect to MongoDB (replace with your MongoDB URI in .env)
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .then(async () => {
    await seedSuperAdmin();
    await seedSkills();
  })
  .catch((err) => console.error("Error connecting to MongoDB", err));

// define routes
app.use("/auth", authRoutes);
app.use("/users", userRoute);
app.use("/profile", profileRoute);
app.use("/skills", skillRoute);
app.use("/categories", categoryRoute);
app.use("/resume", resumeRoute);
app.use("/upload", uploadRoute);
app.use("/facehug", faceHugRoute);


app.get("/test", (req, res) => {
  res.json({ message: "Hello, this is a test API!" });
});

// Start the server
const port = process.env.PORT || 8081;
app.listen(port, () => {
  console.log(`Server is running on ${process.env.API_URL}`);
});