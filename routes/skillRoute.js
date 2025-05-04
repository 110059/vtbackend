const express = require("express");
const router = express.Router();
const Skill = require("../models/Skill");

// Add multiple skills
router.post("/", async (req, res) => {
  try {
    const skills = await Skill.insertMany(req.body.skills);
    res.json({ message: "Skills added successfully!", skills });
  } catch (error) {
    res.status(500).json({ message: "Error adding skills", error: error.message });
  }
});

// Get all skills
router.get("/", async (req, res) => {
  try {
    const skills = await Skill.find();
    res.json(skills);
  } catch (error) {
    res.status(500).json({ message: "Error fetching skills", error: error.message });
  }
});

module.exports = router;
