const jwt = require("jsonwebtoken");
const { env } = require("../config/env");
const store = require("../store");
const { ApiError, asyncHandler } = require("./errorHandler");

const protect = asyncHandler(async (req, _res, next) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;
  if (!token) throw new ApiError(401, "Not authorized");

  const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET);
  const user = store.findUserById(decoded.id);
  if (!user) throw new ApiError(401, "User not found");
  if (user.isBanned) throw new ApiError(403, "Account banned");

  req.user = user;
  next();
});

const optionalAuth = asyncHandler(async (req, _res, next) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

  if (token) {
    try {
      const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET);
      const user = store.findUserById(decoded.id);
      if (user && !user.isBanned) req.user = user;
    } catch {
      // ignore
    }
  }
  next();
});

const authorize = (...roles) => (req, _res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return next(new ApiError(403, "Forbidden"));
  }
  next();
};

module.exports = { protect, authorize, optionalAuth };
