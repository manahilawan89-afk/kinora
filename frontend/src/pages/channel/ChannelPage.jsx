import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../../services/api";
import VideoCard from "../../components/video/VideoCard";
import { formatViews } from "../../utils/format";

export default function ChannelPage() {
  const { username } = useParams();
  const [channel, setChannel] = useState(null);
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    api.get(`/channels/${username}`).then((res) => {
      setChannel(res.data.data?.user);
      setVideos(res.data.data?.videos || []);
    });
  }, [username]);

  if (!channel) {
    return <div className="animate-pulse text-zinc-500">Loading channel...</div>;
  }

  return (
    <section>
      <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-center sm:gap-4">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="h-16 w-16 shrink-0 overflow-hidden rounded-full bg-zinc-700 sm:h-20 sm:w-20">
            {channel.avatar && (
              <img src={channel.avatar} alt="" className="h-full w-full object-cover" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-xl font-bold sm:text-2xl">
              {channel.fullName || channel.username}
            </h1>
            <p className="text-sm text-zinc-500">
              @{channel.username} · {formatViews(channel.subscribersCount)} subscribers
            </p>
            {channel.bio && <p className="mt-2 line-clamp-3 text-sm sm:line-clamp-none">{channel.bio}</p>}
          </div>
        </div>
        <button className="w-full rounded-full bg-zinc-900 px-6 py-2.5 text-sm font-medium text-white dark:bg-white dark:text-black sm:ml-auto sm:w-auto sm:py-2">
          Subscribe
        </button>
      </div>

      <h2 className="mb-4 text-lg font-medium">Videos</h2>
      <div className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2 sm:gap-y-8 lg:grid-cols-3 xl:grid-cols-4">
        {videos.map((video) => (
          <VideoCard key={video._id} video={video} />
        ))}
      </div>
      {videos.length === 0 && (
        <p className="text-zinc-500">No videos on this channel yet.</p>
      )}
    </section>
  );
}
