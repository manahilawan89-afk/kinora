import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { FiThumbsUp, FiShare2, FiDownload, FiList } from "react-icons/fi";
import api from "../../services/api";
import VideoCard from "../../components/video/VideoCard";
import VideoPlayer from "../../components/video/VideoPlayer";
import { formatViews, timeAgo, getMediaUrl, getYoutubeEmbed, getYoutubeId } from "../../utils/format";

export default function WatchPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useSelector((s) => s.auth.user);
  const [video, setVideo] = useState(null);
  const [related, setRelated] = useState([]);
  const [comments, setComments] = useState([]);
  const [liked, setLiked] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [loading, setLoading] = useState(true);
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);
  const [playlists, setPlaylists] = useState([]);
  const [playlistMsg, setPlaylistMsg] = useState("");

  useEffect(() => {
    setLoading(true);
    api
      .get(`/videos/${id}`)
      .then((res) => {
        setVideo(res.data.data);
        setRelated(res.data.related || []);
        setLiked(res.data.liked || false);
      })
      .catch(() => navigate("/"))
      .finally(() => setLoading(false));

    api
      .get(`/videos/${id}/comments`)
      .then((res) => setComments(res.data.data || []))
      .catch(console.error);
  }, [id, navigate]);

  async function handleLike() {
    if (!user) return navigate("/login");
    const { data } = await api.post(`/videos/${id}/like`);
    setLiked(data.liked);
    setVideo((v) => ({ ...v, likesCount: data.likesCount }));
  }

  async function openPlaylistModal() {
    if (!user) return navigate("/login");
    setPlaylistMsg("");
    setShowPlaylistModal(true);
    try {
      const { data } = await api.get("/playlists/me");
      setPlaylists(data.data || []);
    } catch (err) {
      console.error(err);
    }
  }

  async function saveToPlaylist(playlistId) {
    try {
      await api.post(`/playlists/${playlistId}/videos`, { videoId: id });
      setPlaylistMsg("Saved to playlist");
      setTimeout(() => setShowPlaylistModal(false), 800);
    } catch (err) {
      setPlaylistMsg(err.response?.data?.message || "Could not save");
    }
  }

  async function createAndSave() {
    const title = prompt("New playlist name");
    if (!title?.trim()) return;
    const { data } = await api.post("/playlists", { title: title.trim() });
    await api.post(`/playlists/${data.data._id}/videos`, { videoId: id });
    setPlaylistMsg("Saved to new playlist");
    setTimeout(() => setShowPlaylistModal(false), 800);
  }

  async function handleComment(e) {
    e.preventDefault();
    if (!user) return navigate("/login");
    if (!commentText.trim()) return;

    const { data } = await api.post(`/videos/${id}/comments`, {
      content: commentText.trim(),
    });
    setComments((prev) => [data.data, ...prev]);
    setCommentText("");
    setVideo((v) => ({ ...v, commentsCount: (v.commentsCount || 0) + 1 }));
  }

  if (loading || !video) {
    return (
      <div className="mx-auto max-w-[1700px] animate-pulse">
        <div className="aspect-video rounded-xl bg-zinc-800" />
        <div className="mt-4 h-8 w-2/3 rounded bg-zinc-800" />
      </div>
    );
  }

  const videoSrc = getMediaUrl(video.videoUrl);
  const youtubeEmbed = getYoutubeEmbed(video.videoUrl);
  const isYoutube = Boolean(getYoutubeId(video.videoUrl));

  return (
    <div className="mx-auto flex max-w-[1700px] flex-col gap-5 xl:flex-row xl:gap-6">
      <div className="min-w-0 flex-1">
        <div className="-mx-3 aspect-video overflow-hidden bg-black shadow-[0_20px_60px_-20px_rgba(0,0,0,0.45)] ring-1 ring-black/10 sm:-mx-4 sm:rounded-xl md:mx-0 dark:ring-white/5">
          {isYoutube ? (
            <iframe
              key={video._id}
              src={youtubeEmbed}
              title={video.title}
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          ) : (
            <VideoPlayer
              key={video._id}
              src={videoSrc}
              title={video.title}
              subtitles={video.subtitles}
              autoPlay
              className="h-full w-full"
            />
          )}
        </div>

        <h1 className="mt-2 text-base font-semibold leading-snug sm:mt-3 sm:text-lg">
          {video.title}
        </h1>

        <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <Link
              to={`/channel/${video.owner?.username}`}
              className="h-8 w-8 shrink-0 overflow-hidden rounded-full bg-zinc-700"
            >
              {video.owner?.avatar && (
                <img src={video.owner.avatar} alt="" className="h-full w-full object-cover" />
              )}
            </Link>
            <div className="min-w-0 flex-1">
              <Link
                to={`/channel/${video.owner?.username}`}
                className="block truncate font-medium hover:underline"
              >
                {video.owner?.fullName || video.owner?.username}
              </Link>
              <p className="text-xs text-zinc-500">
                {formatViews(video.owner?.subscribersCount || 0)} subscribers
              </p>
            </div>
            <button className="shrink-0 rounded-full bg-zinc-900 px-3.5 py-2 text-sm font-medium text-white dark:bg-white dark:text-black sm:ml-2 sm:px-4">
              Subscribe
            </button>
          </div>

          <div className="scrollbar-hide -mx-1 flex gap-2 overflow-x-auto px-1 pb-0.5">
            <button
              onClick={handleLike}
              className={`flex shrink-0 items-center gap-2 rounded-full px-3.5 py-2 text-sm sm:px-4 ${
                liked
                  ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
                  : "bg-zinc-100 dark:bg-zinc-800"
              }`}
            >
              <FiThumbsUp />
              {formatViews(video.likesCount || 0)}
            </button>
            <button
              onClick={openPlaylistModal}
              className="flex shrink-0 items-center gap-2 rounded-full bg-zinc-100 px-3.5 py-2 text-sm dark:bg-zinc-800 sm:px-4"
            >
              <FiList /> Save
            </button>
            <button className="flex shrink-0 items-center gap-2 rounded-full bg-zinc-100 px-3.5 py-2 text-sm dark:bg-zinc-800 sm:px-4">
              <FiShare2 /> Share
            </button>
            <button className="flex shrink-0 items-center gap-2 rounded-full bg-zinc-100 px-3.5 py-2 text-sm dark:bg-zinc-800 sm:px-4">
              <FiDownload /> Download
            </button>
          </div>
        </div>

        {showPlaylistModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className="w-full max-w-md rounded-xl bg-white p-5 dark:bg-zinc-900">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-medium">Save to playlist</h3>
                <button
                  onClick={() => setShowPlaylistModal(false)}
                  className="text-sm text-zinc-500"
                >
                  Close
                </button>
              </div>
              {playlistMsg && (
                <p className="mb-3 text-sm text-teal-600">{playlistMsg}</p>
              )}
              <div className="max-h-64 space-y-2 overflow-y-auto">
                {playlists.map((pl) => (
                  <button
                    key={pl._id}
                    onClick={() => saveToPlaylist(pl._id)}
                    className="flex w-full items-center justify-between rounded-lg border border-zinc-200 px-3 py-2 text-left text-sm hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
                  >
                    <span>{pl.title}</span>
                    <span className="text-xs text-zinc-500">{pl.videoCount || 0}</span>
                  </button>
                ))}
                {!playlists.length && (
                  <p className="text-sm text-zinc-500">No playlists yet.</p>
                )}
              </div>
              <button
                onClick={createAndSave}
                className="mt-4 w-full rounded-full bg-teal-700 py-2 text-sm font-medium text-white"
              >
                Create new playlist
              </button>
            </div>
          </div>
        )}

        <div className="mt-4 rounded-xl bg-zinc-100 p-4 dark:bg-zinc-900">
          <p className="text-sm font-medium">
            {formatViews(video.views)} views · {timeAgo(video.createdAt)}
          </p>
          <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed">
            {video.description || "No description."}
          </p>
        </div>

        <section className="mt-6">
          <h2 className="mb-4 text-lg font-medium">
            {video.commentsCount || comments.length} Comments
          </h2>

          <form onSubmit={handleComment} className="mb-6 flex gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-purple-600 text-sm text-white">
              {user?.username?.[0]?.toUpperCase() || "?"}
            </div>
            <div className="flex-1">
              <input
                className="w-full border-b border-zinc-300 bg-transparent py-2 outline-none focus:border-blue-500 dark:border-zinc-700"
                placeholder={user ? "Add a comment..." : "Sign in to comment"}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onFocus={() => !user && navigate("/login")}
              />
            </div>
          </form>

          <div className="space-y-5">
            {comments.map((c) => (
              <div key={c._id} className="flex gap-3">
                <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-zinc-700">
                  {c.author?.avatar && (
                    <img src={c.author.avatar} alt="" className="h-full w-full object-cover" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium">
                    {c.author?.username}{" "}
                    <span className="font-normal text-zinc-500">
                      {timeAgo(c.createdAt)}
                    </span>
                  </p>
                  <p className="mt-1 text-sm">{c.content}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <aside className="w-full shrink-0 space-y-3 xl:w-[400px]">
        <h3 className="text-sm font-medium text-zinc-500">Up next</h3>
        {related.map((v) => (
          <VideoCard key={v._id} video={v} layout="list" />
        ))}
      </aside>
    </div>
  );
}
