const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, select: false },
    fullName: { type: String, trim: true },
    avatar: { type: String, default: "" },
    banner: { type: String, default: "" },
    bio: { type: String, default: "" },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    isVerified: { type: Boolean, default: false },
    isBanned: { type: Boolean, default: false },
    googleId: { type: String, default: "" },
    refreshToken: { type: String, select: false },
    verificationToken: { type: String, select: false },
    resetPasswordToken: { type: String, select: false },
    resetPasswordExpires: { type: Date },
    subscribersCount: { type: Number, default: 0 },
    settings: {
      darkMode: { type: Boolean, default: false },
      emailNotifications: { type: Boolean, default: true },
    },
    searchHistory: [{ type: String }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
