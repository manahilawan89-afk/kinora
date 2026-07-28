const store = require("./store");
const { hashPassword } = require("./utils/password");

const SAMPLE_SUBTITLES = [
  { src: "/subtitles/sample-en.vtt", label: "English", lang: "en", default: true },
];

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
    subtitles: SAMPLE_SUBTITLES,
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
    subtitles: SAMPLE_SUBTITLES,
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

const DUCKY_VLOGS = [
  {
    title: "Ducky Bhai Vlog — Subah Subah Barish Aa Gayi",
    description: "Morning rain, chai, and classic Ducky Bhai vlog energy on Kinora.",
    videoUrl: "https://www.youtube.com/watch?v=dXn3ps-QElE",
    thumbnailUrl: "https://i.ytimg.com/vi/dXn3ps-QElE/hqdefault.jpg",
    duration: 720,
    views: 2850000,
    likesCount: 198000,
    category: "Vlogs",
    tags: ["ducky bhai", "vlog", "pakistan"],
    type: "video",
  },
  {
    title: "Ducky Bhai — Living in Nobita's House for 24 Hours",
    description: "24-hour challenge vlog with friends and full Ducky Bhai chaos.",
    videoUrl: "https://www.youtube.com/shorts/OO5wzFPB2lQ",
    thumbnailUrl: "https://i.ytimg.com/vi/OO5wzFPB2lQ/hqdefault.jpg",
    duration: 60,
    views: 4100000,
    likesCount: 312000,
    category: "Vlogs",
    tags: ["ducky bhai", "vlog", "challenge"],
    type: "video",
  },
  {
    title: "Ducky Bhai Vlog — Food Hunt in Karachi",
    description: "Street food, biryani stops, and late-night cravings across Karachi.",
    videoUrl: "https://www.youtube.com/watch?v=dXn3ps-QElE",
    thumbnailUrl: "https://picsum.photos/seed/ducky-food/640/360.jpg",
    duration: 840,
    views: 1920000,
    likesCount: 145000,
    category: "Vlogs",
    tags: ["ducky bhai", "food", "karachi"],
    type: "video",
  },
  {
    title: "Ducky Bhai Vlog — Gym + Daily Routine",
    description: "Workout, banter, and a full day in the life vlog.",
    videoUrl: "https://www.youtube.com/shorts/OO5wzFPB2lQ",
    thumbnailUrl: "https://picsum.photos/seed/ducky-gym/640/360.jpg",
    duration: 600,
    views: 1560000,
    likesCount: 121000,
    category: "Vlogs",
    tags: ["ducky bhai", "gym", "routine"],
    type: "video",
  },
  {
    title: "Ducky Bhai Vlog — Friends Hangout & Adventures",
    description: "Friend group chaos, random plans, and unfiltered vlog moments.",
    videoUrl: "https://www.youtube.com/watch?v=dXn3ps-QElE",
    thumbnailUrl: "https://picsum.photos/seed/ducky-friends/640/360.jpg",
    duration: 900,
    views: 2210000,
    likesCount: 176000,
    category: "Vlogs",
    tags: ["ducky bhai", "friends", "comedy"],
    type: "video",
  },
];

const EXTRA_VIDEOS = [
  {
    title: "JavaScript Tutorial for Beginners",
    description: "A beginner-friendly JavaScript crash course to get you coding fast.",
    videoUrl: "https://www.youtube.com/watch?v=W6NZfCO5SIk",
    thumbnailUrl: "https://i.ytimg.com/vi/W6NZfCO5SIk/hqdefault.jpg",
    duration: 4800,
    views: 15000000,
    likesCount: 520000,
    category: "Tech",
    tags: ["javascript", "tutorial", "beginner"],
    type: "video",
  },
  {
    title: "React JS Explained in 10 Minutes",
    description: "Understand React components, props, and state in one sitting.",
    videoUrl: "https://www.youtube.com/watch?v=7oRFXbrFhT8",
    thumbnailUrl: "https://i.ytimg.com/vi/7oRFXbrFhT8/hqdefault.jpg",
    duration: 600,
    views: 6200000,
    likesCount: 310000,
    category: "Tech",
    tags: ["react", "javascript", "web dev"],
    type: "video",
  },
  {
    title: "Node.js in 100 Seconds",
    description: "What Node.js is and why backend JavaScript took over the web.",
    videoUrl: "https://www.youtube.com/watch?v=TlB_eWDSMt4",
    thumbnailUrl: "https://i.ytimg.com/vi/TlB_eWDSMt4/hqdefault.jpg",
    duration: 125,
    views: 4100000,
    likesCount: 198000,
    category: "Tech",
    tags: ["nodejs", "backend", "javascript"],
    type: "video",
  },
  {
    title: "What is an API?",
    description: "Simple explanation of APIs and how apps talk to each other.",
    videoUrl: "https://www.youtube.com/watch?v=s7wmiS2mSXY",
    thumbnailUrl: "https://i.ytimg.com/vi/s7wmiS2mSXY/hqdefault.jpg",
    duration: 180,
    views: 2800000,
    likesCount: 142000,
    category: "Tech",
    tags: ["api", "programming", "explained"],
    type: "video",
  },
  {
    title: "Doraemon — Nobita's Genius Gadget Day",
    description: "Nobita discovers a gadget that makes him a genius for one day.",
    videoUrl: "https://www.youtube.com/watch?v=l0PmgTcxlGs",
    thumbnailUrl: "https://i.ytimg.com/vi/l0PmgTcxlGs/hqdefault.jpg",
    duration: 1180,
    views: 2400000,
    likesCount: 54000,
    category: "Anime",
    tags: ["doraemon", "nobita", "hindi"],
    type: "video",
  },
  {
    title: "Doraemon — Time Machine Adventure (Hindi)",
    description: "Doraemon and Nobita travel through time with a wild pocket gadget.",
    videoUrl: "https://www.youtube.com/watch?v=PVlwjjtdVNw",
    thumbnailUrl: "https://i.ytimg.com/vi/PVlwjjtdVNw/hqdefault.jpg",
    duration: 1220,
    views: 1950000,
    likesCount: 48000,
    category: "Anime",
    tags: ["doraemon", "time travel", "cartoon"],
    type: "video",
  },
  {
    title: "Big Buck Bunny — Open Movie (HD)",
    description: "Beloved open-source animated short. Free to watch on Kinora.",
    videoUrl: "https://download.blender.org/peach/bigbuckbunny_movies/BigBuckBunny_320x180.mp4",
    thumbnailUrl: "https://picsum.photos/seed/kinora-bunny-hd/640/360.jpg",
    duration: 596,
    views: 980000,
    likesCount: 42000,
    category: "Animation",
    tags: ["animation", "open source", "short film"],
    type: "video",
  },
  {
    title: "Sintel — Blender Open Movie",
    description: "Fantasy short about a girl searching for her dragon friend.",
    videoUrl: "https://download.blender.org/durian/trailer/sintel_trailer-480p.mp4",
    thumbnailUrl: "https://picsum.photos/seed/kinora-sintel/640/360.jpg",
    duration: 52,
    views: 760000,
    likesCount: 38000,
    category: "Animation",
    tags: ["sintel", "blender", "fantasy"],
    type: "video",
  },
  {
    title: "Kinora Creator Tips — Film Your First Vlog",
    description: "Quick tips for lighting, framing, and storytelling on Kinora.",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    thumbnailUrl: "https://picsum.photos/seed/kinora-tips/640/360.jpg",
    duration: 45,
    views: 124000,
    likesCount: 8900,
    category: "Entertainment",
    tags: ["creator", "tips", "vlog"],
    type: "video",
  },
  {
    title: "Night Drive Lo-Fi Mix",
    description: "Chill beats for late-night browsing and background vibes.",
    videoUrl: "https://www.w3schools.com/html/movie.mp4",
    thumbnailUrl: "https://picsum.photos/seed/kinora-lofi/640/360.jpg",
    duration: 180,
    views: 540000,
    likesCount: 31000,
    category: "Entertainment",
    tags: ["music", "lofi", "chill"],
    type: "video",
  },
];

const EXTRA_REELS = [
  {
    title: "Sintel trailer cut",
    description: "Epic fantasy reel from Blender open movie",
    videoUrl: "https://download.blender.org/durian/trailer/sintel_trailer-480p.mp4",
    thumbnailUrl: "https://picsum.photos/seed/reel-sintel/400/700.jpg",
    duration: 30,
    views: 180000,
    likesCount: 14200,
    category: "Animation",
    tags: ["reel", "fantasy"],
    type: "reel",
  },
  {
    title: "Coding flow",
    description: "Late night dev session reel",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    thumbnailUrl: "https://picsum.photos/seed/reel-code/400/700.jpg",
    duration: 25,
    views: 95000,
    likesCount: 6800,
    category: "Tech",
    tags: ["reel", "coding"],
    type: "reel",
  },
];

function seedMissingVideos(videos, ownerId) {
  const existingTitles = new Set(store.findVideos({ type: "video" }).map((v) => v.title));
  const missing = videos.filter((v) => !existingTitles.has(v.title));
  if (missing.length) {
    console.log(`Seeding ${missing.length} videos...`);
    missing.forEach((video) => {
      store.createVideo({ ...video, ownerId });
    });
  }
  return missing.length;
}

function seedMissingReels(reels, pickOwner) {
  const existingTitles = new Set(store.findVideos({ type: "reel" }).map((v) => v.title));
  const missing = reels.filter((r) => !existingTitles.has(r.title));
  if (missing.length) {
    console.log(`Seeding ${missing.length} reels...`);
    missing.forEach((reel, i) => {
      store.createVideo({ ...reel, ownerId: pickOwner(i).id });
    });
  }
}

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

  let ducky = store.findUser({ username: "duckybhai" });
  if (!ducky) {
    console.log("Seeding Ducky Bhai channel...");
    ducky = store.createUser({
      username: "duckybhai",
      email: "ducky@demo.com",
      password,
      fullName: "Ducky Bhai",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ducky",
      subscribersCount: 6200000,
      role: "user",
    });
  }
  seedMissingVideos(DUCKY_VLOGS, ducky.id);

  const techStudio = store.findUser({ username: "techstudio" }) || creators[0];
  const animeWorld = store.findUser({ username: "animeworld" }) || creators[1];
  EXTRA_VIDEOS.forEach((video, i) => {
    const owner = video.category === "Anime" ? doraemon : i % 2 === 0 ? techStudio : animeWorld;
    const titles = new Set(store.findVideos({ type: "video" }).map((v) => v.title));
    if (!titles.has(video.title)) {
      store.createVideo({ ...video, ownerId: owner.id });
    }
  });

  seedMissingReels(EXTRA_REELS, (i) => creators[i % creators.length]);

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
