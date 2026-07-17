const { body } = require("express-validator");
const {
  register,
  login,
  logout,
  me,
  updateProfile,
  changePassword,
} = require("../controllers/authController");
const {
  getVideos,
  getVideoById,
  uploadVideo,
  toggleLike,
} = require("../controllers/videoController");
const { getChannel } = require("../controllers/channelController");
const { getComments, addComment } = require("../controllers/commentController");
const {
  getPlaylists,
  getPlaylistById,
  createPlaylist,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  deletePlaylist,
} = require("../controllers/playlistController");
const { getNotifications } = require("../controllers/notificationController");
const { getDashboard } = require("../controllers/adminController");
const { protect, authorize, optionalAuth } = require("../middlewares/auth");
const { validate } = require("../middlewares/validate");
const { upload } = require("../middlewares/upload");

const router = require("express").Router();

// Auth
router.post(
  "/auth/register",
  [
    body("username").notEmpty().withMessage("Username required"),
    body("email").isEmail().withMessage("Valid email required"),
    body("password").isLength({ min: 6 }).withMessage("Password min 6 chars"),
    validate,
  ],
  register
);
router.post(
  "/auth/login",
  [body("email").isEmail(), body("password").notEmpty(), validate],
  login
);
router.post("/auth/logout", protect, logout);
router.get("/auth/me", protect, me);
router.patch("/auth/profile", protect, updateProfile);
router.patch(
  "/auth/password",
  protect,
  [
    body("currentPassword").notEmpty().withMessage("Current password required"),
    body("newPassword").isLength({ min: 6 }).withMessage("New password min 6 chars"),
    validate,
  ],
  changePassword
);

// Videos & Reels
router.get("/videos", getVideos);
router.get("/videos/:id", optionalAuth, getVideoById);
router.post(
  "/videos",
  protect,
  upload.fields([
    { name: "video", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  [
    body("title").notEmpty().withMessage("Title required"),
    validate,
  ],
  uploadVideo
);
router.post("/videos/:id/like", protect, toggleLike);

// Channel
router.get("/channels/:username", getChannel);

// Comments
router.get("/videos/:videoId/comments", getComments);
router.post(
  "/videos/:videoId/comments",
  protect,
  [body("content").notEmpty().withMessage("Comment required"), validate],
  addComment
);

// Playlists
router.get("/playlists/me", protect, getPlaylists);
router.post(
  "/playlists",
  protect,
  [body("title").notEmpty().withMessage("Title required"), validate],
  createPlaylist
);
router.get("/playlists/:id", optionalAuth, getPlaylistById);
router.post("/playlists/:id/videos", protect, addVideoToPlaylist);
router.delete("/playlists/:id/videos/:videoId", protect, removeVideoFromPlaylist);
router.delete("/playlists/:id", protect, deletePlaylist);

// Notifications
router.get("/notifications", protect, getNotifications);

// Admin
router.get("/admin/dashboard", protect, authorize("admin"), getDashboard);

module.exports = router;
