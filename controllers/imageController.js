const path = require("path");
const imageService = require("../services/imageService");

const handleImageUpload = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    const predictions = await imageService.processImage(req.file.path);

    // Serve images from /images route and strip 'uploads' folder
    const imagePath = req.file.path.replace(/\\/g, "/").replace("uploads/", "images/");

    res.json({
      success: true,
      predictions,
      imagePath,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Image processing failed" });
  }
};

module.exports = { handleImageUpload };
