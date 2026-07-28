import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiHeart,
  FiMessageCircle,
  FiVolume2,
  FiVolumeX,
  FiMusic,
} from "react-icons/fi";
import api from "../../services/api";
import { formatViews, getMediaUrl } from "../../utils/format";

function ReelCard({ reel, active, muted, onToggleMute }) {
  const videoRef = useRef(null);
  const user = useSelector((s) => s.auth.user);
  const navigate = useNavigate();
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(reel.likesCount || 0);
  const [burst, setBurst] = useState(false);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    if (active) {
      el.currentTime = 0;
      el.play().catch(() => {});
    } else {
      el.pause();
    }
  }, [active]);

  useEffect(() => {
    if (videoRef.current) videoRef.current.muted = muted;
  }, [muted]);

  async function handleLike() {
    if (!user) return navigate("/login");
    try {
      const { data } = await api.post(`/videos/${reel._id}/like`);
      setLiked(data.liked);
      setLikesCount(data.likesCount);
      if (data.liked) {
        setBurst(true);
        setTimeout(() => setBurst(false), 600);
      }
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="relative flex h-[calc(100dvh-3rem-3rem)] w-full snap-start snap-always items-center justify-center bg-black md:h-[calc(100dvh-3rem)]">
      <video
        ref={videoRef}
        src={getMediaUrl(reel.videoUrl)}
        className="absolute inset-0 h-full w-full object-contain"
        loop
        playsInline
        muted={muted}
        onClick={(e) => {
          const v = e.currentTarget;
          if (v.paused) v.play();
          else v.pause();
        }}
        onDoubleClick={handleLike}
      />

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40" />

      <AnimatePresence>
        {burst && (
          <motion.div
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1.2, opacity: 1 }}
            exit={{ scale: 1.6, opacity: 0 }}
            className="pointer-events-none absolute text-rose-400"
          >
            <FiHeart size={80} fill="currentColor" />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute bottom-16 left-3 right-16 z-10 text-white sm:bottom-20 sm:left-4 sm:right-20 md:bottom-12">
        <Link
          to={`/channel/${reel.owner?.username}`}
          className="pointer-events-auto mb-2 inline-flex items-center gap-2 sm:mb-3"
        >
          <span className="h-9 w-9 overflow-hidden rounded-full ring-2 ring-kinora-ember sm:h-10 sm:w-10">
            {reel.owner?.avatar && (
              <img src={reel.owner.avatar} alt="" className="h-full w-full object-cover" />
            )}
          </span>
          <span className="text-sm font-semibold sm:text-base">@{reel.owner?.username}</span>
        </Link>
        <h2 className="font-brand text-base font-semibold sm:text-lg">{reel.title}</h2>
        <p className="mt-1 line-clamp-2 text-sm text-white/75">{reel.description}</p>
        <p className="mt-2 flex items-center gap-2 text-xs text-kinora-glow sm:mt-3">
          <FiMusic size={14} className="animate-pulse" /> Original sound · Kinora Reels
        </p>
      </div>

      <div className="absolute bottom-20 right-2 z-10 flex flex-col items-center gap-4 text-white sm:bottom-28 sm:right-3 sm:gap-5 md:bottom-16 md:right-8">
        <button onClick={handleLike} className="flex flex-col items-center gap-1">
          <span
            className={`rounded-full bg-black/50 p-2.5 backdrop-blur sm:p-3 ${
              liked ? "text-rose-400" : ""
            }`}
          >
            <FiHeart size={24} fill={liked ? "currentColor" : "none"} />
          </span>
          <span className="text-xs font-medium">{formatViews(likesCount)}</span>
        </button>
        <div className="flex flex-col items-center gap-1">
          <span className="rounded-full bg-black/50 p-2.5 backdrop-blur sm:p-3">
            <FiMessageCircle size={24} />
          </span>
          <span className="text-xs">{formatViews(reel.commentsCount || 0)}</span>
        </div>
        <button
          onClick={onToggleMute}
          className="rounded-full bg-black/50 p-2.5 backdrop-blur sm:p-3"
          aria-label="Toggle mute"
        >
          {muted ? <FiVolumeX size={20} /> : <FiVolume2 size={20} />}
        </button>
      </div>

      <p className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[10px] text-white/40 sm:bottom-4 sm:text-[11px]">
        Swipe up · double-tap to like
      </p>
    </div>
  );
}

export default function ReelsPage() {
  const [reels, setReels] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [muted, setMuted] = useState(true);
  const containerRef = useRef(null);

  useEffect(() => {
    api
      .get("/videos", { params: { type: "reel" } })
      .then((res) => setReels(res.data.data || []))
      .catch(console.error);
  }, []);

  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;

    const items = [...root.querySelectorAll("[data-reel-index]")];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveIndex(Number(entry.target.dataset.reelIndex));
          }
        });
      },
      { root, threshold: 0.65 }
    );

    items.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [reels]);

  if (!reels.length) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-2 text-zinc-400">
        <p>No reels yet</p>
        <Link to="/upload" className="text-kinora-glow hover:underline">
          Upload the first one
        </Link>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="h-[calc(100dvh-3rem-3rem)] overflow-y-auto scroll-smooth snap-y snap-mandatory md:h-[calc(100dvh-3rem)]"
    >
      {reels.map((reel, index) => (
        <div key={reel._id} data-reel-index={index}>
          <ReelCard
            reel={reel}
            active={index === activeIndex}
            muted={muted}
            onToggleMute={() => setMuted((m) => !m)}
          />
        </div>
      ))}
    </div>
  );
}
