import { useCallback, useEffect, useRef, useState } from "react";
import {
  FiCheck,
  FiMaximize,
  FiMinimize,
  FiPause,
  FiPlay,
  FiSettings,
  FiVolume1,
  FiVolume2,
  FiVolumeX,
} from "react-icons/fi";
import { formatDuration } from "../../utils/format";

const SPEEDS = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];
const SKIP_SECONDS = 15;

/** Working public demo streams (Google sample bucket is 403 now). */
const FALLBACK_SOURCES = [
  "https://www.w3schools.com/html/mov_bbb.mp4",
  "https://www.w3schools.com/html/movie.mp4",
  "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
  "https://samplelib.com/lib/preview/mp4/sample-10s.mp4",
  "https://samplelib.com/lib/preview/mp4/sample-15s.mp4",
  "https://samplelib.com/lib/preview/mp4/sample-30s.mp4",
];

function resolvePlayableSrc(src = "") {
  if (!src) return FALLBACK_SOURCES[0];
  const broken =
    src.includes("gtv-videos-bucket") ||
    src.includes("download.blender.org") ||
    src.includes("commondatastorage.googleapis.com/gtv-videos-bucket");
  if (broken) {
    let hash = 0;
    for (let i = 0; i < src.length; i += 1) hash = (hash + src.charCodeAt(i) * (i + 1)) % FALLBACK_SOURCES.length;
    return FALLBACK_SOURCES[hash];
  }
  return src;
}

function SkipIcon({ direction = "forward", seconds = 15 }) {
  const isBack = direction === "back";
  return (
    <span className="relative inline-flex h-9 w-9 items-center justify-center">
      <svg
        viewBox="0 0 24 24"
        className={`h-[22px] w-[22px] ${isBack ? "-scale-x-100" : ""}`}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M3 12a9 9 0 1 0 9-9" />
        <path d="M3 4v5h5" />
      </svg>
      <span className="pointer-events-none absolute inset-0 flex items-center justify-center pt-0.5 text-[9px] font-bold leading-none tracking-tight">
        {seconds}
      </span>
    </span>
  );
}

function MenuPanel({ title, children, align = "right" }) {
  return (
    <div
      className={`absolute bottom-full mb-3 min-w-[11.5rem] overflow-hidden rounded-xl border border-white/10 bg-[#0c1211]/95 shadow-2xl shadow-black/50 backdrop-blur-xl ${
        align === "right" ? "right-0" : "left-0"
      }`}
      role="menu"
    >
      <div className="border-b border-white/10 px-3.5 py-2.5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/45">
          {title}
        </p>
      </div>
      <div className="max-h-56 overflow-y-auto py-1.5">{children}</div>
    </div>
  );
}

function MenuItem({ active, onClick, children }) {
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onClick}
      className={`flex w-full items-center gap-2.5 px-3.5 py-2 text-left text-[13px] transition ${
        active
          ? "bg-teal-500/15 text-teal-200"
          : "text-white/85 hover:bg-white/[0.06] hover:text-white"
      }`}
    >
      <span className="flex h-4 w-4 shrink-0 items-center justify-center">
        {active ? <FiCheck size={14} strokeWidth={2.5} /> : null}
      </span>
      <span className="flex-1">{children}</span>
    </button>
  );
}

export default function VideoPlayer({
  src,
  title = "Video",
  autoPlay = true,
  subtitles = [],
  className = "",
}) {
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const hideTimerRef = useRef(null);
  const flashTimerRef = useRef(null);
  const progressRef = useRef(null);

  const [playing, setPlaying] = useState(autoPlay);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [fullscreen, setFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [activeMenu, setActiveMenu] = useState(null);
  const [activeTrack, setActiveTrack] = useState(-1);
  const [hoverProgress, setHoverProgress] = useState(null);
  const [seeking, setSeeking] = useState(false);
  const [flash, setFlash] = useState(null);
  const [volumeOpen, setVolumeOpen] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [activeSrc, setActiveSrc] = useState(() => resolvePlayableSrc(src));
  const fallbackIndexRef = useRef(0);

  const subtitleTracks = subtitles || [];
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const bufferPct = duration > 0 ? (buffered / duration) * 100 : 0;

  const revealControls = useCallback(() => {
    setShowControls(true);
    clearTimeout(hideTimerRef.current);
    if (videoRef.current && !videoRef.current.paused && !activeMenu) {
      hideTimerRef.current = setTimeout(() => setShowControls(false), 2800);
    }
  }, [activeMenu]);

  const showFlash = useCallback((type) => {
    setFlash(type);
    clearTimeout(flashTimerRef.current);
    flashTimerRef.current = setTimeout(() => setFlash(null), 650);
  }, []);

  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().catch(() => {});
      showFlash("play");
    } else {
      video.pause();
      showFlash("pause");
    }
  }, [showFlash]);

  const skip = useCallback(
    (delta) => {
      const video = videoRef.current;
      if (!video) return;
      const next = Math.min(Math.max(video.currentTime + delta, 0), video.duration || 0);
      video.currentTime = next;
      setCurrentTime(next);
      showFlash(delta < 0 ? "back" : "forward");
      revealControls();
    },
    [revealControls, showFlash]
  );

  const seekToRatio = useCallback(
    (clientX) => {
      const bar = progressRef.current;
      const video = videoRef.current;
      if (!bar || !video || !duration) return;
      const rect = bar.getBoundingClientRect();
      const ratio = Math.min(Math.max((clientX - rect.left) / rect.width, 0), 1);
      const next = ratio * duration;
      video.currentTime = next;
      setCurrentTime(next);
    },
    [duration]
  );

  const changeSpeed = useCallback((nextSpeed) => {
    const video = videoRef.current;
    if (!video) return;
    video.playbackRate = nextSpeed;
    setSpeed(nextSpeed);
    setActiveMenu(null);
  }, []);

  const selectSubtitle = useCallback((trackIndex) => {
    const video = videoRef.current;
    if (!video?.textTracks) return;
    for (let i = 0; i < video.textTracks.length; i += 1) {
      video.textTracks[i].mode = i === trackIndex ? "showing" : "hidden";
    }
    setActiveTrack(trackIndex);
    setActiveMenu(null);
  }, []);

  const toggleFullscreen = useCallback(async () => {
    const container = containerRef.current;
    if (!container) return;
    if (!document.fullscreenElement) {
      await container.requestFullscreen?.();
    } else {
      await document.exitFullscreen?.();
    }
  }, []);

  const toggleMute = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onPlay = () => {
      setPlaying(true);
      revealControls();
    };
    const onPause = () => {
      setPlaying(false);
      setShowControls(true);
      clearTimeout(hideTimerRef.current);
    };
    const onTimeUpdate = () => {
      if (!seeking) setCurrentTime(video.currentTime);
      if (video.buffered?.length) {
        try {
          setBuffered(video.buffered.end(video.buffered.length - 1));
        } catch {
          /* ignore */
        }
      }
    };
    const onLoadedMetadata = () => {
      setLoadError(false);
      setDuration(video.duration || 0);
      video.playbackRate = speed;
      const defaultIndex = subtitleTracks.findIndex((track) => track.default);
      if (defaultIndex >= 0) {
        for (let i = 0; i < video.textTracks.length; i += 1) {
          video.textTracks[i].mode = i === defaultIndex ? "showing" : "hidden";
        }
        setActiveTrack(defaultIndex);
      } else {
        for (let i = 0; i < video.textTracks.length; i += 1) {
          video.textTracks[i].mode = "hidden";
        }
      }
      if (autoPlay) {
        video.muted = true;
        setMuted(true);
        video.play().catch(() => {});
      }
    };
    const onVolumeChange = () => {
      setVolume(video.volume);
      setMuted(video.muted);
    };
    const onEnded = () => {
      setPlaying(false);
      setShowControls(true);
    };
    const onError = () => {
      const next = (fallbackIndexRef.current + 1) % FALLBACK_SOURCES.length;
      fallbackIndexRef.current = next;
      const candidate = FALLBACK_SOURCES[next];
      if (candidate && candidate !== video.currentSrc) {
        setActiveSrc(candidate);
        setLoadError(false);
        return;
      }
      setLoadError(true);
      setPlaying(false);
      setShowControls(true);
    };

    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);
    video.addEventListener("timeupdate", onTimeUpdate);
    video.addEventListener("loadedmetadata", onLoadedMetadata);
    video.addEventListener("volumechange", onVolumeChange);
    video.addEventListener("ended", onEnded);
    video.addEventListener("progress", onTimeUpdate);
    video.addEventListener("error", onError);

    return () => {
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
      video.removeEventListener("timeupdate", onTimeUpdate);
      video.removeEventListener("loadedmetadata", onLoadedMetadata);
      video.removeEventListener("volumechange", onVolumeChange);
      video.removeEventListener("ended", onEnded);
      video.removeEventListener("progress", onTimeUpdate);
      video.removeEventListener("error", onError);
    };
  }, [autoPlay, revealControls, seeking, speed, activeSrc, subtitleTracks]);

  useEffect(() => {
    fallbackIndexRef.current = 0;
    setActiveSrc(resolvePlayableSrc(src));
    setLoadError(false);
    setCurrentTime(0);
    setDuration(0);
    setBuffered(0);
    setActiveMenu(null);
    setActiveTrack(-1);
    setFlash(null);
  }, [src]);

  useEffect(() => {
    const onFullscreenChange = () => {
      setFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, []);

  useEffect(() => {
    const onKeyDown = (e) => {
      const tag = e.target?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || e.target?.isContentEditable) return;

      if (e.key === " " || e.key === "k") {
        e.preventDefault();
        togglePlay();
      } else if (e.key === "ArrowLeft" || e.key === "j") {
        e.preventDefault();
        skip(-SKIP_SECONDS);
      } else if (e.key === "ArrowRight" || e.key === "l") {
        e.preventDefault();
        skip(SKIP_SECONDS);
      } else if (e.key === "f") {
        e.preventDefault();
        toggleFullscreen();
      } else if (e.key === "m") {
        e.preventDefault();
        toggleMute();
      } else if (e.key === "c") {
        e.preventDefault();
        if (!subtitleTracks.length) return;
        selectSubtitle(activeTrack >= 0 ? -1 : 0);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [
    activeTrack,
    selectSubtitle,
    skip,
    subtitleTracks.length,
    toggleFullscreen,
    toggleMute,
    togglePlay,
  ]);

  useEffect(() => {
    if (activeMenu) {
      setShowControls(true);
      clearTimeout(hideTimerRef.current);
    }
  }, [activeMenu]);

  useEffect(() => {
    return () => {
      clearTimeout(hideTimerRef.current);
      clearTimeout(flashTimerRef.current);
    };
  }, []);

  const volumeIcon =
    muted || volume === 0 ? (
      <FiVolumeX size={20} />
    ) : volume < 0.5 ? (
      <FiVolume1 size={20} />
    ) : (
      <FiVolume2 size={20} />
    );

  const controlsVisible = showControls || Boolean(activeMenu) || seeking;

  return (
    <div
      ref={containerRef}
      className={`kinora-player group relative h-full w-full overflow-hidden bg-black ${className}`}
      onMouseMove={revealControls}
      onMouseLeave={() => {
        if (playing && !activeMenu) setShowControls(false);
        setVolumeOpen(false);
      }}
      onClick={() => setActiveMenu(null)}
    >
      <video
        ref={videoRef}
        key={activeSrc}
        src={activeSrc}
        title={title}
        playsInline
        preload="metadata"
        className="h-full w-full object-contain"
        onClick={(e) => {
          e.stopPropagation();
          if (activeMenu) {
            setActiveMenu(null);
            return;
          }
          togglePlay();
        }}
        onDoubleClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleFullscreen();
        }}
      >
        {subtitleTracks.map((track, index) => (
          <track
            key={`${track.src}-${track.lang || index}`}
            kind="subtitles"
            src={track.src}
            srcLang={track.lang || "en"}
            label={track.label || track.lang || "Subtitles"}
            default={track.default}
          />
        ))}
      </video>

      {loadError && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-3 bg-black/80 px-4 text-center">
          <p className="text-sm font-medium text-white">Video couldn’t load</p>
          <button
            type="button"
            className="rounded-full bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-500"
            onClick={(e) => {
              e.stopPropagation();
              fallbackIndexRef.current = 0;
              setActiveSrc(FALLBACK_SOURCES[0]);
              setLoadError(false);
            }}
          >
            Try again
          </button>
        </div>
      )}

      {/* Ambient gradients */}
      <div
        className={`pointer-events-none absolute inset-0 transition-opacity duration-300 ${
          controlsVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/70 via-black/25 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-black/90 via-black/45 to-transparent" />
      </div>

      {/* Title */}
      <div
        className={`pointer-events-none absolute inset-x-0 top-0 z-10 px-4 pt-4 transition-all duration-300 sm:px-5 sm:pt-5 ${
          controlsVisible ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"
        }`}
      >
        <p className="font-brand truncate text-sm font-semibold tracking-tight text-white/95 drop-shadow sm:text-[15px]">
          {title}
        </p>
      </div>

      {/* Center flash feedback */}
      <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
        <div
          key={flash}
          className={`flex h-16 w-16 items-center justify-center rounded-full bg-black/55 text-white shadow-xl backdrop-blur-md transition ${
            flash ? "animate-player-pop opacity-100" : "scale-90 opacity-0"
          }`}
        >
          {flash === "play" && <FiPlay size={28} className="ml-0.5" />}
          {flash === "pause" && <FiPause size={28} />}
          {flash === "back" && <SkipIcon direction="back" seconds={SKIP_SECONDS} />}
          {flash === "forward" && <SkipIcon direction="forward" seconds={SKIP_SECONDS} />}
        </div>
      </div>

      {/* Big center play when paused */}
      {!playing && !flash && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            togglePlay();
          }}
          className="absolute left-1/2 top-1/2 z-20 flex h-[4.25rem] w-[4.25rem] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-teal-600/90 text-white shadow-[0_12px_40px_rgba(15,118,110,0.45)] ring-1 ring-white/20 transition hover:scale-105 hover:bg-teal-500"
          aria-label="Play"
        >
          <FiPlay size={32} className="ml-1" />
        </button>
      )}

      {/* Controls */}
      <div
        className={`absolute inset-x-0 bottom-0 z-30 px-3 pb-3 pt-8 transition-all duration-300 sm:px-4 sm:pb-4 ${
          controlsVisible
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-2 opacity-0"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Progress */}
        <div
          ref={progressRef}
          className="group/progress relative mb-3.5 h-1.5 cursor-pointer rounded-full sm:mb-4"
          onMouseMove={(e) => {
            const bar = progressRef.current;
            if (!bar || !duration) return;
            const rect = bar.getBoundingClientRect();
            const ratio = Math.min(Math.max((e.clientX - rect.left) / rect.width, 0), 1);
            setHoverProgress({ ratio, time: ratio * duration, x: ratio * 100 });
          }}
          onMouseLeave={() => !seeking && setHoverProgress(null)}
          onMouseDown={(e) => {
            setSeeking(true);
            seekToRatio(e.clientX);
            const onMove = (ev) => seekToRatio(ev.clientX);
            const onUp = () => {
              setSeeking(false);
              window.removeEventListener("mousemove", onMove);
              window.removeEventListener("mouseup", onUp);
            };
            window.addEventListener("mousemove", onMove);
            window.addEventListener("mouseup", onUp);
          }}
        >
          <div className="absolute inset-0 overflow-hidden rounded-full bg-white/20 transition-[height] group-hover/progress:h-2 group-hover/progress:-top-0.5">
            <div
              className="absolute inset-y-0 left-0 bg-white/30"
              style={{ width: `${bufferPct}%` }}
            />
            <div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-teal-500 to-teal-400"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div
            className="absolute top-1/2 h-3.5 w-3.5 -translate-y-1/2 rounded-full bg-teal-300 opacity-0 shadow-md ring-2 ring-teal-500/40 transition group-hover/progress:opacity-100"
            style={{ left: `calc(${progress}% - 7px)` }}
          />
          {hoverProgress && (
            <div
              className="pointer-events-none absolute -top-8 -translate-x-1/2 rounded-md bg-black/85 px-2 py-1 text-[11px] font-medium text-white shadow-lg"
              style={{ left: `${hoverProgress.x}%` }}
            >
              {formatDuration(hoverProgress.time)}
            </div>
          )}
        </div>

        <div className="flex items-center gap-0.5 sm:gap-1">
          {/* Left cluster */}
          <button
            type="button"
            onClick={togglePlay}
            className="player-btn"
            aria-label={playing ? "Pause" : "Play"}
          >
            {playing ? <FiPause size={20} /> : <FiPlay size={20} className="ml-0.5" />}
          </button>

          <button
            type="button"
            onClick={() => skip(-SKIP_SECONDS)}
            className="player-btn"
            aria-label={`Rewind ${SKIP_SECONDS} seconds`}
          >
            <SkipIcon direction="back" seconds={SKIP_SECONDS} />
          </button>

          <button
            type="button"
            onClick={() => skip(SKIP_SECONDS)}
            className="player-btn"
            aria-label={`Forward ${SKIP_SECONDS} seconds`}
          >
            <SkipIcon direction="forward" seconds={SKIP_SECONDS} />
          </button>

          <div
            className="group/vol relative flex items-center"
            onMouseEnter={() => setVolumeOpen(true)}
            onMouseLeave={() => setVolumeOpen(false)}
          >
            <button
              type="button"
              onClick={toggleMute}
              className="player-btn"
              aria-label={muted ? "Unmute" : "Mute"}
            >
              {volumeIcon}
            </button>
            <div
              className={`overflow-hidden transition-all duration-200 ${
                volumeOpen ? "ml-1 w-20 opacity-100 sm:w-24" : "w-0 opacity-0"
              }`}
            >
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={muted ? 0 : volume}
                style={{ "--vol": `${(muted ? 0 : volume) * 100}%` }}
                onChange={(e) => {
                  const video = videoRef.current;
                  if (!video) return;
                  const next = Number(e.target.value);
                  video.volume = next;
                  video.muted = next === 0;
                }}
                className="player-volume w-full"
                aria-label="Volume"
              />
            </div>
          </div>

          <span className="ml-1.5 select-none whitespace-nowrap font-mono text-[11px] tabular-nums text-white/75 sm:text-xs">
            {formatDuration(currentTime)}
            <span className="text-white/35"> / </span>
            {formatDuration(duration)}
          </span>

          {/* Right cluster */}
          <div className="ml-auto flex items-center gap-0.5">
            <div className="relative">
              <button
                type="button"
                onClick={() => setActiveMenu((m) => (m === "cc" ? null : "cc"))}
                className={`player-btn relative ${activeTrack >= 0 ? "text-teal-300" : ""}`}
                aria-label="Subtitles"
                aria-expanded={activeMenu === "cc"}
              >
                <span className="rounded border border-current px-1 py-[1px] text-[10px] font-bold leading-none tracking-wide">
                  CC
                </span>
                {activeTrack >= 0 && (
                  <span className="absolute bottom-1 left-1/2 h-0.5 w-3 -translate-x-1/2 rounded-full bg-teal-400" />
                )}
              </button>
              {activeMenu === "cc" && (
                <MenuPanel title="Subtitles">
                  <MenuItem active={activeTrack < 0} onClick={() => selectSubtitle(-1)}>
                    Off
                  </MenuItem>
                  {subtitleTracks.length ? (
                    subtitleTracks.map((track, index) => (
                      <MenuItem
                        key={`${track.src}-${track.lang || index}`}
                        active={activeTrack === index}
                        onClick={() => selectSubtitle(index)}
                      >
                        {track.label || track.lang || `Track ${index + 1}`}
                      </MenuItem>
                    ))
                  ) : (
                    <p className="px-3.5 py-2.5 text-xs text-white/40">No tracks available</p>
                  )}
                </MenuPanel>
              )}
            </div>

            <div className="relative">
              <button
                type="button"
                onClick={() => setActiveMenu((m) => (m === "speed" ? null : "speed"))}
                className={`player-btn min-w-[2.75rem] text-[12px] font-semibold tabular-nums ${
                  speed !== 1 ? "text-teal-300" : ""
                }`}
                aria-label="Playback speed"
                aria-expanded={activeMenu === "speed"}
              >
                {speed === 1 ? "1×" : `${speed}×`}
              </button>
              {activeMenu === "speed" && (
                <MenuPanel title="Playback speed">
                  {SPEEDS.map((value) => (
                    <MenuItem
                      key={value}
                      active={speed === value}
                      onClick={() => changeSpeed(value)}
                    >
                      {value === 1 ? "Normal" : `${value}×`}
                    </MenuItem>
                  ))}
                </MenuPanel>
              )}
            </div>

            <div className="relative hidden sm:block">
              <button
                type="button"
                onClick={() => setActiveMenu((m) => (m === "settings" ? null : "settings"))}
                className={`player-btn ${activeMenu === "settings" ? "text-teal-300" : ""}`}
                aria-label="Settings"
              >
                <FiSettings size={18} />
              </button>
              {activeMenu === "settings" && (
                <MenuPanel title="Settings">
                  <button
                    type="button"
                    className="flex w-full items-center justify-between px-3.5 py-2.5 text-left text-[13px] text-white/85 hover:bg-white/[0.06]"
                    onClick={() => setActiveMenu("speed")}
                  >
                    <span>Speed</span>
                    <span className="text-white/45">{speed === 1 ? "Normal" : `${speed}×`}</span>
                  </button>
                  <button
                    type="button"
                    className="flex w-full items-center justify-between px-3.5 py-2.5 text-left text-[13px] text-white/85 hover:bg-white/[0.06]"
                    onClick={() => setActiveMenu("cc")}
                  >
                    <span>Subtitles</span>
                    <span className="text-white/45">
                      {activeTrack >= 0
                        ? subtitleTracks[activeTrack]?.label || "On"
                        : "Off"}
                    </span>
                  </button>
                </MenuPanel>
              )}
            </div>

            <button
              type="button"
              onClick={toggleFullscreen}
              className="player-btn"
              aria-label={fullscreen ? "Exit fullscreen" : "Fullscreen"}
            >
              {fullscreen ? <FiMinimize size={18} /> : <FiMaximize size={18} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
