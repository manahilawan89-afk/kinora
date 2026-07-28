/**
 * Kinora content catalog — 200+ unique videos + reels across diverse categories.
 * Thumbnails use unique picsum seeds; playback rotates through royalty-free sample MP4s.
 */

const CATALOG_VERSION = 3;

const SAMPLE_MP4 = [
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4",
  "https://download.blender.org/peach/bigbuckbunny_movies/BigBuckBunny_320x180.mp4",
  "https://download.blender.org/durian/trailer/sintel_trailer-480p.mp4",
];

const CREATORS = [
  { username: "techverse", fullName: "TechVerse", verified: true, subs: 4200000, bio: "Gadgets, AI & the future of tech." },
  { username: "pixelacademy", fullName: "Pixel Academy", verified: true, subs: 2800000, bio: "Learn to code — project-based tutorials." },
  { username: "wanderdiaries", fullName: "Wander Diaries", verified: true, subs: 3100000, bio: "Travel stories from every continent." },
  { username: "melodymakers", fullName: "Melody Makers", verified: true, subs: 8900000, bio: "Official music, live sessions & labels." },
  { username: "sciencehub", fullName: "Science Hub", verified: true, subs: 5600000, bio: "Physics, chemistry, biology explained." },
  { username: "naturelens", fullName: "Nature Lens", verified: true, subs: 4700000, bio: "Wildlife, oceans & cinematic nature." },
  { username: "footballcentral", fullName: "Football Central", verified: true, subs: 7200000, bio: "Goals, analysis & matchday energy." },
  { username: "cinescope", fullName: "CineScope", verified: true, subs: 3900000, bio: "Movies, shows & film culture." },
  { username: "kitchenstories", fullName: "Kitchen Stories", verified: true, subs: 2500000, bio: "Recipes that actually work." },
  { username: "aiweekly", fullName: "AI Weekly", verified: true, subs: 1900000, bio: "Weekly deep-dives into artificial intelligence." },
  { username: "historyvault", fullName: "History Vault", verified: true, subs: 3400000, bio: "Ancient worlds to modern history." },
  { username: "mindmatters", fullName: "Mind Matters", verified: true, subs: 2100000, bio: "Psychology, focus & self-improvement." },
  { username: "gamepulse", fullName: "GamePulse", verified: true, subs: 6100000, bio: "Gameplay, reviews & esports." },
  { username: "fitfuel", fullName: "FitFuel", verified: false, subs: 980000, bio: "Workouts, health & daily discipline." },
  { username: "startupdeck", fullName: "Startup Deck", verified: true, subs: 1500000, bio: "Founders, finance & growth." },
  { username: "drivelane", fullName: "Drive Lane", verified: true, subs: 2700000, bio: "Cars, EVs & motorcycle culture." },
  { username: "diyforge", fullName: "DIY Forge", verified: false, subs: 740000, bio: "Builds, woodworking & 3D printing." },
  { username: "newswire", fullName: "NewsWire Daily", verified: true, subs: 5200000, bio: "World, science & tech news." },
  { username: "kidsspark", fullName: "Kids Spark", verified: true, subs: 4300000, bio: "Learning videos for curious kids." },
  { username: "podcasthq", fullName: "Podcast HQ", verified: true, subs: 1800000, bio: "Long-form talks & storytelling." },
  { username: "cricketzone", fullName: "Cricket Zone", verified: true, subs: 6800000, bio: "Cricket highlights & expert analysis." },
  { username: "lofilane", fullName: "Lo-Fi Lane", verified: true, subs: 11000000, bio: "Beats to study, chill & create." },
];

/** [title, description, category, tags[], creatorUsername, durationSec, views, likes, comments, daysAgo, type?, music?] */
const ENTRIES = [
  // —— Technology ——
  ["GPT-5 Is Here: What Actually Changed", "Hands-on look at the new model, latency, tools, and where it still fails.", "AI", ["ai", "gpt", "tech"], "aiweekly", 842, 12400000, 412000, 18900, 2],
  ["Build a Full-Stack App in 2026", "React, Node, and deployment — a clean production path from zero.", "Programming", ["programming", "fullstack"], "pixelacademy", 1920, 6800000, 198000, 9200, 5],
  ["CSS Grid Masterclass (No Framework)", "Layouts that finally click — from cards to complex dashboards.", "Web Development", ["css", "webdev"], "pixelacademy", 1380, 3200000, 97000, 4100, 12],
  ["Zero-Day Explained in 12 Minutes", "How researchers find, report, and patch critical vulnerabilities.", "Cyber Security", ["security", "hacking"], "techverse", 742, 9100000, 301000, 15400, 3],
  ["I Tested 9 Wireless Earbuds Blind", "Sound, ANC, battery — ranked without brand bias.", "Gadgets", ["gadgets", "review"], "techverse", 1104, 5400000, 156000, 8800, 8],
  ["iPhone vs Pixel Camera Torture Test", "Night, zoom, video — which phone wins in the real world?", "Smartphones", ["phones", "camera"], "techverse", 1260, 15200000, 489000, 22100, 1],
  ["Boston Dynamics New Robot Demo", "Parkour, warehouse work, and what it means for jobs.", "Robotics", ["robotics", "future"], "techverse", 614, 18700000, 612000, 27800, 4],
  ["How James Webb Sees the Early Universe", "Infrared astronomy made visual and human.", "Space Technology", ["space", "jwst"], "sciencehub", 980, 7600000, 245000, 10200, 9],
  ["TypeScript Tips Pros Use Daily", "Generics, narrowing, and patterns that cut bugs.", "Programming", ["typescript", "coding"], "pixelacademy", 720, 2100000, 78000, 3200, 18],
  ["Neural Networks from Scratch", "Math + code — build a tiny network you can understand.", "AI", ["ml", "neural"], "aiweekly", 1680, 4500000, 167000, 7600, 14],
  ["Next.js App Router Deep Dive", "Routing, caching, and server components without the hype.", "Web Development", ["nextjs", "react"], "pixelacademy", 1540, 3900000, 121000, 5400, 7],
  ["Password Managers Compared 2026", "Security, UX, and pricing for Bitwarden, 1Password & more.", "Cyber Security", ["passwords", "privacy"], "techverse", 890, 2800000, 89000, 3900, 21],
  ["Foldable Phones: Worth It Yet?", "Durability tests after 6 months of daily use.", "Smartphones", ["foldable", "review"], "techverse", 1020, 4100000, 132000, 6100, 11],
  ["Drone Delivery Is Closer Than You Think", "Logistics pilots, noise, and regulation reality check.", "Gadgets", ["drones", "future"], "techverse", 760, 3300000, 99000, 4500, 16],
  ["ROS 2 Crash Course for Beginners", "Bring up a robot sim and move a joint in one sitting.", "Robotics", ["ros", "robots"], "pixelacademy", 2100, 980000, 41000, 2100, 28],
  ["Starship Flight Highlights Explained", "What that launch proved — and what still needs work.", "Space Technology", ["spacex", "rockets"], "sciencehub", 880, 11200000, 378000, 16500, 6],

  // —— Education ——
  ["Calculus Intuition: Derivatives Visually", "Stop memorizing — see rates of change.", "Mathematics", ["math", "calculus"], "sciencehub", 940, 5200000, 188000, 7200, 10],
  ["The Double-Slit Experiment", "Quantum weirdness with clear animations.", "Physics", ["physics", "quantum"], "sciencehub", 780, 8900000, 312000, 14100, 5],
  ["Organic Chemistry in 20 Minutes", "Functional groups that show up everywhere.", "Chemistry", ["chemistry", "study"], "sciencehub", 1200, 3100000, 102000, 4800, 19],
  ["How Cells Make Energy (ATP)", "Mitochondria story without the textbook fog.", "Biology", ["biology", "cells"], "sciencehub", 860, 2700000, 91000, 3600, 22],
  ["Fall of the Roman Empire — Condensed", "Politics, economics, and borders in one narrative.", "History", ["rome", "history"], "historyvault", 1420, 6400000, 201000, 9800, 8],
  ["Why Continents Drift", "Plate tectonics mapped over millions of years.", "Geography", ["earth", "maps"], "sciencehub", 700, 1900000, 67000, 2900, 25],
  ["Supply & Demand: Real Examples", "Coffee prices, housing, and concert tickets.", "Economics", ["econ", "markets"], "startupdeck", 920, 2400000, 82000, 3500, 15],
  ["Cognitive Biases That Trick You Daily", "12 shortcuts your brain takes — and how to notice them.", "Psychology", ["psychology", "mind"], "mindmatters", 1080, 4800000, 176000, 8100, 4],
  ["Spanish in 30 Days — Realistic Plan", "A schedule that survives a busy life.", "Language Learning", ["spanish", "languages"], "mindmatters", 1320, 3600000, 129000, 5600, 13],
  ["Linear Algebra for Machine Learning", "Vectors, matrices, and why they matter for AI.", "Mathematics", ["linalg", "ml"], "aiweekly", 1760, 2900000, 115000, 4900, 17],
  ["Newton's Laws with Slow-Mo", "Forces you can see.", "Physics", ["newton", "mechanics"], "sciencehub", 640, 4100000, 143000, 5200, 20],
  ["Periodic Table Story Mode", "How elements were discovered and named.", "Chemistry", ["elements", "science"], "sciencehub", 990, 2200000, 78000, 3100, 30],
  ["Silk Road: First Globalization", "Trade that reshaped cultures.", "History", ["silkroad", "trade"], "historyvault", 1280, 3500000, 118000, 4700, 12],
  ["How Memory Actually Works", "Encoding, sleep, and retrieval practice.", "Psychology", ["memory", "learning"], "mindmatters", 870, 2700000, 98000, 4000, 9],

  // —— Entertainment ——
  ["Best Movies of the Decade (So Far)", "Critics vs audience — our definitive list.", "Movies", ["film", "lists"], "cinescope", 1180, 7200000, 245000, 13200, 3],
  ["TV Shows You Missed in 2025", "Hidden gems beyond the algorithm.", "TV Shows", ["tv", "binge"], "cinescope", 940, 3900000, 128000, 6100, 11],
  ["Stand-Up Night: Airport Stories", "Clean comedy set about travel disasters.", "Comedy", ["standup", "funny"], "cinescope", 1320, 5100000, 189000, 8800, 7],
  ["When Pets Discover Mirrors", "Compilation that never gets old.", "Funny Videos", ["pets", "funny"], "cinescope", 480, 22100000, 890000, 32000, 2],
  ["Meme History: 2010 to Now", "How formats mutated across platforms.", "Memes", ["memes", "internet"], "cinescope", 860, 6800000, 267000, 14100, 14],
  ["How Pixar Lights a Scene", "Look-dev secrets from classic films.", "Animation", ["pixar", "animation"], "cinescope", 1020, 4500000, 156000, 5900, 18],
  ["Anime Openings Ranked 2026", "Energy, animation, and earworms.", "Anime", ["anime", "op"], "cinescope", 1100, 9800000, 401000, 19800, 1],
  ["Classic Cartoons That Still Hit", "Timing and charm from the golden age.", "Cartoons", ["cartoons", "nostalgia"], "cinescope", 780, 3200000, 112000, 4300, 24],
  ["Oscars Snubs Explained", "Performances that deserved more.", "Movies", ["oscars", "awards"], "cinescope", 900, 4100000, 134000, 9200, 6],
  ["Binge Guide: Limited Series", "Finish in a weekend — quality picks.", "TV Shows", ["series", "guide"], "cinescope", 720, 2100000, 72000, 2800, 22],

  // —— Music ——
  ["Neon Skies — Official Music Video", "Official video for Neon Skies. Shot on film in Lisbon.", "Pop", ["pop", "omv", "official"], "melodymakers", 214, 28400000, 1100000, 45000, 5, "video", { artist: "Aria Vale", label: "Atlantic Records", verifiedArtist: true }],
  ["Midnight Cipher — Live at Warehouse", "Hip-hop live cut with full band energy.", "Hip-Hop", ["hiphop", "live"], "melodymakers", 248, 9100000, 378000, 16200, 9, "video", { artist: "Jett Malone", label: "Def Jam", verifiedArtist: true }],
  ["Static Hearts — Studio Session", "Rock anthem tracked live to tape.", "Rock", ["rock", "session"], "melodymakers", 266, 5400000, 198000, 8100, 12, "video", { artist: "The Voltage", label: "Independent", verifiedArtist: true }],
  ["Moonlit Sonata Reimagined", "Classical meets modern strings.", "Classical", ["classical", "piano"], "melodymakers", 312, 3200000, 121000, 4900, 20, "video", { artist: "Elena Cho", label: "Deutsche Grammophon", verifiedArtist: true }],
  ["Late Train Jazz Quartet", "Smoky club set — no overdubs.", "Jazz", ["jazz", "live"], "melodymakers", 980, 1800000, 67000, 2400, 27, "video", { artist: "Marcus Reed Quartet", label: "Blue Note", verifiedArtist: true }],
  ["Lo-Fi Study Beats — 3 Hour Mix", "Rainy window energy for deep work.", "Lo-fi", ["lofi", "study"], "lofilane", 10800, 89000000, 2100000, 87000, 0, "video", { artist: "Lo-Fi Lane", label: "Chillhop Music", verifiedArtist: true }],
  ["Pulse Protocol — Festival Edit", "EDM mainstage cut with crowd mic.", "EDM", ["edm", "festival"], "melodymakers", 198, 12400000, 456000, 19800, 4, "video", { artist: "NOVA Circuit", label: "Spinnin' Records", verifiedArtist: true }],
  ["Starlight Idol — Dance Practice", "K-Pop choreography in 4K.", "K-Pop", ["kpop", "dance"], "melodymakers", 224, 45600000, 1800000, 92000, 3, "video", { artist: "LUNA5", label: "HYBE", verifiedArtist: true }],
  ["Raat Ke Musafir — Official Video", "Bollywood romantic ballad, official release.", "Bollywood Songs", ["bollywood", "omv"], "melodymakers", 256, 67200000, 2400000, 110000, 2, "video", { artist: "Arijit Collective", label: "T-Series", verifiedArtist: true }],
  ["Coke Studio: Desert Wind (Live)", "Cross-genre fusion recorded live.", "Coke Studio", ["cokestudio", "live"], "melodymakers", 340, 38100000, 1500000, 68000, 8, "video", { artist: "Various Artists", label: "Coke Studio", verifiedArtist: true }],
  ["Acoustic Cover: Neon Skies", "Guitar + voice — living room take.", "Acoustic Sessions", ["acoustic", "cover"], "melodymakers", 232, 4200000, 156000, 7200, 15, "video", { artist: "Sam Rivera", label: "Unsigned", verifiedArtist: false }],
  ["Trending: Soft Launch (Lyric Video)", "The song everywhere this week.", "Trending Songs", ["trending", "lyrics"], "melodymakers", 198, 19200000, 712000, 28000, 1, "video", { artist: "Mira Sol", label: "Republic Records", verifiedArtist: true }],
  ["Piano Only — City Sleeps", "Instrumental score for late nights.", "Instrumentals", ["piano", "instrumental"], "lofilane", 420, 6100000, 201000, 5400, 10, "video", { artist: "Lo-Fi Lane", label: "Chillhop Music", verifiedArtist: true }],
  ["World Tour: Seoul Night One", "Concert film excerpt — opening medley.", "Live Concerts", ["concert", "tour"], "melodymakers", 720, 8800000, 334000, 14200, 6, "video", { artist: "Aria Vale", label: "Atlantic Records", verifiedArtist: true }],
  ["Official MV: Gravity Wells", "Sci-fi themed pop video.", "Official Music Videos", ["omv", "pop"], "melodymakers", 241, 15300000, 589000, 21000, 7, "video", { artist: "ORBIT", label: "Sony Music", verifiedArtist: true }],

  // —— Gaming ——
  ["Minecraft: 100 Days in Hardcore", "One life, one world — day-by-day.", "Minecraft", ["minecraft", "hardcore"], "gamepulse", 2400, 18700000, 678000, 31200, 2],
  ["GTA Roleplay: Rookie Cop Chaos", "First week on the force goes sideways.", "GTA", ["gta", "rp"], "gamepulse", 1680, 9200000, 345000, 15600, 5],
  ["Valorant: Radiant Rank Climb", "Aim routines + VOD review highlights.", "Valorant", ["valorant", "fps"], "gamepulse", 1320, 7100000, 256000, 11200, 4],
  ["CS2: Major Highlights Recap", "Clutches that defined the tournament.", "CS2", ["cs2", "esports"], "gamepulse", 880, 5400000, 189000, 8700, 3],
  ["PUBG Mobile: Chicken Dinner Streak", "Hot drops and endgame IQ.", "PUBG", ["pubg", "mobile"], "gamepulse", 960, 6800000, 234000, 9900, 8],
  ["Fortnite Chapter Update Tour", "New POIs, weapons, and meta picks.", "Fortnite", ["fortnite", "update"], "gamepulse", 740, 11200000, 412000, 17800, 1],
  ["Best Mobile Games Right Now", "Offline and online picks worth your storage.", "Mobile Games", ["mobile", "games"], "gamepulse", 1020, 3900000, 128000, 5400, 12],
  ["Is This Indie Worth Buying?", "Honest review after 20 hours.", "Game Reviews", ["review", "indie"], "gamepulse", 860, 2100000, 78000, 4200, 16],
  ["Elden Ring Boss Walkthrough", "Pattern breaks without spoilers for the story.", "Walkthroughs", ["souls", "guide"], "gamepulse", 1540, 8500000, 301000, 13400, 9],
  ["Esports Prize Pools Explained", "Where the money goes in competitive gaming.", "Esports", ["esports", "biz"], "gamepulse", 720, 1700000, 56000, 2800, 21],

  // —— Sports ——
  ["Champions League Final Goals", "Every goal, every angle.", "Football", ["ucl", "football"], "footballcentral", 640, 24100000, 890000, 34000, 2],
  ["Asia Cup: Match of the Tournament", "Turns, sixes, and a last-over thriller.", "Cricket", ["cricket", "asia"], "cricketzone", 820, 19800000, 712000, 28900, 3],
  ["NBA: Top 10 Dunks This Week", "Posterizers and chase-downs.", "Basketball", ["nba", "dunks"], "footballcentral", 360, 8700000, 312000, 9800, 1],
  ["Wimbledon Rally of the Year", "40-shot classic broken down.", "Tennis", ["wimbledon", "tennis"], "footballcentral", 420, 5200000, 178000, 6100, 10],
  ["F1: Overtake of the Season", "DRS, nerves, and millimetres.", "Formula 1", ["f1", "overtake"], "footballcentral", 280, 14300000, 501000, 18900, 4],
  ["UFC Main Event Highlights", "Knockouts and grappling chess.", "UFC", ["ufc", "mma"], "footballcentral", 540, 9600000, 356000, 14200, 6],
  ["WWE: Entrance Hits Different", "Crowd reactions that broke the internet.", "WWE", ["wwe", "wrestling"], "footballcentral", 480, 7800000, 267000, 11200, 8],
  ["Olympics: Unforgettable Moments", "Underdogs and world records.", "Olympics", ["olympics", "moments"], "footballcentral", 900, 11200000, 423000, 16700, 30],
  ["Tactical Board: False Nine Explained", "How modern strikers drop deep.", "Analysis", ["tactics", "football"], "footballcentral", 780, 2400000, 89000, 3900, 14],
  ["IPL Auction Strategy Breakdown", "Purse math and surprise buys.", "Cricket", ["ipl", "auction"], "cricketzone", 1100, 6500000, 234000, 9800, 40],

  // —— Lifestyle ——
  ["Tokyo Alone for 72 Hours", "Food, trains, and quiet neighborhoods.", "Travel", ["tokyo", "solo"], "wanderdiaries", 1480, 9200000, 345000, 12800, 5],
  ["Street Food Crawl: Istanbul", "From simit to late-night kebabs.", "Food", ["streetfood", "turkey"], "kitchenstories", 920, 6100000, 223000, 8700, 9],
  ["Sourdough That Actually Rises", "Starter care and oven steam tricks.", "Cooking", ["bread", "baking"], "kitchenstories", 1140, 3800000, 142000, 6100, 15],
  ["20-Minute Full Body (No Equipment)", "Hotel-room friendly workout.", "Fitness", ["workout", "home"], "fitfuel", 1240, 4700000, 178000, 5400, 7],
  ["Sleep Better in 7 Days", "Light, caffeine, and wind-down rituals.", "Health", ["sleep", "habits"], "mindmatters", 860, 5200000, 201000, 9200, 11],
  ["Capsule Wardrobe for Warm Climates", "12 pieces, endless outfits.", "Fashion", ["style", "minimal"], "wanderdiaries", 780, 2100000, 78000, 3100, 22],
  ["A Day in My Creative Studio", "Morning routine without the fluff.", "Daily Vlogs", ["vlog", "day"], "wanderdiaries", 960, 1800000, 62000, 2400, 4],
  ["Minimal Desk Setup 2026", "Cable management and focus tools.", "Minimalism", ["desk", "setup"], "techverse", 640, 3400000, 129000, 4800, 13],
  ["Lisbon Food Markets Guide", "Where locals actually shop.", "Travel", ["lisbon", "food"], "wanderdiaries", 880, 2700000, 91000, 3600, 18],
  ["High-Protein Meal Prep Sunday", "5 lunches under 30 minutes active time.", "Cooking", ["mealprep", "protein"], "kitchenstories", 1020, 4500000, 167000, 7200, 6],

  // —— Business ——
  ["I Talked to 50 Founders", "Patterns from survivors — and failures.", "Startups", ["founders", "startup"], "startupdeck", 1560, 4800000, 178000, 8900, 5],
  ["Index Funds vs Picking Stocks", "Math over vibes for long-term wealth.", "Investing", ["investing", "index"], "startupdeck", 980, 7200000, 256000, 11200, 8],
  ["Personal Finance at 25", "Emergency funds, debt, and first investments.", "Finance", ["money", "budget"], "startupdeck", 1100, 6100000, 234000, 9800, 12],
  ["Content Marketing That Compounds", "SEO + storytelling without spam.", "Marketing", ["seo", "content"], "startupdeck", 1240, 2900000, 102000, 4500, 16],
  ["Deep Work Blocks That Stick", "Calendar design for makers.", "Productivity", ["focus", "deepwork"], "mindmatters", 720, 3500000, 134000, 5100, 10],
  ["From Side Project to $1M ARR", "Timeline, pricing, and hiring mistakes.", "Entrepreneurship", ["saas", "growth"], "startupdeck", 1680, 8900000, 312000, 14500, 3],

  // —— Automotive ——
  ["Porsche vs Tesla Track Day", "Lap times, tires, and driver aids.", "Car Reviews", ["porsche", "tesla"], "drivelane", 1320, 11200000, 401000, 16700, 4],
  ["Living with an EV for a Year", "Charging, road trips, and depreciation.", "Electric Vehicles", ["ev", "ownership"], "drivelane", 1180, 6800000, 245000, 10200, 9],
  ["Cafe Racer Build Timelapse", "From donor bike to first ride.", "Motorcycles", ["cafe", "build"], "drivelane", 860, 3200000, 121000, 4800, 19],
  ["Supercar Sunday: Monaco", "Exhaust notes and parking nightmares.", "Supercars", ["lamborghini", "ferrari"], "drivelane", 740, 15400000, 567000, 21000, 2],
  ["Best First Cars Under $15k", "Reliability over Instagram vibes.", "Car Reviews", ["usedcars", "budget"], "drivelane", 1020, 4100000, 156000, 7200, 14],

  // —— Nature ——
  ["Arctic Foxes in Midnight Sun", "Patience, silence, and perfect light.", "Wildlife", ["arctic", "fox"], "naturelens", 920, 8700000, 312000, 9800, 7],
  ["Underwater: Coral City at Dawn", "Reef life before the boats arrive.", "Oceans", ["coral", "diving"], "naturelens", 780, 5400000, 198000, 6100, 11],
  ["Patagonia Ridge Walk", "Wind, granite, and endless views.", "Mountains", ["patagonia", "hiking"], "naturelens", 1100, 3900000, 145000, 5200, 16],
  ["Amazon Canopy Timelapse", "A week of forest light compressed.", "Forests", ["amazon", "timelapse"], "naturelens", 640, 6200000, 223000, 7800, 20],
  ["Drone: Norwegian Fjords 8K", "Cinematic flight through mist and peaks.", "Cinematic Drone Videos", ["drone", "norway"], "naturelens", 540, 12800000, 489000, 14200, 3],
  ["Whale Breach Compilation", "Moments that stop conversations.", "Wildlife", ["whales", "ocean"], "naturelens", 480, 9100000, 356000, 11200, 8],

  // —— DIY ——
  ["Floating Shelf That Won't Fall", "Studs, anchors, and clean finishes.", "Home Projects", ["diy", "shelves"], "diyforge", 860, 2400000, 89000, 3600, 13],
  ["Arduino Weather Station", "Sensors, OLED, and Wi-Fi logging.", "Electronics", ["arduino", "iot"], "diyforge", 1320, 1800000, 67000, 2900, 21],
  ["Walnut Coffee Table Build", "Joinery and oil finish walkthrough.", "Woodworking", ["wood", "furniture"], "diyforge", 1680, 3100000, 112000, 4500, 17],
  ["3D Printed Desk Organizer", "Design in CAD → print → iterate.", "3D Printing", ["3dprint", "cad"], "diyforge", 920, 1500000, 54000, 2100, 26],
  ["Smart Mirror Build Guide", "Two-way glass, Pi, and calendar widgets.", "Electronics", ["raspberrypi", "smart"], "diyforge", 1540, 4200000, 167000, 6800, 10],

  // —— Podcasts ——
  ["Founder Chat: Pricing Courage", "Why undercharging kills startups.", "Business", ["podcast", "founders"], "podcasthq", 2400, 980000, 34000, 1800, 6, "video"],
  ["AI Ethics Roundtable", "Bias, jobs, and regulation — civil debate.", "Technology", ["podcast", "ai"], "podcasthq", 3200, 1200000, 45000, 2400, 9, "video"],
  ["Atomic Habits — Applied Live", "Listener experiments after 30 days.", "Self Improvement", ["podcast", "habits"], "mindmatters", 2800, 2100000, 78000, 3200, 12, "video"],
  ["Interview: Cartographer of Mars", "Mapping another planet for real missions.", "Interviews", ["podcast", "space"], "podcasthq", 3600, 870000, 29000, 1500, 18, "video"],
  ["True Story: Night Train to Tbilisi", "Narrative episode — travel gone strange.", "Storytelling", ["podcast", "story"], "podcasthq", 2100, 1500000, 56000, 2800, 22, "video"],

  // —— News ——
  ["World Briefing: This Morning", "Elections, markets, and climate updates.", "World News", ["news", "world"], "newswire", 720, 3200000, 45000, 8900, 0],
  ["Science Desk: Fusion Milestone", "What net energy means (and doesn't).", "Science News", ["fusion", "science"], "newswire", 640, 4100000, 112000, 6700, 1],
  ["Tech Wire: Chip Export Rules", "How policy reshapes AI hardware.", "Technology Updates", ["chips", "policy"], "newswire", 580, 2800000, 67000, 5200, 0],
  ["Climate Watch: Heat Records", "Data, cities, and adaptation plans.", "World News", ["climate", "news"], "newswire", 700, 1900000, 42000, 4100, 2],

  // —— Kids ——
  ["Planets Song for Kids", "Mercury to Neptune — catchy and correct.", "Educational", ["kids", "space"], "kidsspark", 180, 15200000, 234000, 8900, 20],
  ["ABC Phonics Adventure", "Letter sounds with playful animation.", "Nursery Rhymes", ["abc", "phonics"], "kidsspark", 240, 22100000, 312000, 11200, 15],
  ["How Volcanoes Work (Kids)", "Magma, eruptions, and safety basics.", "Learning Videos", ["kids", "volcano"], "kidsspark", 420, 6800000, 145000, 4200, 25],
  ["Counting to 100 with Beats", "Rhythm that makes numbers stick.", "Educational", ["counting", "kids"], "kidsspark", 300, 9100000, 178000, 5600, 18],
  ["Ocean Animals for Kids", "Whales, octopuses, and reef fish.", "Learning Videos", ["ocean", "kids"], "kidsspark", 480, 7400000, 156000, 4800, 22],

  // —— Documentaries ——
  ["Pale Blue Dot: Earth from Space", "Home, scaled against the void.", "Space", ["doc", "earth"], "sciencehub", 1800, 5600000, 201000, 7800, 14],
  ["Lost Cities of the Andes", "Archaeology beyond Machu Picchu.", "Ancient Civilizations", ["doc", "andes"], "historyvault", 2400, 4200000, 156000, 6100, 19],
  ["The Art Forger's Playbook", "How fakes fooled museums — and how they got caught.", "Crime", ["doc", "art"], "historyvault", 2100, 6800000, 234000, 11200, 11],
  ["Rainforest: 24 Hours", "Dawn chorus to midnight hunters.", "Nature", ["doc", "rainforest"], "naturelens", 2700, 3900000, 134000, 4500, 23],
  ["Inside a Chip Fab", "Cleanrooms, EUV, and nanometer wars.", "Technology", ["doc", "semiconductors"], "techverse", 1980, 5100000, 189000, 8200, 8],

  // —— More diversity fill to push 200+ ——
  ["React Hooks Interview Questions", "Hooks questions hiring managers still ask.", "Programming", ["react", "interview"], "pixelacademy", 1100, 2600000, 98000, 4100, 14],
  ["Docker for Absolute Beginners", "Images, containers, and your first compose file.", "Programming", ["docker", "devops"], "pixelacademy", 1280, 3400000, 121000, 5200, 11],
  ["SQL Joins Visualized", "Inner, left, and the ones people fear.", "Programming", ["sql", "data"], "pixelacademy", 760, 2900000, 112000, 3900, 19],
  ["Git Like a Pro", "Rebase, bisect, and clean history habits.", "Programming", ["git", "tools"], "pixelacademy", 900, 2200000, 82000, 3100, 24],
  ["Figma to Production Handoff", "Tokens, specs, and fewer Slack ping-pongs.", "Web Development", ["figma", "design"], "pixelacademy", 840, 1700000, 61000, 2400, 27],
  ["Wi-Fi 7 Explained Simply", "Speed claims vs apartment reality.", "Gadgets", ["wifi", "networking"], "techverse", 620, 2500000, 89000, 3600, 9],
  ["Smart Home on a Budget", "Lights, locks, and privacy trade-offs.", "Gadgets", ["smarthome", "iot"], "techverse", 980, 3100000, 112000, 4500, 15],
  ["Android Customization Guide", "Launchers, icons, and battery myths.", "Smartphones", ["android", "tips"], "techverse", 860, 2800000, 101000, 4200, 17],
  ["Satellite Internet Speed Test", "Rural upload/download after storms.", "Space Technology", ["starlink", "internet"], "techverse", 700, 4600000, 167000, 7800, 6],
  ["Prompt Engineering Playbook", "Patterns that improve output quality.", "AI", ["prompts", "llm"], "aiweekly", 920, 5800000, 212000, 9100, 3],
  ["Open Source Models Roundup", "Local LLMs worth running this month.", "AI", ["opensource", "llm"], "aiweekly", 1040, 3200000, 123000, 5600, 7],
  ["Computer Vision in Retail", "Shelf cams, privacy, and accuracy.", "AI", ["cv", "retail"], "aiweekly", 880, 1400000, 48000, 2100, 29],
  ["Black Holes for Beginners", "Event horizons without the intimidation.", "Physics", ["blackholes", "astro"], "sciencehub", 960, 7200000, 267000, 10200, 5],
  ["DNA Fingerprinting Basics", "Forensics explained step by step.", "Biology", ["dna", "forensics"], "sciencehub", 820, 2100000, 76000, 3200, 21],
  ["World War I in Maps", "Fronts that moved — and why.", "History", ["ww1", "maps"], "historyvault", 1360, 4800000, 178000, 7200, 13],
  ["Climate Zones Explained", "Why deserts sit where they do.", "Geography", ["climate", "earth"], "sciencehub", 700, 1600000, 54000, 2200, 28],
  ["Inflation in Plain English", "Prices, wages, and central banks.", "Economics", ["inflation", "econ"], "startupdeck", 780, 3500000, 121000, 5800, 10],
  ["Social Media & Attention", "What the research actually shows.", "Psychology", ["attention", "social"], "mindmatters", 940, 4100000, 156000, 8100, 8],
  ["French Pronunciation Fixes", "Sounds English speakers miss.", "Language Learning", ["french", "accent"], "mindmatters", 660, 1900000, 72000, 2900, 23],
  ["Horror Movies Done Right", "Tension craft, not jump-scare spam.", "Movies", ["horror", "craft"], "cinescope", 880, 3600000, 134000, 6700, 12],
  ["Sitcom Writing Tricks", "Setups, tags, and cold opens.", "TV Shows", ["writing", "comedy"], "cinescope", 740, 1500000, 52000, 2100, 31],
  ["Improv Games Anyone Can Try", "Warm-ups for parties and classrooms.", "Comedy", ["improv", "funny"], "cinescope", 600, 2200000, 81000, 3400, 18],
  ["Fail Comp: Sports Edition", "Painful, funny, oddly wholesome.", "Funny Videos", ["fails", "sports"], "cinescope", 520, 16700000, 612000, 18900, 4],
  ["Studio Ghibli Food Scenes", "Why animated meals feel delicious.", "Anime", ["ghibli", "food"], "cinescope", 700, 8100000, 301000, 11200, 9],
  ["Stop-Motion Desk Short", "Paper characters, handmade sets.", "Animation", ["stopmotion", "short"], "cinescope", 180, 2700000, 98000, 3600, 20],
  ["Guitar Tone Pedal Chain", "Clean → drive → ambient for rock.", "Rock", ["guitar", "tone"], "melodymakers", 840, 1900000, 67000, 2800, 25, "video", { artist: "The Voltage", label: "Independent", verifiedArtist: true }],
  ["Hip-Hop Drum Programming", "Swing, ghost notes, and punch.", "Hip-Hop", ["drums", "production"], "melodymakers", 920, 2400000, 89000, 3500, 16, "video", { artist: "Jett Malone", label: "Def Jam", verifiedArtist: true }],
  ["K-Pop Vocal Harmony Stack", "How choruses get that shine.", "K-Pop", ["vocals", "production"], "melodymakers", 680, 5200000, 201000, 8900, 7, "video", { artist: "LUNA5", label: "HYBE", verifiedArtist: true }],
  ["Minecraft Redstone Door", "Smooth flush entrance tutorial.", "Minecraft", ["redstone", "tutorial"], "gamepulse", 760, 4300000, 156000, 6200, 11],
  ["Valorant Agent Guide: Controller", "Smokes that win rounds.", "Valorant", ["smokes", "guide"], "gamepulse", 900, 3600000, 128000, 5100, 13],
  ["GTA Photo Mode Contest", "Best shots from the community.", "GTA", ["photo", "gta"], "gamepulse", 540, 2800000, 98000, 4100, 15],
  ["Mobile Esports Rising", "Scenes outside PC cafés.", "Esports", ["mobile", "esports"], "gamepulse", 820, 1700000, 56000, 2400, 22],
  ["Premier League Tactics Board", "Press triggers this weekend.", "Football", ["epl", "tactics"], "footballcentral", 860, 4500000, 167000, 7800, 2],
  ["Cricket Spin Bowling Masterclass", "Drift, dip, and seam positions.", "Cricket", ["spin", "bowling"], "cricketzone", 980, 3200000, 112000, 4500, 17],
  ["F1 Tire Strategy Simulator", "Undercut math explained.", "Formula 1", ["tires", "strategy"], "footballcentral", 720, 2900000, 101000, 4200, 9],
  ["Bali Waterfalls Day Trip", "How to avoid the tour buses.", "Travel", ["bali", "waterfall"], "wanderdiaries", 880, 5100000, 189000, 7200, 8],
  ["Homemade Ramen at Home", "Broth patience pays off.", "Cooking", ["ramen", "japanese"], "kitchenstories", 1200, 6700000, 245000, 9800, 5],
  ["Mobility Routine for Desk Workers", "Hips, thoracic spine, neck.", "Fitness", ["mobility", "desk"], "fitfuel", 720, 2300000, 89000, 3100, 14],
  ["Skincare Science vs Hype", "Ingredients with evidence.", "Health", ["skincare", "science"], "mindmatters", 900, 4800000, 178000, 8600, 6],
  ["Thrift Flip: Jacket Edit", "Before/after with basic tools.", "Fashion", ["thrift", "diy"], "wanderdiaries", 640, 1600000, 58000, 2300, 27],
  ["Seed Round Deck Teardown", "Slides that raise — and why.", "Startups", ["pitch", "fundraising"], "startupdeck", 1100, 2700000, 98000, 4100, 12],
  ["ETF Portfolio Examples", "Simple 3-fund layouts by age.", "Investing", ["etf", "portfolio"], "startupdeck", 840, 3900000, 145000, 5600, 10],
  ["Cold Email That Gets Replies", "Personalization without creepiness.", "Marketing", ["email", "outbound"], "startupdeck", 700, 2100000, 78000, 3400, 18],
  ["EV Charging Road Trip Map", "US corridors that actually work.", "Electric Vehicles", ["charging", "roadtrip"], "drivelane", 960, 3400000, 123000, 5100, 11],
  ["Track Day Beginner Mistakes", "Braking points and ego checks.", "Car Reviews", ["track", "tips"], "drivelane", 780, 2200000, 81000, 3200, 20],
  ["Safari: Big Five Encounters", "Respectful wildlife viewing tips.", "Wildlife", ["safari", "africa"], "naturelens", 1040, 5800000, 212000, 7800, 12],
  ["Kelp Forest Dive", "Green cathedrals underwater.", "Oceans", ["kelp", "dive"], "naturelens", 620, 2700000, 98000, 3400, 24],
  ["Alpine Sunrise Drone Flight", "Cold fingers, warm light.", "Cinematic Drone Videos", ["alps", "drone"], "naturelens", 400, 7200000, 267000, 8900, 5],
  ["Epoxy River Table Build", "Pour, cure, and finish stages.", "Woodworking", ["epoxy", "table"], "diyforge", 1480, 4900000, 189000, 7200, 9],
  ["Soldering for Absolute Beginners", "Irons, flux, and clean joints.", "Electronics", ["soldering", "basics"], "diyforge", 800, 1600000, 58000, 2400, 28],
  ["Kid Science: Baking Soda Rockets", "Yard-safe experiments.", "Educational", ["kids", "experiment"], "kidsspark", 360, 8300000, 167000, 5200, 16],
  ["Shapes Song Remix", "Circles, squares, and movement.", "Nursery Rhymes", ["shapes", "kids"], "kidsspark", 160, 12400000, 201000, 6100, 19],
  ["Documentary: Clean Energy Race", "Solar, wind, and grid storage.", "Technology", ["energy", "doc"], "newswire", 2200, 3100000, 112000, 4800, 15],
  ["Ancient Egypt: Daily Life", "Not just pyramids — bakers and scribes.", "Ancient Civilizations", ["egypt", "doc"], "historyvault", 1680, 4500000, 167000, 6200, 14],
  ["True Crime: Art Heist Files", "What cameras missed.", "Crime", ["heist", "doc"], "historyvault", 1920, 5900000, 223000, 9800, 7],
  ["Podcast: Shipping Under Pressure", "Deadlines without burning out.", "Self Improvement", ["podcast", "work"], "podcasthq", 2600, 1100000, 41000, 1900, 13, "video"],
  ["News: AI Regulation Week", "What lawmakers proposed this week.", "Technology Updates", ["ai", "policy"], "newswire", 540, 2400000, 56000, 4200, 0],
  ["Basketball Footwork Drills", "First step speed for guards.", "Basketball", ["training", "hoops"], "footballcentral", 700, 1900000, 67000, 2800, 21],
  ["Tennis Serve Slow-Mo Breakdown", "Trophy pose to contact.", "Tennis", ["serve", "technique"], "footballcentral", 580, 2300000, 82000, 3100, 17],
  ["UFC Striking Fundamentals", "Stance, jab, and head movement.", "UFC", ["striking", "mma"], "footballcentral", 900, 3600000, 134000, 5400, 12],
  ["Lo-Fi Piano Rain Mix", "Softer keys for late study.", "Lo-fi", ["piano", "rain"], "lofilane", 7200, 41000000, 980000, 32000, 1, "video", { artist: "Lo-Fi Lane", label: "Chillhop Music", verifiedArtist: true }],
  ["Coke Studio: River Song Acoustic", "Unplugged encore take.", "Coke Studio", ["acoustic", "cokestudio"], "melodymakers", 310, 15200000, 567000, 18900, 11, "video", { artist: "Various Artists", label: "Coke Studio", verifiedArtist: true }],
  ["Bollywood Dance Practice", "Chorus steps taught slowly.", "Bollywood Songs", ["dance", "bollywood"], "melodymakers", 540, 9800000, 356000, 14200, 8, "video", { artist: "Studio Beats", label: "T-Series", verifiedArtist: true }],
  ["Jazz Standards Practice Loop", "Autumn Leaves — slow/fast.", "Jazz", ["practice", "jazz"], "melodymakers", 1200, 1200000, 45000, 1800, 30, "video", { artist: "Marcus Reed Quartet", label: "Blue Note", verifiedArtist: true }],
  ["Classical Guitar Recital", "Bach lute suite excerpt.", "Classical", ["guitar", "bach"], "melodymakers", 860, 2100000, 78000, 2900, 22, "video", { artist: "Elena Cho", label: "Deutsche Grammophon", verifiedArtist: true }],
  ["EDM Ableton Project Tour", "Drops, risers, and sidechain.", "EDM", ["ableton", "production"], "melodymakers", 1100, 2800000, 101000, 4100, 14, "video", { artist: "NOVA Circuit", label: "Spinnin' Records", verifiedArtist: true }],
  ["Pop Vocal Warmups", "Sirens, lips, and resonance.", "Pop", ["vocals", "warmup"], "melodymakers", 480, 1700000, 62000, 2400, 26, "video", { artist: "Aria Vale", label: "Atlantic Records", verifiedArtist: true }],
  ["Fortnite Zero Build Tips", "Positioning when builds are off.", "Fortnite", ["zerobuild", "tips"], "gamepulse", 680, 5400000, 189000, 7200, 5],
  ["PUBG Sensitivities That Stick", "Gyro vs no-gyro setups.", "PUBG", ["settings", "mobile"], "gamepulse", 560, 3100000, 112000, 4500, 16],
  ["CS2 Utility Lineups", "Smokes for the new map pool.", "CS2", ["utility", "smokes"], "gamepulse", 940, 2700000, 98000, 3900, 10],
  ["Game Review: Cozy Farming Sim", "Is the loop worth 40 hours?", "Game Reviews", ["cozy", "review"], "gamepulse", 780, 1400000, 48000, 2100, 25],
  ["Walkthrough: Puzzle Tower 1-10", "No commentary spoilers in title cards.", "Walkthroughs", ["puzzle", "guide"], "gamepulse", 1400, 900000, 32000, 1400, 32],
  ["Olympics Track Finals Recap", "Photo finishes and records.", "Olympics", ["track", "finals"], "footballcentral", 720, 6400000, 234000, 8900, 45],
  ["WWE Storyline Explainer", "Who's feuding and why it matters.", "WWE", ["story", "wrestling"], "footballcentral", 800, 4100000, 145000, 6100, 7],
  ["Highlights: Night Football Under Lights", "Goals with atmosphere.", "Highlights", ["football", "goals"], "footballcentral", 420, 8900000, 312000, 10200, 1],
  ["Daily Vlog: Market Morning", "Coffee, cameras, and chaos.", "Daily Vlogs", ["vlog", "market"], "wanderdiaries", 720, 980000, 34000, 1500, 3],
  ["Minimal Closet Challenge", "30 days, 30 pieces.", "Minimalism", ["closet", "challenge"], "wanderdiaries", 680, 1500000, 54000, 2200, 19],
  ["Finance News: Rate Decision", "What it means for mortgages.", "Finance", ["rates", "news"], "startupdeck", 480, 2200000, 45000, 3800, 0],
  ["Productivity: Theme Days", "Batching deep work by weekday.", "Productivity", ["themes", "calendar"], "mindmatters", 560, 1800000, 67000, 2600, 15],
  ["Entrepreneurship: First Hire", "When to stop doing everything.", "Entrepreneurship", ["hiring", "ops"], "startupdeck", 900, 1600000, 58000, 2400, 21],
  ["Motorcycle Safety Course Recap", "What MSF actually drills.", "Motorcycles", ["safety", "msf"], "drivelane", 860, 1200000, 42000, 1800, 29],
  ["Supercar Exhaust Comparison", "V8 vs V12 night cruise.", "Supercars", ["exhaust", "sound"], "drivelane", 500, 9800000, 378000, 14200, 6],
  ["Mountains: Solo Camp Checklist", "Leave-no-trace essentials.", "Mountains", ["camping", "solo"], "naturelens", 740, 2100000, 76000, 2900, 18],
  ["Forests: Fungi After Rain", "Macro world on the trail.", "Forests", ["fungi", "macro"], "naturelens", 560, 1700000, 61000, 2300, 24],
  ["Home Project: Accent Wall", "Paint, tape, and clean lines.", "Home Projects", ["paint", "diy"], "diyforge", 700, 1900000, 70000, 2800, 16],
  ["3D Printing: First Layer Fixes", "Bed level and adhesion myths.", "3D Printing", ["firstlayer", "fix"], "diyforge", 640, 1300000, 48000, 2100, 23],
  ["Interview: Game Audio Designer", "Foley, middleware, and deadlines.", "Interviews", ["audio", "games"], "podcasthq", 3000, 760000, 25000, 1200, 27, "video"],
  ["Storytelling: The Lost Passport", "Travel tale with a twist ending.", "Storytelling", ["travel", "story"], "podcasthq", 1500, 980000, 34000, 1600, 20, "video"],
  ["Kids: Dinosaur Facts Fast", "Big dinos, little attention spans.", "Learning Videos", ["dinosaurs", "kids"], "kidsspark", 300, 11200000, 189000, 5400, 12],
  ["Space Doc: Moon Bases Incoming", "Habitats, dust, and power.", "Space", ["moon", "doc"], "sciencehub", 1600, 3800000, 134000, 5600, 10],
  ["Nature Doc: Bee Superhighway", "How pollinators navigate cities.", "Nature", ["bees", "doc"], "naturelens", 1400, 2600000, 92000, 3400, 17],
];

const REEL_ENTRIES = [
  ["60-Second AI Tip: Better Prompts", "One change that upgrades answers.", "Tech Tips", ["reel", "ai"], "aiweekly", 58, 4200000, 189000, 2],
  ["Pasta Trick Chefs Use", "Salt timing that matters.", "Cooking", ["reel", "pasta"], "kitchenstories", 42, 8900000, 345000, 1],
  ["Tokyo Crossing Timelapse", "Shibuya energy in 20 seconds.", "Travel", ["reel", "tokyo"], "wanderdiaries", 22, 12100000, 456000, 3],
  ["Dad Joke That Slaps", "Clean and cursed in a good way.", "Comedy", ["reel", "joke"], "cinescope", 15, 15600000, 612000, 0],
  ["Life Hack: Cable Clips", "Desk chaos → calm.", "Life Hacks", ["reel", "desk"], "diyforge", 28, 3100000, 112000, 5],
  ["Quick Fact: Octopus Hearts", "Three hearts, blue blood.", "Quick Facts", ["reel", "ocean"], "sciencehub", 18, 6700000, 234000, 2],
  ["Motivational: Start Ugly", "Ship the draft.", "Motivational", ["reel", "mindset"], "mindmatters", 35, 5400000, 201000, 4],
  ["Music Clip: Neon Skies Hook", "Official 15s teaser.", "Music Clips", ["reel", "pop"], "melodymakers", 16, 9800000, 401000, 1],
  ["Football Skill: Fake Shot", "Street football tutorial.", "Football", ["reel", "skills"], "footballcentral", 24, 7200000, 267000, 3],
  ["Coding Tip: Early Return", "Flatten your conditionals.", "Tech Tips", ["reel", "code"], "pixelacademy", 32, 2800000, 98000, 6],
  ["Street Food: Cheese Pull", "ASMR-adjacent chaos.", "Cooking", ["reel", "cheese"], "kitchenstories", 19, 11200000, 423000, 2],
  ["Drone Reveal: Cliff Edge", "Don't look down.", "Travel", ["reel", "drone"], "naturelens", 21, 8100000, 312000, 4],
  ["Funny Pet Zoomies", "No context needed.", "Comedy", ["reel", "pets"], "cinescope", 14, 22100000, 890000, 0],
  ["Life Hack: Jar Opener", "Rubber band physics.", "Life Hacks", ["reel", "kitchen"], "kitchenstories", 17, 4500000, 167000, 5],
  ["Quick Fact: Speed of Light", "Coffee-cup scale analogy.", "Quick Facts", ["reel", "physics"], "sciencehub", 20, 3900000, 134000, 3],
  ["Motivational Gym Clip", "Last set energy.", "Motivational", ["reel", "gym"], "fitfuel", 26, 6100000, 223000, 2],
  ["Lo-Fi Hook 15s", "Rain + keys.", "Music Clips", ["reel", "lofi"], "lofilane", 15, 13400000, 501000, 1],
  ["Cricket Bat Flip Catch", "Boundary celebration.", "Cricket", ["reel", "cricket"], "cricketzone", 12, 8700000, 301000, 2],
  ["EV Acceleration Flex", "Silent punch.", "Electric Vehicles", ["reel", "ev"], "drivelane", 11, 5600000, 198000, 4],
  ["3D Print Fail → Fix", "Warping solved.", "3D Printing", ["reel", "print"], "diyforge", 29, 2100000, 78000, 7],
  ["News Bite: Chip News", "One chart, 20 seconds.", "Technology Updates", ["reel", "news"], "newswire", 23, 1800000, 42000, 0],
  ["Kids: Color Mixing", "Primary → secondary.", "Educational", ["reel", "kids"], "kidsspark", 27, 7200000, 145000, 5],
  ["Anime Reaction Face", "When the twist hits.", "Anime", ["reel", "anime"], "cinescope", 13, 9900000, 378000, 1],
  ["Study Timer Visual", "Pomodoro in motion.", "Productivity", ["reel", "focus"], "mindmatters", 25, 3300000, 112000, 4],
  ["F1 Overtake Microclip", "Millimetres matter.", "Formula 1", ["reel", "f1"], "footballcentral", 10, 11500000, 445000, 2],
  ["Gadget Unbox Teaser", "First look only.", "Gadgets", ["reel", "unbox"], "techverse", 18, 4700000, 167000, 3],
  ["Language Hack: Cognates", "Words you already know.", "Language Learning", ["reel", "spanish"], "mindmatters", 22, 2600000, 89000, 6],
  ["Wildlife: Fox Leap", "Snow pounce.", "Wildlife", ["reel", "fox"], "naturelens", 9, 10200000, 412000, 1],
  ["Startup Tip: Say No", "Focus as a feature.", "Startups", ["reel", "founder"], "startupdeck", 30, 1900000, 67000, 5],
  ["Minecraft Build Flex", "One block at a time.", "Minecraft", ["reel", "build"], "gamepulse", 16, 6800000, 234000, 2],
  ["Valorant Ace Clip", "Clean spray transfer.", "Valorant", ["reel", "ace"], "gamepulse", 14, 8900000, 334000, 1],
  ["Fashion: Scarf Knot", "30-second style upgrade.", "Fashion", ["reel", "style"], "wanderdiaries", 21, 2400000, 82000, 4],
  ["History: Pyramid Fact", "Not built by aliens.", "History", ["reel", "egypt"], "historyvault", 19, 5100000, 178000, 3],
  ["Chemistry: Color Change", "Acid-base indicator demo.", "Chemistry", ["reel", "chem"], "sciencehub", 24, 3600000, 123000, 4],
  ["Podcast Clip: Pricing", "Charge for outcomes.", "Business", ["reel", "podcast"], "podcasthq", 33, 1400000, 48000, 6],
  ["Ocean Wave Loop", "Brain reset button.", "Oceans", ["reel", "waves"], "naturelens", 15, 7600000, 267000, 2],
];

function slugify(text) {
  return String(text)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 48);
}

function daysAgoISO(days) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(12, 0, 0, 0);
  return d.toISOString();
}

function buildCatalog() {
  const titles = new Set();
  const thumbs = new Set();
  const videos = [];

  ENTRIES.forEach((row, i) => {
    const [title, description, category, tags, creator, duration, views, likes, comments, daysAgo, type = "video", music] = row;
    if (titles.has(title)) throw new Error(`Duplicate title: ${title}`);
    titles.add(title);
    const thumbSeed = `kinora-v${CATALOG_VERSION}-${i}-${slugify(title)}`;
    const thumbnailUrl = `https://picsum.photos/seed/${thumbSeed}/1280/720`;
    if (thumbs.has(thumbnailUrl)) throw new Error(`Duplicate thumb: ${thumbnailUrl}`);
    thumbs.add(thumbnailUrl);

    const video = {
      title,
      description,
      category,
      tags,
      creatorUsername: creator,
      duration,
      views,
      likesCount: likes,
      commentsCount: comments,
      createdAt: daysAgoISO(daysAgo),
      type: type === "reel" ? "reel" : "video",
      videoUrl: SAMPLE_MP4[i % SAMPLE_MP4.length],
      thumbnailUrl,
      catalog: true,
      catalogVersion: CATALOG_VERSION,
    };
    if (music) {
      video.artistName = music.artist;
      video.musicLabel = music.label;
      video.verifiedArtist = Boolean(music.verifiedArtist);
      video.isOfficialMusic = true;
    }
    videos.push(video);
  });

  REEL_ENTRIES.forEach((row, i) => {
    const [title, description, category, tags, creator, duration, views, likes, daysAgo] = row;
    if (titles.has(title)) throw new Error(`Duplicate reel title: ${title}`);
    titles.add(title);
    const thumbSeed = `kinora-r${CATALOG_VERSION}-${i}-${slugify(title)}`;
    const thumbnailUrl = `https://picsum.photos/seed/${thumbSeed}/720/1280`;
    thumbs.add(thumbnailUrl);
    videos.push({
      title,
      description,
      category,
      tags,
      creatorUsername: creator,
      duration,
      views,
      likesCount: likes,
      commentsCount: Math.floor(likes / 40),
      createdAt: daysAgoISO(daysAgo),
      type: "reel",
      videoUrl: SAMPLE_MP4[(i + 3) % SAMPLE_MP4.length],
      thumbnailUrl,
      catalog: true,
      catalogVersion: CATALOG_VERSION,
    });
  });

  return { version: CATALOG_VERSION, creators: CREATORS, videos };
}

module.exports = { CATALOG_VERSION, buildCatalog, CREATORS };
