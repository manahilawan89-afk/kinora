import { useState } from "react";
import { getMediaUrl, getYoutubeId, getYoutubeThumb } from "../../utils/format";

/** Shows thumbnail; prefers YouTube thumb, then image, then video frame. */
export default function MediaThumb({
  thumbnailUrl,
  videoUrl,
  alt = "",
  className = "h-full w-full object-cover",
}) {
  const ytThumb = getYoutubeThumb(videoUrl);
  const initial = ytThumb || thumbnailUrl ? "img" : videoUrl ? "video" : "fallback";
  const [mode, setMode] = useState(initial);
  const imgSrc = ytThumb || getMediaUrl(thumbnailUrl);

  if (mode === "img" && imgSrc) {
    return (
      <img
        src={imgSrc}
        alt={alt}
        className={className}
        loading="lazy"
        onError={() =>
          setMode(videoUrl && !getYoutubeId(videoUrl) ? "video" : "fallback")
        }
      />
    );
  }

  if (mode === "video" && videoUrl && !getYoutubeId(videoUrl)) {
    return (
      <video
        src={getMediaUrl(videoUrl)}
        muted
        playsInline
        preload="metadata"
        className={className}
        onLoadedData={(e) => {
          try {
            e.currentTarget.currentTime = Math.min(
              2,
              (e.currentTarget.duration || 4) / 3
            );
          } catch {
            /* ignore */
          }
        }}
        onError={() => setMode("fallback")}
      />
    );
  }

  return (
    <div
      className={`${className} flex items-center justify-center bg-gradient-to-br from-amber-800 via-zinc-900 to-stone-900 text-xs font-semibold text-white/70`}
    >
      Kinora
    </div>
  );
}
