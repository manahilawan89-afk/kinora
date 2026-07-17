const store = require("../store");
const { ApiError, asyncHandler } = require("../middlewares/errorHandler");
const { hashPassword, comparePassword } = require("../utils/password");
const { signAccessToken, signRefreshToken } = require("../utils/tokens");
const { env } = require("../config/env");

const sanitize = (user) => {
  const { password, refreshToken, ...safe } = user;
  return { ...safe, _id: user.id };
};

const setRefreshCookie = (res, token) => {
  res.cookie(env.REFRESH_TOKEN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

const register = asyncHandler(async (req, res) => {
  const { username, email, password, fullName } = req.body;
  if (store.findUser({ email }) || store.findUser({ username })) {
    throw new ApiError(400, "User already exists");
  }

  const user = store.createUser({
    username,
    email,
    password: await hashPassword(password),
    fullName: fullName || username,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
    subscribersCount: 0,
    role: "user",
  });

  const refreshToken = signRefreshToken(user.id);
  store.updateUser(user.id, { refreshToken });

  setRefreshCookie(res, refreshToken);
  res.status(201).json({
    success: true,
    accessToken: signAccessToken(user.id),
    user: sanitize(store.findUserById(user.id)),
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = store.findUser({ email });
  if (!user || !(await comparePassword(password, user.password))) {
    throw new ApiError(401, "Invalid credentials");
  }

  const refreshToken = signRefreshToken(user.id);
  store.updateUser(user.id, { refreshToken });

  setRefreshCookie(res, refreshToken);
  res.json({
    success: true,
    accessToken: signAccessToken(user.id),
    user: sanitize(user),
  });
});

const logout = asyncHandler(async (req, res) => {
  if (req.user) store.updateUser(req.user.id, { refreshToken: "" });
  res.clearCookie(env.REFRESH_TOKEN_COOKIE_NAME);
  res.json({ success: true, message: "Logged out" });
});

const me = asyncHandler(async (req, res) => {
  res.json({ success: true, user: sanitize(req.user) });
});

const updateProfile = asyncHandler(async (req, res) => {
  const { fullName, username, bio, avatar } = req.body;
  const patch = {};

  if (typeof fullName === "string") patch.fullName = fullName.trim();
  if (typeof bio === "string") patch.bio = bio.trim().slice(0, 500);
  if (typeof avatar === "string") patch.avatar = avatar.trim();

  if (typeof username === "string" && username.trim()) {
    const next = username.trim().toLowerCase().replace(/[^a-z0-9_]/g, "");
    if (next.length < 3) throw new ApiError(400, "Username must be at least 3 characters");
    const taken = store.findUser({ username: next });
    if (taken && taken.id !== req.user.id) {
      throw new ApiError(400, "Username already taken");
    }
    patch.username = next;
  }

  const updated = store.updateUser(req.user.id, patch);
  if (!updated) throw new ApiError(404, "User not found");

  res.json({ success: true, user: sanitize(updated) });
});

const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    throw new ApiError(400, "Current and new password are required");
  }
  if (newPassword.length < 6) {
    throw new ApiError(400, "New password must be at least 6 characters");
  }

  const user = store.findUserById(req.user.id);
  if (!user || !(await comparePassword(currentPassword, user.password))) {
    throw new ApiError(401, "Current password is incorrect");
  }

  store.updateUser(user.id, { password: await hashPassword(newPassword) });
  res.json({ success: true, message: "Password updated" });
});

module.exports = { register, login, logout, me, updateProfile, changePassword };
