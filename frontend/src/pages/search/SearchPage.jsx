import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../../services/api";
import VideoCard from "../../components/video/VideoCard";

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const q = searchParams.get("q") || "";
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api
      .get("/videos", { params: { type: "video", ...(q ? { q } : {}) } })
      .then((res) => setVideos(res.data.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [q]);

  return (
    <section>
      <h1 className="mb-6 text-xl font-medium">
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
              <div className="h-24 w-40 rounded-lg bg-zinc-800" />
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
