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

        <div className="relative z-10 flex min-h-[44vh] flex-col justify-end px-3 pb-6 pt-10 sm:min-h-[48vh] sm:px-5 sm:pb-8 sm:pt-12 md:min-h-[52vh] md:px-8 md:pb-10">
          <div className="mb-2 inline-flex w-fit items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-teal-200 backdrop-blur">
            <span className="h-1 w-1 animate-pulse rounded-full bg-amber-400" />
            Kinora Originals
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
                <p className="text-xs text-zinc-500">Vertical heat — open the feed</p>
              </div>
              <Link
                to="/reels"
                className="inline-flex shrink-0 items-center gap-1 text-xs font-medium text-teal-700 dark:text-teal-300 sm:text-sm"
              >
                Open feed <FiArrowRight size={14} />
              </Link>
            </div>
            <div className="-mx-1 scrollbar-hide flex gap-2 overflow-x-auto px-1 pb-0.5">
              {reels.map((reel) => (
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
          <h2 className="font-brand mb-3 text-base font-semibold text-zinc-900 dark:text-white sm:text-lg">
            {activeCategory === "All" ? "Continue exploring" : activeCategory}
          </h2>

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
                <VideoCard key={video._id} video={video} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
