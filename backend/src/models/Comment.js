const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    video: { type: mongoose.Schema.Types.ObjectId, ref: "Video", required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
    likesCount: { type: Number, default: 0 },
    isPinned: { type: Boolean, default: false },
    parentComment: { type: mongoose.Schema.Types.ObjectId, ref: "Comment", default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Comment", commentSchema);
