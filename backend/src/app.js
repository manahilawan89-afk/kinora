const express = require("express");
const path = require("path");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const xssClean = require("xss-clean");
const rateLimit = require("express-rate-limit");

const { env } = require("./config/env");
const { errorHandler, notFound } = require("./middlewares/errorHandler");
const apiRoutes = require("./routes");

function createApp() {
  const app = express();

  app.set("trust proxy", 1);

  app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (
          env.NODE_ENV !== "production" &&
          /^http:\/\/localhost:\d+$/.test(origin)
        ) {
          return callback(null, true);
        }
        let host = "";
        try {
          host = new URL(origin).hostname;
        } catch {
          host = "";
        }
        if (origin === env.CLIENT_ORIGIN || host.endsWith(".vercel.app")) {
          return callback(null, true);
        }
        return callback(new Error("Not allowed by CORS"));
      },
      credentials: true,
    })
  );
  app.use(morgan(env.NODE_ENV === "production" ? "combined" : "dev"));
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(xssClean());

  app.use(
    "/uploads",
    express.static(path.join(__dirname, "../uploads"))
  );

  app.use(
    "/api",
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 500,
      standardHeaders: true,
      legacyHeaders: false,
    })
  );

  app.get("/health", (_req, res) => res.json({ ok: true }));

  app.use("/api", apiRoutes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}

module.exports = { createApp };
