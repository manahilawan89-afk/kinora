const store = require("../store");
const { ApiError, asyncHandler } = require("../middlewares/errorHandler");

const getPlaylists = asyncHandler(async (req, res) => {
  const playlists = store
    .findPlaylistsByOwner(req.user.id)
    .map((p) => store.populatePlaylist(p));
  res.json({ success: true, data: playlists });
});

const getPlaylistById = asyncHandler(async (req, res) => {
  const playlist = store.findPlaylistById(req.params.id);
  if (!playlist) throw new ApiError(404, "Playlist not found");

  if (!playlist.isPublic && playlist.ownerId !== req.user?.id) {
    throw new ApiError(403, "This playlist is private");
  }

  res.json({ success: true, data: store.populatePlaylist(playlist) });
});

const createPlaylist = asyncHandler(async (req, res) => {
  const { title, description = "", isPublic = true } = req.body;
  if (!title?.trim()) throw new ApiError(400, "Title is required");

  const playlist = store.createPlaylist({
    title: title.trim(),
    description: description.trim(),
    isPublic: Boolean(isPublic),
    ownerId: req.user.id,
    videoIds: [],
  });

  res.status(201).json({ success: true, data: store.populatePlaylist(playlist) });
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
  const playlist = store.findPlaylistById(req.params.id);
  if (!playlist) throw new ApiError(404, "Playlist not found");
  if (playlist.ownerId !== req.user.id) throw new ApiError(403, "Not your playlist");

  const { videoId } = req.body;
  if (!videoId) throw new ApiError(400, "videoId is required");

  const video = store.findVideoById(videoId);
  if (!video) throw new ApiError(404, "Video not found");

  const videoIds = playlist.videoIds || [];
  if (videoIds.includes(videoId)) {
    return res.json({
      success: true,
      data: store.populatePlaylist(playlist),
      message: "Already in playlist",
    });
  }

  const updated = store.updatePlaylist(playlist.id, {
    videoIds: [...videoIds, videoId],
  });

  res.json({ success: true, data: store.populatePlaylist(updated) });
});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
  const playlist = store.findPlaylistById(req.params.id);
  if (!playlist) throw new ApiError(404, "Playlist not found");
  if (playlist.ownerId !== req.user.id) throw new ApiError(403, "Not your playlist");

  const videoIds = (playlist.videoIds || []).filter((id) => id !== req.params.videoId);
  const updated = store.updatePlaylist(playlist.id, { videoIds });

  res.json({ success: true, data: store.populatePlaylist(updated) });
});

const deletePlaylist = asyncHandler(async (req, res) => {
  const playlist = store.findPlaylistById(req.params.id);
  if (!playlist) throw new ApiError(404, "Playlist not found");
  if (playlist.ownerId !== req.user.id) throw new ApiError(403, "Not your playlist");

  store.deletePlaylist(playlist.id);
  res.json({ success: true, message: "Playlist deleted" });
});

module.exports = {
  getPlaylists,
  getPlaylistById,
  createPlaylist,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  deletePlaylist,
};
