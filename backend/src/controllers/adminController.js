const store = require("../store");
const { asyncHandler } = require("../middlewares/errorHandler");

const getDashboard = asyncHandler(async (_req, res) => {
  const users = store.findUsers().length;
  const videos = store.findVideos().length;
  res.json({ success: true, data: { users, videos, reports: 0 } });
});

module.exports = { getDashboard };
