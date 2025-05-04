const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const Profile = require("../models/Profile");

router.put("/", authMiddleware(["user", "admin", "superadmin"]), async (req, res) => {
  try {
    const userId = req.user.id;
    let { experienceData, companyData, address } = req.body;

    console.log("Received Payload:", req.body);  // Debugging

    // Convert experience data properly
    const experience = experienceData.map(exp => ({
      skills: exp.skills || "",
      years: exp.years || 0,
      months: exp.months || 0,
      version: exp.version || 0,
      lastWorked: exp.lastWorked ? new Date(exp.lastWorked) : null
    }));

    // Convert company details properly
    const companyDetails = companyData.map(company => ({
      companyName: company.companyName || "",
      startDate: company.startDate ? new Date(company.startDate) : null,
      endDate: company.endDate ? new Date(company.endDate) : null,
      isCurrent: company.isCurrent || false
    }));

    // Update or create profile
    const updatedProfile = await Profile.findOneAndUpdate(
      { user: userId },
      { address, experience, companyDetails },
      { new: true, upsert: true, runValidators: true }
    );

    console.log("Updated Profile:", updatedProfile);  // Debugging

    res.json({ message: "Profile updated successfully!", profile: updatedProfile });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get user profile data
router.get("/", authMiddleware(["user", "admin", "superadmin"]), async (req, res) => {
  try {
    const user = req.user.id; // Extract user ID from token
    const profile = await Profile.findOne({ user });

    console.log("Profile not found" );
  
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
