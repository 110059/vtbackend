const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const fs = require("fs");
const path = require("path");


router.post("/register", async (req, res) => {
  try {
    const { name, username, email, password, role, phone, faceImage } = req.body;

    // Validate required fields
    if (!name || !username || !email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: "Username or Email already taken." });
    }


    //save face image
    if (faceImage) {
      const base64Data = faceImage.replace(/^data:image\/jpeg;base64,/, "");
      const imagePath = path.join(__dirname, `../faces/${username}.jpg`);
      fs.writeFileSync(imagePath, base64Data, "base64");
    }
    

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      name,
      username,
      email,
      phone: phone || undefined,
      password: hashedPassword,
      role: role || "user",
    });

    console.log("user", newUser);

    await newUser.save();
    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    console.error(error);
    if(error.code === 11000) {
      res.status(400).json({ message: "Phone number already used by some user." });
    }
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    console.log(`Login attempt for user: ${username}`);

    const user = await User.findOne({ username });
    if (!user) {
      console.error("User not found");
      return res.status(400).json({ message: "User not found" });
    }

    if (!user.isActive) {
      console.error("User not active");
      return res.status(400).json({ message: "User is not active right now, please wait / contact admin for activation." });
    }

    console.log(user);

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.error("Invalid credentials");
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "30m" }
    );

    console.log(`Login successful for ${username}, Role: ${user.role}`);
    res.json({ token, role: user.role, isActive: user.isActive });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/users/change-password
router.post( "/change-password", authMiddleware(["user", "admin", "superadmin"]),async (req, res) => {

  console.log('request',req.body);
  console.log('hesaaders',req.headers);

    try {
      const { oldPassword, newPassword } = req.body;



      if (!oldPassword || !newPassword) {
        return res.status(400).json({ message: "Old and new password are required." });
      }

      // Get user ID from the decoded JWT token
      const userId = req.user.id;

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }

      // Compare old password
      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Old password is incorrect." });
      }

      // Hash new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      // Update user's password
      user.password = hashedPassword;
      await user.save();

      return res.json({ message: "Password changed successfully!" });
    } catch (error) {
      console.error("Error changing password:", error);
      res.status(500).json({ message: "Server error. Please try again later." });
    }
  }
);


module.exports = router;