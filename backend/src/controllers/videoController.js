const store = require("../store");
const { ApiError, asyncHandler } = require("../middlewares/errorHandler");

const getVideos = asyncHandler(async (req, res) => {
  const search = req.query.q || req.query.search || "";
  const type = req.query.type || "video";
  const videos = store
    .findVideos({ search, type })
    .map((v) => store.populateVideo(v));
  res.json({ success: true, data: videos });
});

const getVideoById = asyncHandler(async (req, res) => {
  const video = store.findVideoById(req.params.id);
  if (!video) throw new ApiError(404, "Video not found");

  const updated = store.updateVideo(video.id, { views: video.views + 1 });
  const populated = store.populateVideo(updated);

  const related = store
    .findVideos({
      search: populated.category,
      type: populated.type === "reel" ? "reel" : "video",
    })
    .filter((v) => v.id !== populated.id)
    .slice(0, 10)
    .map((v) => store.populateVideo(v));

  const liked = req.user
    ? Boolean(store.findLike(req.user.id, populated.id))
    : false;

  res.json({ success: true, data: populated, related, liked });
});

const uploadVideo = asyncHandler(async (req, res) => {
  if (!req.files?.video?.[0]) throw new ApiError(400, "Video file is required");

  const {
    title,
    description = "",
    category = "general",
    tags = "",
    type = "video",
  } = req.body;
  if (!title?.trim()) throw new ApiError(400, "Title is required");

  const videoType = type === "reel" ? "reel" : "video";
  const videoFile = req.files.video[0];
  let thumbnailUrl = "";

  if (req.files.thumbnail?.[0]) {
    thumbnailUrl = `/uploads/${req.files.thumbnail[0].filename}`;
  }

  const video = store.createVideo({
    title: title.trim(),
    description: description.trim(),
    videoUrl: `/uploads/${videoFile.filename}`,
    thumbnailUrl,
    category,
    tags: tags ? tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
    ownerId: req.user.id,
    duration: 0,
    likesCount: 0,
    commentsCount: 0,
    type: videoType,
  });

  res.status(201).json({ success: true, data: store.populateVideo(video) });
});

const toggleLike = asyncHandler(async (req, res) => {
  const video = store.findVideoById(req.params.id);
  if (!video) throw new ApiError(404, "Video not found");

  const liked = store.toggleLike(req.user.id, video.id);
  const likesCount = liked ? video.likesCount + 1 : Math.max(0, video.likesCount - 1);
  store.updateVideo(video.id, { likesCount });

  res.json({ success: true, liked, likesCount });
});

module.exports = { getVideos, getVideoById, uploadVideo, toggleLike };
