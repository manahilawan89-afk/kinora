import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiPlay, FiCheck } from "react-icons/fi";
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
        <div className="relative w-36 shrink-0 sm:w-44 md:w-52">
          <div className="aspect-video overflow-hidden rounded-lg bg-zinc-200 ring-1 ring-zinc-200 dark:bg-zinc-900 dark:ring-white/10 sm:rounded-xl">
            <MediaThumb
              thumbnailUrl={video.thumbnailUrl}
              videoUrl={video.videoUrl}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
          </div>
          {video.duration > 0 && (
            <span className="absolute bottom-1.5 right-1.5 rounded-md bg-black/80 px-1.5 py-0.5 text-[10px] font-medium text-white sm:text-[11px]">
              {formatDuration(video.duration)}
            </span>
          )}
        </div>
        <div className="min-w-0 flex-1 py-0.5">
          <h3 className="line-clamp-2 text-sm font-medium leading-snug text-zinc-900 transition group-hover:text-teal-700 dark:text-zinc-50 dark:group-hover:text-kinora-glow sm:text-base">
            {video.title}
          </h3>
          <p className="mt-1 truncate text-xs text-zinc-500 dark:text-zinc-400 sm:text-sm">
            <span className="inline-flex items-center gap-1">
              {video.owner?.fullName || video.owner?.username}
              {video.owner?.isVerified && (
                <span
                  className="inline-flex h-3.5 w-3.5 items-center justify-center rounded-full bg-teal-600 text-white"
                  title="Verified"
                >
                  <FiCheck size={9} strokeWidth={3} />
                </span>
              )}
            </span>
          </p>
          {video.artistName && (
            <p className="truncate text-[11px] text-zinc-500">
              {video.artistName}
              {video.verifiedArtist ? " · Verified Artist" : ""}
              {video.musicLabel ? ` · ${video.musicLabel}` : ""}
            </p>
          )}
          <p className="text-xs text-zinc-500 sm:text-sm">
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
        <div className="relative aspect-video overflow-hidden rounded-lg bg-zinc-200 shadow shadow-zinc-900/5 ring-1 ring-zinc-200 dark:bg-zinc-900 dark:ring-white/10">
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
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-kinora-teal/90 text-white shadow backdrop-blur">
              <FiPlay size={18} className="ml-0.5" />
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
        <div className="mt-2 flex gap-2">
          <div className="h-7 w-7 shrink-0 overflow-hidden rounded-full bg-zinc-800 ring-1 ring-kinora-teal/30">
            {video.owner?.avatar && (
              <img src={video.owner.avatar} alt="" className="h-full w-full object-cover" />
            )}
          </div>
          <div className="min-w-0">
            <h3 className="line-clamp-2 text-xs font-semibold leading-snug text-zinc-900 dark:text-zinc-50 sm:text-sm">
              {video.title}
            </h3>
            <p className="mt-1 flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400">
              <span className="truncate">
                {video.owner?.fullName || video.owner?.username}
              </span>
              {video.owner?.isVerified && (
                <span
                  className="inline-flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full bg-teal-600 text-white"
                  title="Verified"
                >
                  <FiCheck size={9} strokeWidth={3} />
                </span>
              )}
            </p>
            {video.artistName && (
              <p className="truncate text-[11px] text-zinc-500">
                Song · {video.artistName}
                {video.musicLabel ? ` · ${video.musicLabel}` : ""}
              </p>
            )}
            <p className="text-xs text-zinc-500">
              {formatViews(video.views)} views · {timeAgo(video.createdAt)}
            </p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
