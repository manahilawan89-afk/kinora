const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    videoUrl: { type: String, required: true },
    thumbnailUrl: { type: String, default: "" },
    duration: { type: Number, default: 0 },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    category: { type: String, default: "general" },
    tags: [{ type: String }],
    views: { type: Number, default: 0 },
    likesCount: { type: Number, default: 0 },
    dislikesCount: { type: Number, default: 0 },
    commentsCount: { type: Number, default: 0 },
    isPublic: { type: Boolean, default: true },
    allowDownload: { type: Boolean, default: false },
    pinnedComment: { type: mongoose.Schema.Types.ObjectId, ref: "Comment", default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Video", videoSchema);
