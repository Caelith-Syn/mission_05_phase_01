const mongoose = require("mongoose"); // Import mongoose

// Function to connect to MongoDB

async function connectDB(uri) {
  // uri is an abbreviation for Uniform Resource Identifier
  if (!uri) throw new Error("MONGODB_URI is missing");
  // Mongoose 7+ sensible defaults
  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 5000,
  });
  return mongoose.connection;
}

module.exports = { connectDB }; // Export the connectDB function

// This file sets up my MongoDB connection using Mongoose with sensible defaults for version 7 and above.
// It exports a function to connect to the database, which is used in server.js.
