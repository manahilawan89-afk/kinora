import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiFilm, FiPlay, FiArrowRight, FiPlus, FiTrendingUp, FiShuffle } from "react-icons/fi";
import api from "../../services/api";
import VideoCard from "../../components/video/VideoCard";
import MediaThumb from "../../components/common/MediaThumb";
import { formatViews, getMediaUrl, getYoutubeId, getYoutubeThumb } from "../../utils/format";

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
  const q = category.toLowerCase();
  const aliases = CATEGORY_ALIASES[category] || [q];
  const hay = [
    video.category,
    ...(video.tags || []),
    video.title,
  ]
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

function AmbientVideo({ src, poster }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.muted = true;
    el.play().catch(() => {});
  }, [src]);

  return (
    <video
      ref={ref}
      src={src}
      poster={poster}
      muted
      loop
      playsInline
      autoPlay
      className="absolute inset-0 h-full w-full object-cover"
    />
  );
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
        setAllVideos(vids.data.data || []);
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

  const featured = trending[0] || allVideos[0] || null;

  const poster = featured
    ? getYoutubeThumb(featured.videoUrl) || getMediaUrl(featured.thumbnailUrl)
    : "";
  const trailer =
    featured && !getYoutubeId(featured.videoUrl)
      ? getMediaUrl(featured.videoUrl)
      : "";

  return (
    <section className="-mx-2 -mt-2 sm:-mx-3 sm:-mt-3 md:-mx-5 md:-mt-5">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="relative min-h-[44vh] w-full overflow-hidden bg-zinc-950 sm:min-h-[48vh] md:min-h-[52vh]"
      >
        {featured ? (
          <>
            {trailer ? (
              <AmbientVideo src={trailer} poster={poster} />
            ) : poster ? (
              <img
                src={poster}
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : null}
          </>
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,#134e4a,transparent_50%),radial-gradient(ellipse_at_80%_10%,#78350f55,transparent_45%),#020617]" />
        )}

        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/75 to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#071412] via-transparent to-black/50" />

        <div className="relative z-10 flex min-h-[44vh] flex-col justify-end px-3 pb-6 pt-10 sm:min-h-[48vh] sm:px-5 sm:pb-8 sm:pt-12 md:min-h-[52vh] md:px-8 md:pb-10">
          <div className="mb-2 inline-flex w-fit items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-teal-200 backdrop-blur">
            <span className="h-1 w-1 animate-pulse rounded-full bg-amber-400" />
            Trending now
          </div>

          <h1 className="font-brand max-w-lg text-xl font-bold leading-tight text-white sm:text-2xl md:text-3xl lg:text-4xl">
            {featured?.title || "Press play on the night"}
          </h1>

          <p className="mt-2 line-clamp-2 max-w-md text-xs text-zinc-200 sm:line-clamp-3 sm:text-sm">
            {featured?.description ||
              "Cinematic watches, addictive Reels, and playlists that stick — all in one feed."}
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-2 sm:mt-4">
            {featured && (
              <Link
                to={`/watch/${featured._id}`}
                className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 text-xs font-bold text-black hover:bg-teal-50 sm:px-4 sm:py-2 sm:text-sm"
              >
                <FiPlay className="fill-black" size={13} /> Play
              </Link>
            )}
            <Link
              to="/reels"
              className="inline-flex items-center gap-1.5 rounded-full bg-teal-500/90 px-3.5 py-1.5 text-xs font-bold text-black hover:bg-teal-400 sm:px-4 sm:py-2 sm:text-sm"
            >
              <FiFilm size={13} /> Reels
            </Link>
            <Link
              to="/playlists"
              className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-black/30 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur hover:bg-black/50 sm:px-3.5 sm:py-2 sm:text-sm"
            >
              <FiPlus size={13} /> My list
            </Link>
          </div>

          {featured && (
            <p className="mt-2.5 text-[10px] font-medium uppercase tracking-wider text-zinc-400 sm:text-[11px]">
              {featured.category || "Featured"} · {formatViews(featured.views)} views ·{" "}
              {featured.owner?.fullName || featured.owner?.username}
              {featured.owner?.isVerified ? " ✓" : ""}
            </p>
          )}
        </div>
      </motion.div>

      <div className="space-y-5 bg-transparent px-2 py-4 sm:space-y-6 sm:px-3 sm:py-6 md:px-5">
        {reels.length > 0 && (
          <div>
            <div className="mb-3 flex items-end justify-between gap-2">
              <div className="min-w-0">
                <h2 className="font-brand text-base font-semibold text-zinc-900 dark:text-white sm:text-lg">
                  Reels drop
                </h2>
                <p className="text-xs text-zinc-500">Shorts, tips, clips — open the feed</p>
              </div>
              <Link
                to="/reels"
                className="inline-flex shrink-0 items-center gap-1 text-xs font-medium text-teal-700 dark:text-teal-300 sm:text-sm"
              >
                Open feed <FiArrowRight size={14} />
              </Link>
            </div>
            <div className="-mx-1 scrollbar-hide flex gap-2 overflow-x-auto px-1 pb-0.5">
              {reelStrip.map((reel) => (
                <Link
                  key={reel._id}
                  to="/reels"
                  className="group relative h-44 w-28 shrink-0 overflow-hidden rounded-xl shadow ring-1 ring-zinc-200 dark:ring-white/10 sm:h-52 sm:w-32"
                >
                  <MediaThumb
                    thumbnailUrl={reel.thumbnailUrl}
                    videoUrl={reel.videoUrl}
                    className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />
                  <span className="absolute right-1.5 top-1.5 rounded bg-amber-400 px-1 py-0.5 text-[9px] font-bold text-black">
                    REEL
                  </span>
                  <div className="absolute bottom-2 left-2 right-2">
                    <p className="line-clamp-2 text-[11px] font-semibold text-white">
                      {reel.title}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {trending.length > 0 && activeCategory === "All" && (
          <div>
            <div className="mb-3 flex items-center gap-2">
              <FiTrendingUp className="text-amber-500" size={18} />
              <h2 className="font-brand text-base font-semibold text-zinc-900 dark:text-white sm:text-lg">
                Trending
              </h2>
              <span className="text-xs text-zinc-500">Millions of views · stable ranking</span>
            </div>
            <div className="grid grid-cols-2 gap-x-3 gap-y-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {trending.slice(0, 8).map((video) => (
                <VideoCard key={`trend-${video._id}`} video={video} />
              ))}
            </div>
          </div>
        )}

        <div className="-mx-1 scrollbar-hide flex gap-1.5 overflow-x-auto px-1 pb-0.5">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition sm:text-sm ${
                activeCategory === cat
                  ? "bg-zinc-900 text-white dark:bg-white dark:text-black"
                  : "bg-zinc-200/80 text-zinc-700 hover:bg-zinc-300 dark:bg-white/10 dark:text-zinc-300 dark:hover:bg-white/15"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div>
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h2 className="font-brand text-base font-semibold text-zinc-900 dark:text-white sm:text-lg">
              {activeCategory === "All"
                ? "Recommended for you"
                : activeCategory === "Trending"
                  ? "Trending on Kinora"
                  : activeCategory}
            </h2>
            {activeCategory === "All" && (
              <button
                type="button"
                onClick={() => setShuffleKey((k) => k + 1)}
                className="inline-flex items-center gap-1.5 rounded-full bg-zinc-200/80 px-3 py-1.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-300 dark:bg-white/10 dark:text-zinc-200 dark:hover:bg-white/15"
              >
                <FiShuffle size={13} /> Shuffle
              </button>
            )}
          </div>

          {loading ? (
            <div className="grid grid-cols-2 gap-x-3 gap-y-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-video rounded-lg bg-zinc-200 dark:bg-white/5" />
                  <div className="mt-2 h-3 w-3/4 rounded bg-zinc-200 dark:bg-white/5" />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <p className="text-sm text-zinc-500">Nothing in this category yet.</p>
          ) : (
            <div className="grid grid-cols-2 gap-x-3 gap-y-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.map((video) => (
                <VideoCard key={`${shuffleKey}-${video._id}`} video={video} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
