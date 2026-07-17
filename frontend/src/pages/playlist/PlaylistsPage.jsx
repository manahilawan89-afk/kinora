import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiPlus, FiList } from "react-icons/fi";
import api from "../../services/api";
import { getMediaUrl } from "../../utils/format";

export default function PlaylistsPage() {
  const [playlists, setPlaylists] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [creating, setCreating] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    const { data } = await api.get("/playlists/me");
    setPlaylists(data.data || []);
  }

  useEffect(() => {
    load().catch(console.error);
  }, []);

  async function handleCreate(e) {
    e.preventDefault();
    if (!title.trim()) return setError("Title is required");
    setCreating(true);
    setError("");
    try {
      await api.post("/playlists", {
        title: title.trim(),
        description: description.trim(),
        isPublic: true,
      });
      setTitle("");
      setDescription("");
      setShowForm(false);
      await load();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create playlist");
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Playlists</h1>
          <p className="text-sm text-zinc-500">Organize your favorite Kinora videos</p>
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="inline-flex items-center gap-2 rounded-full bg-teal-700 px-4 py-2 text-sm font-medium text-white hover:bg-teal-800"
        >
          <FiPlus /> New playlist
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleCreate}
          className="mb-8 space-y-3 rounded-xl border border-zinc-200 p-4 dark:border-zinc-800"
        >
          <input
            className="w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-2.5 outline-none focus:border-teal-600 dark:border-zinc-700"
            placeholder="Playlist title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            className="w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-2.5 outline-none focus:border-teal-600 dark:border-zinc-700"
            placeholder="Description (optional)"
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button
            disabled={creating}
            className="rounded-full bg-teal-700 px-5 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            {creating ? "Creating..." : "Create"}
          </button>
        </form>
      )}

      {playlists.length === 0 ? (
        <div className="rounded-xl border border-dashed border-zinc-300 p-12 text-center dark:border-zinc-700">
          <FiList className="mx-auto mb-3 text-3xl text-zinc-400" />
          <p className="text-zinc-500">No playlists yet. Create your first one.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {playlists.map((pl) => {
            const cover = pl.videos?.[0]?.thumbnailUrl;
            return (
              <Link
                key={pl._id}
                to={`/playlists/${pl._id}`}
                className="group overflow-hidden rounded-xl border border-zinc-200 transition hover:border-teal-600 dark:border-zinc-800"
              >
                <div className="aspect-video bg-zinc-800">
                  {cover ? (
                    <img
                      src={getMediaUrl(cover)}
                      alt=""
                      className="h-full w-full object-cover transition group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-zinc-500">
                      <FiList size={32} />
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <h3 className="font-medium">{pl.title}</h3>
                  <p className="text-sm text-zinc-500">
                    {pl.videoCount || 0} video{(pl.videoCount || 0) === 1 ? "" : "s"}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
