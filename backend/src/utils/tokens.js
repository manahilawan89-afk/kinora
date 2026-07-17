const jwt = require("jsonwebtoken");
const { env } = require("../config/env");

const signAccessToken = (userId) =>
  jwt.sign({ id: userId }, env.JWT_ACCESS_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRES_IN,
  });

const signRefreshToken = (userId) =>
  jwt.sign({ id: userId }, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN,
  });

module.exports = { signAccessToken, signRefreshToken };
