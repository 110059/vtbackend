const express = require("express");
const multer = require("multer");
const { extractTextFromDocx, extractTextFromPDF } = require("../utils/resumeParser");
const Skill = require("../models/Skill");

const router = express.Router();
const upload = multer({ limits: { fileSize: 5 * 1024 * 1024 } }); // 5MB limit

// POST /resume/parse
router.post("/parse", upload.single("resume"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No resume file uploaded." });
    }

    const { originalname, buffer } = req.file;
    let extractedText = "";

    if (originalname.endsWith(".docx")) {
      extractedText = await extractTextFromDocx(buffer);
    } else if (originalname.endsWith(".pdf")) {
      extractedText = await extractTextFromPDF(buffer);
    } else {
      return res.status(400).json({ message: "Unsupported file type. Please upload a PDF or DOCX." });
    }

    // Fetch skills dynamically from DB
    const allSkills = await Skill.find({});
    const skillList = allSkills.map(skill => skill.name.toLowerCase());

    // Basic keyword-based matcher (can be replaced with NLP/TensorFlow later)
    const detectedSkills = skillList.filter(skill =>
      new RegExp(`\\b${skill.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}\\b`, "i").test(extractedText)
    );

    res.json({ skills: detectedSkills });
  } catch (err) {
    console.error("Resume parsing error:", err);
    res.status(500).json({ message: "Error processing resume" });
  }
});

module.exports = router;


