import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiFilm, FiPlay, FiArrowRight, FiPlus } from "react-icons/fi";
import api from "../../services/api";
import VideoCard from "../../components/video/VideoCard";
import MediaThumb from "../../components/common/MediaThumb";
import { formatViews, getMediaUrl, getYoutubeId, getYoutubeThumb } from "../../utils/format";

const CATEGORIES = ["All", "Anime", "Vlogs", "Animation", "Tech", "Sci-Fi", "Entertainment"];

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

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.get("/videos", { params: { type: "video" } }),
      api.get("/videos", { params: { type: "reel" } }),
    ])
      .then(([vids, rls]) => {
        setAllVideos(vids.data.data || []);
        setReels(rls.data.data || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const featured = allVideos[0] || null;

  const filtered = useMemo(() => {
    if (activeCategory === "All") return allVideos;
    const q = activeCategory.toLowerCase();
    return allVideos.filter(
      (v) =>
        v.category?.toLowerCase() === q ||
        v.tags?.some((t) => t.toLowerCase().includes(q)) ||
        v.title?.toLowerCase().includes(q)
    );
  }, [allVideos, activeCategory]);

  const poster = featured
    ? getYoutubeThumb(featured.videoUrl) || getMediaUrl(featured.thumbnailUrl)
    : "";
  const trailer =
    featured && !getYoutubeId(featured.videoUrl)
      ? getMediaUrl(featured.videoUrl)
      : "";

  return (
    <section className="-mx-4 -mt-4 md:-mx-6 md:-mt-6">
      {/* Full-bleed cinematic stage */}
      <div className="relative min-h-[72vh] w-full overflow-hidden bg-zinc-950 md:min-h-[78vh]">
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
            {poster && trailer && (
              <img
                src={poster}
                alt=""
                className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-40 mix-blend-lighten"
              />
            )}
          </>
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,#134e4a,transparent_50%),radial-gradient(ellipse_at_80%_10%,#78350f55,transparent_45%),#020617]" />
        )}

        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/75 to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#071412] via-transparent to-black/50" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_40%,transparent_0%,rgba(0,0,0,0.35)_70%)]" />

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="relative z-10 flex min-h-[72vh] flex-col justify-end px-5 pb-12 pt-16 md:min-h-[78vh] md:px-10 md:pb-16 lg:px-14"
        >
          <div className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-teal-200 backdrop-blur">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-400" />
            Kinora Originals
          </div>

          <h1 className="font-brand max-w-2xl text-4xl font-bold leading-[1.05] text-white drop-shadow-lg md:text-6xl lg:text-7xl">
            {featured?.title || "Press play on the night"}
          </h1>

          <p className="mt-4 max-w-lg text-base leading-relaxed text-zinc-200 md:text-lg">
            {featured?.description ||
              "Cinematic watches, addictive Reels, and playlists that stick — all in one feed."}
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            {featured && (
              <Link
                to={`/watch/${featured._id}`}
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-black transition hover:scale-[1.02] hover:bg-teal-50"
              >
                <FiPlay className="fill-black" /> Play
              </Link>
            )}
            <Link
              to="/reels"
              className="inline-flex items-center gap-2 rounded-full bg-teal-500/90 px-6 py-3 text-sm font-bold text-black transition hover:bg-teal-400"
            >
              <FiFilm /> Reels
            </Link>
            <Link
              to="/playlists"
              className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-black/30 px-5 py-3 text-sm font-semibold text-white backdrop-blur hover:bg-black/50"
            >
              <FiPlus /> My list
            </Link>
          </div>

          {featured && (
            <p className="mt-5 text-xs font-medium uppercase tracking-wider text-zinc-400">
              {featured.category || "Featured"} · {formatViews(featured.views)} views ·{" "}
              {featured.owner?.fullName || featured.owner?.username}
            </p>
          )}
        </motion.div>
      </div>

      {/* Content below — matches page theme */}
      <div className="space-y-10 bg-transparent px-4 py-8 md:px-6">
        {reels.length > 0 && (
          <div>
            <div className="mb-4 flex items-end justify-between">
              <div>
                <h2 className="font-brand text-xl font-semibold text-zinc-900 dark:text-white">
                  Reels drop
                </h2>
                <p className="text-sm text-zinc-500">Vertical heat — open the feed</p>
              </div>
              <Link
                to="/reels"
                className="inline-flex items-center gap-1 text-sm font-medium text-teal-700 dark:text-teal-300"
              >
                Open feed <FiArrowRight />
              </Link>
            </div>
            <div className="scrollbar-hide flex gap-3 overflow-x-auto pb-1">
              {reels.map((reel) => (
                <Link
                  key={reel._id}
                  to="/reels"
                  className="group relative h-64 w-40 shrink-0 overflow-hidden rounded-2xl shadow-lg ring-1 ring-zinc-200 dark:ring-white/10"
                >
                  <MediaThumb
                    thumbnailUrl={reel.thumbnailUrl}
                    videoUrl={reel.videoUrl}
                    className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />
                  <span className="absolute right-2 top-2 rounded-md bg-amber-400 px-1.5 py-0.5 text-[10px] font-bold text-black">
                    REEL
                  </span>
                  <div className="absolute bottom-3 left-3 right-3">
                    <p className="line-clamp-2 text-xs font-semibold text-white">
                      {reel.title}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="scrollbar-hide flex gap-2 overflow-x-auto">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${
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
          <h2 className="font-brand mb-5 text-xl font-semibold text-zinc-900 dark:text-white">
            {activeCategory === "All" ? "Continue exploring" : activeCategory}
          </h2>

          {loading ? (
            <div className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-video rounded-2xl bg-zinc-200 dark:bg-white/5" />
                  <div className="mt-3 h-4 w-3/4 rounded bg-zinc-200 dark:bg-white/5" />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <p className="text-zinc-500">Nothing in this category yet.</p>
          ) : (
            <div className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.map((video) => (
                <VideoCard key={video._id} video={video} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
