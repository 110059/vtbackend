const express = require('express');
const multer = require('multer');
const { handleImageUpload } = require('../controllers/imageController');
const path = require("path");
const fs = require("fs");

const router = express.Router();

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, uploadsDir),
  filename: (_, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const upload = multer({ storage });

// Upload route
router.post('/image', upload.single('image'), handleImageUpload);

// Delete route
router.delete("/delete", (req, res) => {
  const imagePath = req.body.path;
  if (!imagePath) return res.status(400).json({ message: "Image path required" });

  const filename = path.basename(imagePath); // Extract file name safely
  const fullPath = path.join(uploadsDir, filename);

  fs.unlink(fullPath, (err) => {
    if (err) {
      console.error("❌ Failed to delete image:", err);
      return res.status(500).json({ message: "Failed to delete image" });
    }
    res.json({ message: "✅ Image deleted" });
  });
});

module.exports = router;
