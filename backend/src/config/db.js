const mongoose = require("mongoose");

let memoryServer = null;

async function connectDB(uri) {
  mongoose.set("strictQuery", true);

  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 3000 });
    console.log("MongoDB connected");
    return;
  } catch {
    if (process.env.NODE_ENV === "production") {
      throw new Error("MongoDB connection failed. Set MONGODB_URI in .env");
    }
  }

  try {
    const { MongoMemoryServer } = require("mongodb-memory-server");
    console.log("Local MongoDB not found — starting in-memory database...");
    memoryServer = await MongoMemoryServer.create();
    await mongoose.connect(memoryServer.getUri());
    console.log("In-memory MongoDB ready (data resets on restart)");
  } catch (err) {
    console.error("\n❌ Could not start database.");
    console.error("Install MongoDB: https://www.mongodb.com/try/download/community\n");
    throw err;
  }
}

module.exports = { connectDB };
