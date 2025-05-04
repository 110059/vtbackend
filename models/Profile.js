const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true }, // Link to User
  address: { type: String, default: "" },  
  experience: [{
    years: { type: Number, min: 0, default: 0 },
    months: { type: Number, min: 0, default: 0 },
    lastWorked: { type: Date, default: null },
    skills: { type: String, default: "" },
    version: {type:Number, min:0, default: 0}
  }],
  companyDetails: [
    {
      companyName: { type: String, required: true, default: "" },
      startDate: { type: Date, required: true, default: null },
      endDate: { type: Date, default: null },
      isCurrent: { type: Boolean, default: false }
    }
  ]
}, { timestamps: true });

const Profile = mongoose.model("Profile", profileSchema);
module.exports = Profile;
