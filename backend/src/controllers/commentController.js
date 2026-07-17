const store = require("../store");
const { ApiError, asyncHandler } = require("../middlewares/errorHandler");

const getComments = asyncHandler(async (req, res) => {
  const comments = store
    .findComments(req.params.videoId)
    .map((c) => store.populateComment(c));
  res.json({ success: true, data: comments });
});

const addComment = asyncHandler(async (req, res) => {
  const { content } = req.body;
  if (!content?.trim()) throw new ApiError(400, "Comment cannot be empty");

  const video = store.findVideoById(req.params.videoId);
  if (!video) throw new ApiError(404, "Video not found");

  const comment = store.createComment({
    videoId: video.id,
    authorId: req.user.id,
    content: content.trim(),
  });

  store.updateVideo(video.id, { commentsCount: video.commentsCount + 1 });

  res.status(201).json({
    success: true,
    data: store.populateComment(comment),
  });
});

module.exports = { getComments, addComment };
