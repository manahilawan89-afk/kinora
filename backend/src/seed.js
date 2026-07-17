const store = require("./store");
const { hashPassword } = require("./utils/password");

const SAMPLE_VIDEOS = [
  {
    title: "Big Buck Bunny",
    description: "Open source animated short film about a giant rabbit.",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    thumbnailUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg",
    duration: 596,
    views: 1250000,
    likesCount: 45000,
    category: "Animation",
    tags: ["animation", "short film"],
    type: "video",
  },
  {
    title: "Elephants Dream",
    description: "The world's first open movie made with open source software.",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    thumbnailUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ElephantsDream.jpg",
    duration: 653,
    views: 890000,
    likesCount: 32000,
    category: "Animation",
    tags: ["animation", "open source"],
    type: "video",
  },
  {
    title: "For Bigger Blazes",
    description: "Chromecast demo video with stunning visuals.",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    thumbnailUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerBlazes.jpg",
    duration: 15,
    views: 450000,
    likesCount: 12000,
    category: "Tech",
    tags: ["demo", "tech"],
    type: "video",
  },
  {
    title: "Sintel",
    description: "A fantasy short film about a girl and her dragon.",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    thumbnailUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/Sintel.jpg",
    duration: 888,
    views: 2100000,
    likesCount: 98000,
    category: "Animation",
    tags: ["fantasy", "dragon"],
    type: "video",
  },
  {
    title: "Tears of Steel",
    description: "Sci-fi short with incredible visual effects.",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    thumbnailUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/TearsOfSteel.jpg",
    duration: 734,
    views: 1560000,
    likesCount: 67000,
    category: "Sci-Fi",
    tags: ["sci-fi", "vfx"],
    type: "video",
  },
  {
    title: "For Bigger Escape",
    description: "Action-packed cinematic demo clip.",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    thumbnailUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerEscapes.jpg",
    duration: 15,
    views: 320000,
    likesCount: 8500,
    category: "Entertainment",
    tags: ["action", "demo"],
    type: "video",
  },
];

const DORAEMON_EPISODES = [
  {
    title: "Doraemon — Princess Shizuka & Prince Nobita (Hindi)",
    description:
      "Full Doraemon episode in Hindi: Princess Shizuka and Prince Nobita. Classic gadget fun on Kinora.",
    videoUrl: "https://www.youtube.com/watch?v=l0PmgTcxlGs",
    thumbnailUrl: "https://i.ytimg.com/vi/l0PmgTcxlGs/hqdefault.jpg",
    duration: 1320,
    views: 5200000,
    likesCount: 98000,
    category: "Anime",
    tags: ["doraemon", "nobita", "shizuka", "hindi", "cartoon"],
    type: "video",
  },
  {
    title: "Doraemon Full Episode in Hindi | Doraemon Cartoon",
    description: "Watch a full Doraemon cartoon episode in Hindi — Nobita, Doraemon, and pocket gadgets.",
    videoUrl: "https://www.youtube.com/watch?v=PVlwjjtdVNw",
    thumbnailUrl: "https://i.ytimg.com/vi/PVlwjjtdVNw/hqdefault.jpg",
    duration: 1260,
    views: 3800000,
    likesCount: 72000,
    category: "Anime",
    tags: ["doraemon", "episode", "hindi", "anime"],
    type: "video",
  },
  {
    title: "Doraemon New Full Episode in Hindi (No Zoom)",
    description: "New Doraemon episode in Hindi without zoom effect — clean watch on Kinora.",
    videoUrl: "https://www.youtube.com/watch?v=qbVZ99VJ2Y0",
    thumbnailUrl: "https://i.ytimg.com/vi/qbVZ99VJ2Y0/hqdefault.jpg",
    duration: 1380,
    views: 4100000,
    likesCount: 85000,
    category: "Anime",
    tags: ["doraemon", "new episode", "hindi", "cartoon"],
    type: "video",
  },
  {
    title: "Doraemon New Episode in Hindi 2024 — Full Episode",
    description: "Latest-style Doraemon Hindi dubbed episode with Nobita and friends.",
    videoUrl: "https://www.youtube.com/watch?v=xhM0QtIMdE0",
    thumbnailUrl: "https://i.ytimg.com/vi/xhM0QtIMdE0/hqdefault.jpg",
    duration: 1200,
    views: 2900000,
    likesCount: 61000,
    category: "Anime",
    tags: ["doraemon", "2024", "hindi", "full episode"],
    type: "video",
  },
  {
    title: "2112: The Birth of Doraemon — Special (Hindi)",
    description: "Doraemon special movie cut in Hindi — how Doraemon came to life in 2112.",
    videoUrl: "https://www.youtube.com/watch?v=A2Q5s5lltcI",
    thumbnailUrl: "https://i.ytimg.com/vi/A2Q5s5lltcI/hqdefault.jpg",
    duration: 1500,
    views: 6100000,
    likesCount: 112000,
    category: "Anime",
    tags: ["doraemon", "movie", "special", "hindi", "2112"],
    type: "video",
  },
  {
    title: "Doraemon S15 Ep15 in Hindi — Cartoon Episode",
    description: "Season 15 episode 15 of Doraemon in Hindi. Gadgets, laughs, and Nobita trouble.",
    videoUrl: "https://www.youtube.com/watch?v=IuhJOa8xm4o",
    thumbnailUrl: "https://i.ytimg.com/vi/IuhJOa8xm4o/hqdefault.jpg",
    duration: 1140,
    views: 1750000,
    likesCount: 42000,
    category: "Anime",
    tags: ["doraemon", "s15", "episode", "hindi"],
    type: "video",
  },
];

const SAMPLE_REELS = [
  {
    title: "City lights flash",
    description: "Quick night city vibe 🌃",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    thumbnailUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerBlazes.jpg",
    duration: 15,
    views: 220000,
    likesCount: 18400,
    category: "Lifestyle",
    tags: ["reel", "city"],
    type: "reel",
  },
  {
    title: "Action cut",
    description: "High energy clip for Kinora Reels",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    thumbnailUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerEscapes.jpg",
    duration: 15,
    views: 510000,
    likesCount: 40200,
    category: "Entertainment",
    tags: ["reel", "action"],
    type: "reel",
  },
  {
    title: "Open movie moment",
    description: "A short peek from Elephants Dream",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    thumbnailUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ElephantsDream.jpg",
    duration: 30,
    views: 98000,
    likesCount: 7200,
    category: "Animation",
    tags: ["reel", "animation"],
    type: "reel",
  },
  {
    title: "Bunny hop",
    description: "Big Buck Bunny reel cut",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    thumbnailUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg",
    duration: 20,
    views: 340000,
    likesCount: 29100,
    category: "Animation",
    tags: ["reel", "funny"],
    type: "reel",
  },
];

async function seedDatabase() {
  const password = await hashPassword("password123");
  let creators = store.findUsers();

  if (creators.length === 0) {
    console.log("Seeding users...");
    creators = [
      store.createUser({
        username: "techstudio",
        email: "tech@demo.com",
        password,
        fullName: "Tech Studio",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=tech",
        subscribersCount: 125000,
        role: "user",
      }),
      store.createUser({
        username: "animeworld",
        email: "anime@demo.com",
        password,
        fullName: "Anime World",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=anime",
        subscribersCount: 89000,
        role: "user",
      }),
      store.createUser({
        username: "demouser",
        email: "demo@youtube.com",
        password,
        fullName: "Demo User",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=demo",
        subscribersCount: 4200,
        role: "admin",
      }),
    ];
  }

  if (store.findVideos({ type: "video" }).length === 0) {
    console.log("Seeding videos...");
    SAMPLE_VIDEOS.forEach((video, i) => {
      store.createVideo({ ...video, ownerId: creators[i % creators.length].id });
    });
  }

  if (store.findVideos({ type: "reel" }).length === 0) {
    console.log("Seeding reels...");
    SAMPLE_REELS.forEach((reel, i) => {
      store.createVideo({ ...reel, ownerId: creators[i % creators.length].id });
    });
  }

  let doraemon = store.findUser({ username: "doraemon" });
  if (!doraemon) {
    console.log("Seeding Doraemon channel...");
    doraemon = store.createUser({
      username: "doraemon",
      email: "doraemon@demo.com",
      password,
      fullName: "Doraemon",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=doraemon",
      subscribersCount: 9800000,
      role: "user",
    });
  }

  const existingTitles = new Set(store.findVideos({ type: "video" }).map((v) => v.title));
  const missingDora = DORAEMON_EPISODES.filter((ep) => !existingTitles.has(ep.title));
  if (missingDora.length) {
    console.log(`Seeding ${missingDora.length} Doraemon episodes...`);
    missingDora.forEach((ep) => {
      store.createVideo({ ...ep, ownerId: doraemon.id });
    });
  }

  const demo = store.findUser({ email: "demo@youtube.com" });
  if (demo && store.findPlaylistsByOwner(demo.id).length === 0) {
    const vids = store.findVideos({ type: "video" }).slice(0, 3).map((v) => v.id);
    store.createPlaylist({
      title: "Watch later favorites",
      description: "My starter Kinora playlist",
      ownerId: demo.id,
      isPublic: true,
      videoIds: vids,
    });
  }

  console.log("✅ Kinora database ready");
  console.log("   Login: demo@youtube.com / password123");
}

module.exports = { seedDatabase };
