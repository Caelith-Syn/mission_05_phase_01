// scripts/seed.js
require("dotenv").config();
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const { connectDB } = require("../config/db");
const Item = require("../models/itemModel");

// This reads the CLI arguments to determine which action to take: import, delete, or status.
const args = process.argv.slice(2);
const hasArg = (flag) => args.includes(flag);

// Path to the seed JSON data file
const dataPath = path.join(__dirname, "..", "data", "seedData.json");

async function importData() {
  const raw = fs.readFileSync(dataPath, "utf8");
  const items = JSON.parse(raw);

  if (!Array.isArray(items) || items.length === 0) {
    throw new Error("seedData.json is empty or invalid.");
  }

  await Item.insertMany(items);
  console.log(`✅ Imported ${items.length} item(s).`);
}

async function deleteData() {
  const result = await Item.deleteMany({});
  console.log(`⚠️  Deleted ${result.deletedCount} item(s).`);
}

async function statusData() {
  const count = await Item.countDocuments();
  const sample = await Item.find({}, { title: 1, start_price: 1, _id: 0 })
    .limit(5)
    .lean();

  console.log(`ℹ️  Items in collection: ${count}`);
  if (count > 0) {
    console.table(sample);
  }
}

(async () => {
  try {
    await connectDB(process.env.MONGODB_URI);

    if (hasArg("--import")) {
      await importData();
      await mongoose.connection.close();
      process.exit(0);
    }

    if (hasArg("--delete")) {
      await deleteData();
      await mongoose.connection.close();
      process.exit(0);
    }

    if (hasArg("--status")) {
      await statusData();
      await mongoose.connection.close();
      process.exit(0);
    }

    console.log(`
Usage:
  node scripts/seed.js --import   # Insert seed data
  node scripts/seed.js --delete   # Remove all items
  node scripts/seed.js --status   # Show count + sample rows
`);
    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error("❌ Seed script error:", err.message);
    await mongoose.connection.close().catch(() => {});
    process.exit(1);
  }
})();
