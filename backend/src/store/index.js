const fs = require("fs");
const path = require("path");
const { randomUUID } = require("crypto");

const SEED_PATH = path.join(__dirname, "database.json");
// Serverless filesystems (e.g. Vercel) are read-only except for /tmp, so keep
// the writable copy there and initialise it from the bundled seed on cold start.
const DB_PATH = process.env.VERCEL ? path.join("/tmp", "database.json") : SEED_PATH;

const DEFAULT_DB = {
  users: [],
  videos: [],
  comments: [],
  likes: [],
  playlists: [],
  meta: {},
};

function read() {
  if (!fs.existsSync(DB_PATH)) {
    if (DB_PATH !== SEED_PATH && fs.existsSync(SEED_PATH)) {
      const seeded = JSON.parse(fs.readFileSync(SEED_PATH, "utf-8"));
      write(seeded);
      return seeded;
    }
    write(DEFAULT_DB);
    return structuredClone(DEFAULT_DB);
  }
  const data = JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));
  for (const key of Object.keys(DEFAULT_DB)) {
    if (key === "meta") {
      if (!data.meta || typeof data.meta !== "object") data.meta = {};
    } else if (!Array.isArray(data[key])) {
      data[key] = [];
    }
  }
  return data;
}

function write(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

function withId(doc) {
  return { ...doc, _id: doc.id };
}

const store = {
  findUsers(query = {}) {
    return read().users.filter((u) =>
      Object.entries(query).every(([k, v]) => u[k] === v)
    );
  },

  findUser(query) {
    return this.findUsers(query)[0] || null;
  },

  findUserById(id) {
    return read().users.find((u) => u.id === id) || null;
  },

  createUser(data) {
    const db = read();
    const user = { id: randomUUID(), ...data, createdAt: new Date().toISOString() };
    db.users.push(user);
    write(db);
    return withId(user);
  },

  updateUser(id, patch) {
    const db = read();
    const idx = db.users.findIndex((u) => u.id === id);
    if (idx === -1) return null;
    db.users[idx] = { ...db.users[idx], ...patch };
    write(db);
    return withId(db.users[idx]);
  },

  findVideos({ search = "", ownerId = null, type = null } = {}) {
    let videos = read().videos;
    if (ownerId) videos = videos.filter((v) => v.ownerId === ownerId);
    if (type === "reel") {
      videos = videos.filter((v) => v.type === "reel");
    } else if (type === "video") {
      videos = videos.filter((v) => v.type !== "reel");
    }
    if (search) {
      const q = search.toLowerCase();
      videos = videos.filter(
        (v) =>
          v.title.toLowerCase().includes(q) ||
          (v.description || "").toLowerCase().includes(q) ||
          v.category?.toLowerCase().includes(q) ||
          v.tags?.some((t) => t.toLowerCase().includes(q))
      );
    }
    return videos
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .map(withId);
  },

  findVideoById(id) {
    const video = read().videos.find((v) => v.id === id);
    return video ? withId(video) : null;
  },

  createVideo(data) {
    const db = read();
    const video = {
      id: randomUUID(),
      views: 0,
      likesCount: 0,
      commentsCount: 0,
      isPublic: true,
      type: "video",
      createdAt: new Date().toISOString(),
      ...data,
    };
    db.videos.push(video);
    write(db);
    return withId(video);
  },

  updateVideo(id, patch) {
    const db = read();
    const idx = db.videos.findIndex((v) => v.id === id);
    if (idx === -1) return null;
    db.videos[idx] = { ...db.videos[idx], ...patch };
    write(db);
    return withId(db.videos[idx]);
  },

  findComments(videoId) {
    return read()
      .comments.filter((c) => c.videoId === videoId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .map(withId);
  },

  createComment(data) {
    const db = read();
    const comment = { id: randomUUID(), createdAt: new Date().toISOString(), ...data };
    db.comments.push(comment);
    write(db);
    return withId(comment);
  },

  findLike(userId, videoId) {
    return read().likes.find((l) => l.userId === userId && l.videoId === videoId) || null;
  },

  toggleLike(userId, videoId) {
    const db = read();
    const idx = db.likes.findIndex((l) => l.userId === userId && l.videoId === videoId);
    if (idx >= 0) {
      db.likes.splice(idx, 1);
      write(db);
      return false;
    }
    db.likes.push({ userId, videoId });
    write(db);
    return true;
  },

  findPlaylistsByOwner(ownerId) {
    return read()
      .playlists.filter((p) => p.ownerId === ownerId)
      .sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt))
      .map(withId);
  },

  findPlaylistById(id) {
    const playlist = read().playlists.find((p) => p.id === id);
    return playlist ? withId(playlist) : null;
  },

  createPlaylist(data) {
    const db = read();
    const now = new Date().toISOString();
    const playlist = {
      id: randomUUID(),
      videoIds: [],
      isPublic: true,
      createdAt: now,
      updatedAt: now,
      ...data,
    };
    db.playlists.push(playlist);
    write(db);
    return withId(playlist);
  },

  updatePlaylist(id, patch) {
    const db = read();
    const idx = db.playlists.findIndex((p) => p.id === id);
    if (idx === -1) return null;
    db.playlists[idx] = {
      ...db.playlists[idx],
      ...patch,
      updatedAt: new Date().toISOString(),
    };
    write(db);
    return withId(db.playlists[idx]);
  },

  deletePlaylist(id) {
    const db = read();
    const before = db.playlists.length;
    db.playlists = db.playlists.filter((p) => p.id !== id);
    write(db);
    return db.playlists.length < before;
  },

  populatePlaylist(playlist) {
    const owner = this.findUserById(playlist.ownerId);
    const videos = (playlist.videoIds || [])
      .map((vid) => this.findVideoById(vid))
      .filter(Boolean)
      .map((v) => this.populateVideo(v));

    return {
      ...playlist,
      owner: owner
        ? withId({ ...owner, password: undefined, refreshToken: undefined })
        : null,
      videos,
      videoCount: videos.length,
    };
  },

  populateVideo(video) {
    const owner = this.findUserById(video.ownerId);
    let videoUrl = video.videoUrl || "";
    if (
      videoUrl.includes("gtv-videos-bucket") ||
      videoUrl.includes("download.blender.org") ||
      videoUrl.includes("commondatastorage.googleapis.com/gtv-videos-bucket")
    ) {
      const pool = [
        "https://www.w3schools.com/html/mov_bbb.mp4",
        "https://www.w3schools.com/html/movie.mp4",
        "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
        "https://samplelib.com/lib/preview/mp4/sample-10s.mp4",
        "https://samplelib.com/lib/preview/mp4/sample-15s.mp4",
        "https://samplelib.com/lib/preview/mp4/sample-30s.mp4",
      ];
      let hash = 0;
      const key = video.id || videoUrl;
      for (let i = 0; i < key.length; i += 1) hash = (hash + key.charCodeAt(i) * (i + 1)) % pool.length;
      videoUrl = pool[hash];
    }
    return {
      ...video,
      videoUrl,
      owner: owner
        ? withId({
            ...owner,
            password: undefined,
            refreshToken: undefined,
          })
        : null,
    };
  },

  populateComment(comment) {
    const author = this.findUserById(comment.authorId);
    return {
      ...comment,
      author: author ? withId({ ...author, password: undefined }) : null,
    };
  },

  getMeta() {
    return { ...(read().meta || {}) };
  },

  setMeta(patch) {
    const db = read();
    db.meta = { ...(db.meta || {}), ...patch };
    write(db);
    return db.meta;
  },

  replaceCatalogVideos(videos) {
    const db = read();
    const next = videos.map((v) => ({
      id: randomUUID(),
      views: 0,
      likesCount: 0,
      commentsCount: 0,
      isPublic: true,
      type: "video",
      createdAt: new Date().toISOString(),
      ...v,
    }));
    // Full catalog replace — drop old placeholders / duplicates
    db.videos = next;
    db.comments = [];
    db.likes = [];
    write(db);
    return next.length;
  },

  removeCatalogUsers(usernames) {
    const db = read();
    const set = new Set(usernames);
    db.users = db.users.filter((u) => !set.has(u.username));
    write(db);
  },

  purgeUsersAndVideosByUsername(usernames = []) {
    const db = read();
    const set = new Set(usernames.map((u) => String(u).toLowerCase()));
    const blockedIds = new Set(
      db.users
        .filter(
          (u) =>
            set.has(String(u.username || "").toLowerCase()) ||
            String(u.fullName || "").toLowerCase().includes("ducky")
        )
        .map((u) => u.id)
    );
    db.users = db.users.filter((u) => !blockedIds.has(u.id));
    db.videos = db.videos.filter(
      (v) =>
        !blockedIds.has(v.ownerId) &&
        !String(v.title || "").toLowerCase().includes("ducky")
    );
    write(db);
    return blockedIds.size;
  },
};

module.exports = store;
