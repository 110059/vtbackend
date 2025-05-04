const mongoose = require("mongoose");

const skillSchema = new mongoose.Schema({
  category: { type: String, required: true },
  name: { type: String, required: true },
  version: { type: String, required: false },
});

module.exports = mongoose.model("Skill", skillSchema);
