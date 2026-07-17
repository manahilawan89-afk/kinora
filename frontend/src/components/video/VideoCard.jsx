import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiPlay } from "react-icons/fi";
import { formatViews, formatDuration, timeAgo, getMediaUrl, getYoutubeId } from "../../utils/format";
import MediaThumb from "../common/MediaThumb";

export default function VideoCard({ video, layout = "grid" }) {
  const videoSrc = getMediaUrl(video.videoUrl);
  const isYoutube = Boolean(getYoutubeId(video.videoUrl));
  const previewRef = useRef(null);
  const [hovering, setHovering] = useState(false);

  function startPreview() {
    if (isYoutube) return;
    setHovering(true);
    const el = previewRef.current;
    if (!el) return;
    el.currentTime = 1;
    el.play().catch(() => {});
  }

  function stopPreview() {
    setHovering(false);
    const el = previewRef.current;
    if (!el) return;
    el.pause();
    el.currentTime = 0;
  }

  if (layout === "list") {
    return (
      <Link to={`/watch/${video._id}`} className="group flex gap-3">
        <div className="relative w-44 shrink-0 sm:w-52">
          <div className="aspect-video overflow-hidden rounded-xl bg-zinc-200 ring-1 ring-zinc-200 dark:bg-zinc-900 dark:ring-white/10">
            <MediaThumb
              thumbnailUrl={video.thumbnailUrl}
              videoUrl={video.videoUrl}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
          </div>
          {video.duration > 0 && (
            <span className="absolute bottom-1.5 right-1.5 rounded-md bg-black/80 px-1.5 py-0.5 text-[11px] font-medium text-white">
              {formatDuration(video.duration)}
            </span>
          )}
        </div>
        <div className="min-w-0 flex-1 py-0.5">
          <h3 className="line-clamp-2 font-medium leading-snug text-zinc-900 transition group-hover:text-teal-700 dark:text-zinc-50 dark:group-hover:text-kinora-glow">
            {video.title}
          </h3>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            {video.owner?.fullName || video.owner?.username}
          </p>
          <p className="text-sm text-zinc-500">
            {formatViews(video.views)} views · {timeAgo(video.createdAt)}
          </p>
        </div>
      </Link>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.35 }}
    >
      <Link
        to={`/watch/${video._id}`}
        className="group block"
        onMouseEnter={startPreview}
        onMouseLeave={stopPreview}
      >
        <div className="relative aspect-video overflow-hidden rounded-2xl bg-zinc-200 shadow-lg shadow-zinc-900/10 ring-1 ring-zinc-200 dark:bg-zinc-900 dark:shadow-[0_12px_40px_rgba(0,0,0,0.35)] dark:ring-white/10">
          <div className={`absolute inset-0 transition duration-300 ${hovering ? "opacity-0" : "opacity-100"}`}>
            <MediaThumb
              thumbnailUrl={video.thumbnailUrl}
              videoUrl={video.videoUrl}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
          </div>
          <video
            ref={previewRef}
            src={isYoutube ? undefined : videoSrc}
            muted
            playsInline
            preload="metadata"
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${
              hovering && !isYoutube ? "opacity-100" : "opacity-0"
            }`}
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-80" />
          <div
            className={`absolute inset-0 flex items-center justify-center transition ${
              hovering ? "opacity-0" : "opacity-0 group-hover:opacity-100"
            }`}
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-kinora-teal/90 text-white shadow-lg backdrop-blur">
              <FiPlay size={22} className="ml-0.5" />
            </span>
          </div>
          {video.duration > 0 && (
            <span className="absolute bottom-2 right-2 rounded-md bg-black/75 px-1.5 py-0.5 text-[11px] font-semibold text-white">
              {formatDuration(video.duration)}
            </span>
          )}
          {hovering && (
            <span className="absolute left-2 top-2 rounded-full bg-kinora-ember px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-black">
              Preview
            </span>
          )}
        </div>
        <div className="mt-3 flex gap-3">
          <div className="h-9 w-9 shrink-0 overflow-hidden rounded-full bg-zinc-800 ring-2 ring-kinora-teal/30">
            {video.owner?.avatar && (
              <img src={video.owner.avatar} alt="" className="h-full w-full object-cover" />
            )}
          </div>
          <div className="min-w-0">
            <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-zinc-900 dark:text-zinc-50">
              {video.title}
            </h3>
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              {video.owner?.fullName || video.owner?.username}
            </p>
            <p className="text-xs text-zinc-500">
              {formatViews(video.views)} views · {timeAgo(video.createdAt)}
            </p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
