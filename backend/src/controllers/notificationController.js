const { asyncHandler } = require("../middlewares/errorHandler");

const getNotifications = asyncHandler(async (_req, res) => {
  res.json({ success: true, data: [] });
});

module.exports = { getNotifications };
