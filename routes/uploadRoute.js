const express = require('express');
const multer = require('multer');
const { handleImageUpload } = require('../controllers/imageController');
const path = require("path");
const fs = require("fs");

const router = express.Router();
const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, 'uploads/'),
  filename: (_, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const upload = multer({ storage });

router.post('/image', upload.single('image'), handleImageUpload);

router.delete("/delete", (req, res) => {
    const imagePath = req.body.path;
    if (!imagePath) return res.status(400).json({ message: "Image path required" });
  
    const fullPath = path.join(__dirname, "../uploads", path.basename(imagePath));
    fs.unlink(fullPath, (err) => {
      if (err) {
        console.error("Failed to delete image:", err);
        return res.status(500).json({ message: "Failed to delete image" });
      }
      res.json({ message: "Image deleted" });
    });
  });

module.exports = router;
