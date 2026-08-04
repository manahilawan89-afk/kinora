import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { FiCheck } from "react-icons/fi";
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
        <div className="relative w-40 shrink-0 sm:w-48 md:w-56">
          <div className="aspect-video overflow-hidden rounded-xl bg-[#f2f2f2]">
            <MediaThumb
              thumbnailUrl={video.thumbnailUrl}
              videoUrl={video.videoUrl}
              className="h-full w-full object-cover"
            />
          </div>
          {video.duration > 0 && (
            <span className="absolute bottom-1.5 right-1.5 rounded bg-black/80 px-1 py-0.5 text-[11px] font-medium text-white">
              {formatDuration(video.duration)}
            </span>
          )}
        </div>
        <div className="min-w-0 flex-1 py-0.5">
          <h3 className="line-clamp-2 text-sm font-medium leading-snug text-[#0f0f0f] dark:text-zinc-50 sm:text-[15px]">
            {video.title}
          </h3>
          <p className="mt-1 flex items-center gap-1 text-xs text-[#606060] sm:text-sm">
            <span className="truncate">{video.owner?.fullName || video.owner?.username}</span>
            {video.owner?.isVerified && (
              <span className="inline-flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#065fd4] text-white">
                <FiCheck size={9} strokeWidth={3} />
              </span>
            )}
          </p>
          <p className="text-xs text-[#606060] sm:text-sm">
            {formatViews(video.views)} views · {timeAgo(video.createdAt)}
          </p>
        </div>
      </Link>
    );
  }

  return (
    <Link
      to={`/watch/${video._id}`}
      className="group block"
      onMouseEnter={startPreview}
      onMouseLeave={stopPreview}
    >
      <div className="relative aspect-video overflow-hidden rounded-xl bg-[#f2f2f2]">
        <div className={`absolute inset-0 transition duration-200 ${hovering ? "opacity-0" : "opacity-100"}`}>
          <MediaThumb
            thumbnailUrl={video.thumbnailUrl}
            videoUrl={video.videoUrl}
            className="h-full w-full object-cover"
          />
        </div>
        <video
          ref={previewRef}
          src={isYoutube ? undefined : videoSrc}
          muted
          playsInline
          preload="metadata"
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-200 ${
            hovering && !isYoutube ? "opacity-100" : "opacity-0"
          }`}
        />
        {video.duration > 0 && (
          <span className="absolute bottom-1.5 right-1.5 rounded bg-black/80 px-1.5 py-0.5 text-[11px] font-medium text-white">
            {formatDuration(video.duration)}
          </span>
        )}
      </div>
      <div className="mt-3 flex gap-3">
        <div className="h-9 w-9 shrink-0 overflow-hidden rounded-full bg-[#e5e5e5]">
          {video.owner?.avatar && (
            <img src={video.owner.avatar} alt="" className="h-full w-full object-cover" />
          )}
        </div>
        <div className="min-w-0">
          <h3 className="line-clamp-2 text-sm font-medium leading-snug text-[#0f0f0f] dark:text-zinc-50 sm:text-[15px]">
            {video.title}
          </h3>
          <p className="mt-1 flex items-center gap-1 text-sm text-[#606060]">
            <span className="truncate">{video.owner?.fullName || video.owner?.username}</span>
            {video.owner?.isVerified && (
              <span className="inline-flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full bg-[#065fd4] text-white">
                <FiCheck size={9} strokeWidth={3} />
              </span>
            )}
          </p>
          {video.artistName && (
            <p className="truncate text-xs text-[#606060]">
              {video.artistName}
              {video.musicLabel ? ` · ${video.musicLabel}` : ""}
            </p>
          )}
          <p className="text-sm text-[#606060]">
            {formatViews(video.views)} views · {timeAgo(video.createdAt)}
          </p>
        </div>
      </div>
    </Link>
  );
}
