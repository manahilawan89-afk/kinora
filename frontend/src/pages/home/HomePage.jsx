import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FiArrowRight, FiShuffle, FiTrendingUp } from "react-icons/fi";
import api from "../../services/api";
import VideoCard from "../../components/video/VideoCard";
import MediaThumb from "../../components/common/MediaThumb";

const CATEGORIES = [
  "All",
  "Trending",
  "Music",
  "Billie Eilish",
  "Lana Del Rey",
  "Hindi",
  "Pakistan",
  "Dramas",
  "Lock Upp",
  "Turkish",
  "Novels",
  "Technology",
  "AI",
  "Programming",
  "Education",
  "Gaming",
  "Sports",
  "Travel",
  "Cooking",
  "Science",
  "Movies",
  "Anime",
  "News",
  "Kids",
  "Documentaries",
];

const CATEGORY_ALIASES = {
  Technology: ["ai", "programming", "web development", "cyber security", "gadgets", "smartphones", "robotics", "space technology", "technology", "tech", "technology updates"],
  Education: ["mathematics", "science", "physics", "chemistry", "biology", "history", "geography", "economics", "psychology", "language learning", "educational", "learning videos"],
  Music: ["pop", "hip-hop", "rock", "classical", "jazz", "lo-fi", "edm", "k-pop", "bollywood songs", "coke studio", "instrumentals", "live concerts", "acoustic sessions", "trending songs", "official music videos", "music clips", "billie", "lana", "hindi", "pakistan"],
  "Billie Eilish": ["billie", "eilish"],
  "Lana Del Rey": ["lana", "delrey", "del rey"],
  Hindi: ["hindi", "bollywood"],
  Pakistan: ["pakistan", "pakistani", "cokestudio", "pasoori"],
  Dramas: ["pakistani dramas", "turkish dramas", "drama", "terebin", "dizi"],
  "Lock Upp": ["lockup", "lock upp", "reality"],
  Turkish: ["turkish", "dizi", "ertugrul", "sencalkapimi"],
  Novels: ["novel", "novels", "urdu", "book", "audiobook"],
  Gaming: ["minecraft", "gta", "valorant", "cs2", "pubg", "fortnite", "mobile games", "game reviews", "walkthroughs", "esports"],
  Sports: ["football", "cricket", "basketball", "tennis", "formula 1", "ufc", "wwe", "olympics", "highlights", "analysis"],
  Travel: ["travel", "food", "daily vlogs"],
  Cooking: ["cooking", "food"],
  Science: ["science", "physics", "chemistry", "biology", "science news", "space", "space technology"],
  Movies: ["movies", "tv shows", "comedy", "animation", "anime", "cartoons"],
  Anime: ["anime", "cartoons", "animation"],
  News: ["world news", "science news", "technology updates", "news"],
  Kids: ["educational", "nursery rhymes", "learning videos"],
  Documentaries: ["space", "ancient civilizations", "crime", "nature", "technology", "wildlife", "oceans", "forests"],
};

function matchesCategory(video, category) {
  if (category === "All" || category === "Trending") return true;
  const aliases = CATEGORY_ALIASES[category] || [category.toLowerCase()];
  const hay = [video.category, ...(video.tags || []), video.title, video.artistName]
    .filter(Boolean)
    .map((s) => String(s).toLowerCase());
  return aliases.some((alias) => hay.some((h) => h.includes(alias) || alias.includes(h)));
}

function shuffle(list) {
  const arr = [...list];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function diversify(list, limit = 48) {
  const byCat = new Map();
  for (const v of list) {
    const key = v.category || "general";
    if (!byCat.has(key)) byCat.set(key, []);
    byCat.get(key).push(v);
  }
  const queues = [...byCat.values()].map((items) => [...items]);
  const out = [];
  let guard = 0;
  while (out.length < limit && queues.some((q) => q.length) && guard < 5000) {
    guard += 1;
    for (const q of queues) {
      if (q.length && out.length < limit) out.push(q.shift());
    }
  }
  return out;
}

export default function HomePage() {
  const [allVideos, setAllVideos] = useState([]);
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [shuffleKey, setShuffleKey] = useState(0);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.get("/videos", { params: { type: "video" } }),
      api.get("/videos", { params: { type: "reel" } }),
    ])
      .then(([vids, rls]) => {
        const cleaned = (vids.data.data || []).filter(
          (v) =>
            !String(v.owner?.username || "").toLowerCase().includes("ducky") &&
            !String(v.owner?.fullName || "").toLowerCase().includes("ducky") &&
            !String(v.title || "").toLowerCase().includes("ducky")
        );
        setAllVideos(cleaned);
        setReels(rls.data.data || []);
        setShuffleKey((k) => k + 1);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const trending = useMemo(() => {
    return [...allVideos]
      .filter((v) => (v.views || 0) >= 1_000_000)
      .sort((a, b) => (b.views || 0) - (a.views || 0))
      .slice(0, 16);
  }, [allVideos]);

  const recommended = useMemo(() => {
    const trendingIds = new Set(trending.slice(0, 8).map((v) => v._id));
    const pool = allVideos.filter((v) => !trendingIds.has(v._id));
    return diversify(shuffle(pool), 40);
  }, [allVideos, trending, shuffleKey]);

  const reelStrip = useMemo(() => shuffle(reels).slice(0, 16), [reels, shuffleKey]);

  const filtered = useMemo(() => {
    if (activeCategory === "Trending") return trending;
    if (activeCategory === "All") return recommended;
    return diversify(
      shuffle(allVideos.filter((v) => matchesCategory(v, activeCategory))),
      48
    );
  }, [activeCategory, allVideos, recommended, trending, shuffleKey]);

  return (
    <section className="mx-auto w-full max-w-[1800px]">
      <div className="scrollbar-hide -mx-1 mb-4 flex gap-2 overflow-x-auto px-1 pb-1">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`shrink-0 rounded-lg px-3 py-1.5 text-sm font-medium transition ${
              activeCategory === cat
                ? "bg-[#0f0f0f] text-white dark:bg-white dark:text-black"
                : "bg-[#f2f2f2] text-[#0f0f0f] hover:bg-[#e5e5e5] dark:bg-white/10 dark:text-zinc-200 dark:hover:bg-white/15"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {reels.length > 0 && activeCategory === "All" && (
        <div className="mb-8">
          <div className="mb-3 flex items-end justify-between gap-2">
            <h2 className="text-lg font-semibold text-[#0f0f0f] dark:text-white">Shorts</h2>
            <Link
              to="/reels"
              className="inline-flex items-center gap-1 text-sm font-medium text-[#065fd4]"
            >
              View all <FiArrowRight size={14} />
            </Link>
          </div>
          <div className="scrollbar-hide -mx-1 flex gap-3 overflow-x-auto px-1 pb-1">
            {reelStrip.map((reel) => (
              <Link
                key={reel._id}
                to="/reels"
                className="group relative h-64 w-36 shrink-0 overflow-hidden rounded-xl bg-[#f2f2f2]"
              >
                <MediaThumb
                  thumbnailUrl={reel.thumbnailUrl}
                  videoUrl={reel.videoUrl}
                  className="absolute inset-0 h-full w-full object-cover transition duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <p className="absolute bottom-2 left-2 right-2 line-clamp-2 text-xs font-semibold text-white">
                  {reel.title}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {trending.length > 0 && activeCategory === "All" && (
        <div className="mb-8">
          <div className="mb-3 flex items-center gap-2">
            <FiTrendingUp className="text-[#0f0f0f] dark:text-white" size={18} />
            <h2 className="text-lg font-semibold text-[#0f0f0f] dark:text-white">Trending</h2>
          </div>
          <div className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {trending.slice(0, 8).map((video) => (
              <VideoCard key={`trend-${video._id}`} video={video} />
            ))}
          </div>
        </div>
      )}

      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-lg font-semibold text-[#0f0f0f] dark:text-white">
          {activeCategory === "All"
            ? "Recommended"
            : activeCategory === "Trending"
              ? "Trending"
              : activeCategory}
        </h2>
        {activeCategory === "All" && (
          <button
            type="button"
            onClick={() => setShuffleKey((k) => k + 1)}
            className="inline-flex items-center gap-1.5 rounded-full bg-[#f2f2f2] px-3 py-1.5 text-sm font-medium text-[#0f0f0f] hover:bg-[#e5e5e5] dark:bg-white/10 dark:text-zinc-100"
          >
            <FiShuffle size={13} /> Shuffle
          </button>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-video rounded-xl bg-[#f2f2f2] dark:bg-white/5" />
              <div className="mt-3 h-3 w-3/4 rounded bg-[#f2f2f2] dark:bg-white/5" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <p className="text-sm text-[#606060]">Nothing in this category yet.</p>
      ) : (
        <div className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((video) => (
            <VideoCard key={`${shuffleKey}-${video._id}`} video={video} />
          ))}
        </div>
      )}
    </section>
  );
}
