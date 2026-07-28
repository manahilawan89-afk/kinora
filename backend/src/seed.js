const store = require("./store");
const { hashPassword } = require("./utils/password");
const { CATALOG_VERSION, buildCatalog } = require("./content/catalog");

async function ensureDemoUser(password) {
  let demo = store.findUser({ email: "demo@youtube.com" });
  if (!demo) {
    demo = store.createUser({
      username: "demouser",
      email: "demo@youtube.com",
      password,
      fullName: "Demo User",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=demo",
      subscribersCount: 4200,
      role: "admin",
      isVerified: false,
    });
  }
  return demo;
}

async function ensureCreators(password, creators) {
  const byUsername = {};
  for (const c of creators) {
    let user = store.findUser({ username: c.username });
    if (!user) {
      user = store.createUser({
        username: c.username,
        email: `${c.username}@kinora.demo`,
        password,
        fullName: c.fullName,
        bio: c.bio || "",
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${c.username}`,
        subscribersCount: c.subs || 10000,
        role: "user",
        isVerified: Boolean(c.verified),
      });
    } else {
      user = store.updateUser(user.id, {
        fullName: c.fullName,
        bio: c.bio || user.bio || "",
        subscribersCount: c.subs || user.subscribersCount || 0,
        isVerified: Boolean(c.verified),
        avatar: user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${c.username}`,
      });
    }
    byUsername[c.username] = user;
  }
  return byUsername;
}

async function seedDatabase() {
  const password = await hashPassword("password123");
  const demo = await ensureDemoUser(password);
  const catalog = buildCatalog();
  const meta = store.getMeta();

  if (meta.catalogVersion !== CATALOG_VERSION) {
    console.log(`Seeding Kinora catalog v${CATALOG_VERSION} (${catalog.videos.length} items)...`);
    const creators = await ensureCreators(password, catalog.creators);

    const rows = catalog.videos.map((item) => {
      const owner = creators[item.creatorUsername];
      if (!owner) throw new Error(`Missing creator: ${item.creatorUsername}`);
      const { creatorUsername, ...rest } = item;
      return {
        ...rest,
        ownerId: owner.id,
        isPublic: true,
      };
    });

    store.replaceCatalogVideos(rows);
    store.setMeta({ catalogVersion: CATALOG_VERSION, catalogCount: rows.length });
    console.log(`✅ Catalog ready: ${rows.filter((v) => v.type !== "reel").length} videos, ${rows.filter((v) => v.type === "reel").length} reels`);
  } else {
    console.log(`Catalog v${CATALOG_VERSION} already loaded`);
  }

  const demoPlaylists = store.findPlaylistsByOwner(demo.id);
  if (demoPlaylists.length === 0) {
    const vids = store
      .findVideos({ type: "video" })
      .sort((a, b) => b.views - a.views)
      .slice(0, 5)
      .map((v) => v.id);
    store.createPlaylist({
      title: "Watch later favorites",
      description: "My starter Kinora playlist",
      ownerId: demo.id,
      isPublic: true,
      videoIds: vids,
    });
  } else {
    const top = store
      .findVideos({ type: "video" })
      .sort((a, b) => b.views - a.views)
      .slice(0, 5)
      .map((v) => v.id);
    store.updatePlaylist(demoPlaylists[0].id, { videoIds: top });
  }

  console.log("✅ Kinora database ready");
  console.log("   Login: demo@youtube.com / password123");
}

module.exports = { seedDatabase, CATALOG_VERSION };
