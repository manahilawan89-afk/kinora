import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import api from "../../services/api";
import VideoCard from "../../components/video/VideoCard";

export default function SearchPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const q = searchParams.get("q") || "";
  const [input, setInput] = useState(q);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setInput(q);
  }, [q]);

  useEffect(() => {
    setLoading(true);
    api
      .get("/videos", { params: { type: "video", ...(q ? { q } : {}) } })
      .then((res) => setVideos(res.data.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [q]);

  function handleSearch(e) {
    e.preventDefault();
    const next = input.trim();
    navigate(next ? `/search?q=${encodeURIComponent(next)}` : "/search");
  }

  return (
    <section>
      <form onSubmit={handleSearch} className="mb-5 flex gap-2 sm:hidden">
        <input
          className="h-11 flex-1 rounded-full border border-zinc-200 bg-zinc-50 px-4 text-sm outline-none focus:border-teal-600 dark:border-white/10 dark:bg-white/5"
          placeholder="Search Kinora..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          type="submit"
          className="flex h-11 w-11 items-center justify-center rounded-full bg-teal-700 text-white"
          aria-label="Search"
        >
          <FiSearch size={18} />
        </button>
      </form>

      <h1 className="mb-5 text-lg font-medium sm:mb-6 sm:text-xl">
        {q ? (
          <>Search results for &ldquo;{q}&rdquo;</>
        ) : (
          "Search for videos"
        )}
      </h1>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex animate-pulse gap-3">
              <div className="h-20 w-32 rounded-lg bg-zinc-800 sm:h-24 sm:w-40" />
              <div className="flex-1 space-y-2">
                <div className="h-4 rounded bg-zinc-800" />
                <div className="h-3 w-1/2 rounded bg-zinc-800" />
              </div>
            </div>
          ))}
        </div>
      ) : videos.length === 0 ? (
        <p className="text-zinc-500">No videos found.</p>
      ) : (
        <div className="space-y-4">
          {videos.map((video) => (
            <VideoCard key={video._id} video={video} layout="list" />
          ))}
        </div>
      )}
    </section>
  );
}
