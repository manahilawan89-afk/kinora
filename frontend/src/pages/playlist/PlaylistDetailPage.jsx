import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { FiTrash2 } from "react-icons/fi";
import api from "../../services/api";
import VideoCard from "../../components/video/VideoCard";

export default function PlaylistDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useSelector((s) => s.auth.user);
  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api
      .get(`/playlists/${id}`)
      .then((res) => setPlaylist(res.data.data))
      .catch(() => navigate("/playlists"))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  async function removeVideo(videoId) {
    await api.delete(`/playlists/${id}/videos/${videoId}`);
    setPlaylist((p) => ({
      ...p,
      videos: p.videos.filter((v) => v._id !== videoId),
      videoCount: Math.max(0, (p.videoCount || 1) - 1),
    }));
  }

  async function deletePlaylist() {
    if (!confirm("Delete this playlist?")) return;
    await api.delete(`/playlists/${id}`);
    navigate("/playlists");
  }

  if (loading || !playlist) {
    return <div className="animate-pulse text-zinc-500">Loading playlist...</div>;
  }

  const isOwner = user && (user.id === playlist.ownerId || user._id === playlist.ownerId);

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold sm:text-2xl">{playlist.title}</h1>
          <p className="mt-1 text-sm text-zinc-500">
            by{" "}
            <Link
              to={`/channel/${playlist.owner?.username}`}
              className="hover:underline"
            >
              {playlist.owner?.fullName || playlist.owner?.username}
            </Link>{" "}
            · {playlist.videoCount || 0} videos
          </p>
          {playlist.description && (
            <p className="mt-2 text-sm text-zinc-400">{playlist.description}</p>
          )}
        </div>
        {isOwner && (
          <button
            onClick={deletePlaylist}
            className="inline-flex items-center gap-2 rounded-full border border-red-500/40 px-4 py-2 text-sm text-red-500 hover:bg-red-500/10"
          >
            <FiTrash2 /> Delete
          </button>
        )}
      </div>

      {!playlist.videos?.length ? (
        <p className="text-zinc-500">This playlist is empty.</p>
      ) : (
        <div className="space-y-4">
          {playlist.videos.map((video) => (
            <div key={video._id} className="flex items-start gap-3">
              <div className="min-w-0 flex-1">
                <VideoCard video={video} layout="list" />
              </div>
              {isOwner && (
                <button
                  onClick={() => removeVideo(video._id)}
                  className="mt-2 rounded-full p-2 text-zinc-500 hover:bg-zinc-100 hover:text-red-500 dark:hover:bg-zinc-800"
                  title="Remove from playlist"
                >
                  <FiTrash2 />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
