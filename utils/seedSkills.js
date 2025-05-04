const fs = require("fs").promises;
const Skill = require("../models/Skill");
const Category = require("../models/Category");

async function seedSkills() {
  try {
    // Check if categories already exist
    const existingCategories = await Category.countDocuments();
    if (existingCategories === 0) {
      const categoriesData = await fs.readFile(`${__dirname}/../data/skillsCategories.json`, "utf8");
      const categories = JSON.parse(categoriesData);
      await Category.insertMany(categories);
      console.log("✅ Categories inserted successfully.");
    } else {
      console.log("ℹ️ Categories already exist. Skipping insertion.");
    }

    // Check if skills already exist
    const skillCount = await Skill.countDocuments();
    if (skillCount > 0) {
      console.log("ℹ️ Skills already exist. Skipping insertion.");
      return;
    }

    const skillFile = await fs.readFile(`${__dirname}/../data/skillsData.json`, "utf8");
    const skillData = JSON.parse(skillFile);

    const skillsToInsert = [];

    skillData.skills.forEach(categoryObj => {
      categoryObj.skills.forEach(skill => {
        skillsToInsert.push({
          category: categoryObj.category,
          name: skill.name,
          version: skill.version || "",
        });
      });
    });

    await Skill.insertMany(skillsToInsert);
    console.log("✅ Skills inserted successfully.");
  } catch (err) {
    console.error("❌ Skill seeding error:", err);
  }
}

module.exports = seedSkills;
