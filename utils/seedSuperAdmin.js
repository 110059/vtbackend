const bcrypt = require("bcryptjs");
const User = require("../models/User");

async function seedSuperAdmin() {
  try {
    const existingAdmin = await User.findOne({ role: "superadmin" });

    if (existingAdmin) {
      console.log("✅ SuperAdmin already exists. Skipping seed.");
      return;
    }

    const {
      SUPERADMIN_EMAIL,
      SUPERADMIN_PASSWORD,
      SUPERADMIN_USERNAME = "superadmin",
    } = process.env;

    if (!SUPERADMIN_EMAIL || !SUPERADMIN_PASSWORD) {
      console.warn("⚠️ SuperAdmin credentials missing in environment.");
      return;
    }

    const hashedPassword = await bcrypt.hash(SUPERADMIN_PASSWORD, 10);

    await User.create({
      name: "Super Admin",
      username: SUPERADMIN_USERNAME,
      email: SUPERADMIN_EMAIL,
      password: hashedPassword,
      role: "superadmin",
      isActive: true,
    });

    console.log("🚀 SuperAdmin user seeded successfully.");
  } catch (err) {
    console.error("❌ Failed to seed SuperAdmin:", err);
  }
}

module.exports = seedSuperAdmin;
