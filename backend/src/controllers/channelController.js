const store = require("../store");
const { ApiError, asyncHandler } = require("../middlewares/errorHandler");

const getChannel = asyncHandler(async (req, res) => {
  const user = store.findUser({ username: req.params.username });
  if (!user) throw new ApiError(404, "Channel not found");

  const { password, refreshToken, ...safe } = user;
  const videos = store
    .findVideos({ ownerId: user.id })
    .map((v) => store.populateVideo(v));

  res.json({
    success: true,
    data: { user: { ...safe, _id: user.id }, videos },
  });
});

module.exports = { getChannel };
