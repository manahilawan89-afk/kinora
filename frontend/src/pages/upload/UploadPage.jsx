import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiUploadCloud } from "react-icons/fi";
import api from "../../services/api";

function captureThumbnail(file) {
  return new Promise((resolve) => {
    const video = document.createElement("video");
    video.preload = "metadata";
    video.muted = true;
    video.src = URL.createObjectURL(file);
    video.onloadeddata = () => {
      video.currentTime = Math.min(2, video.duration / 2);
    };
    video.onseeked = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 640;
      canvas.height = 360;
      canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => {
        URL.revokeObjectURL(video.src);
        resolve(blob ? new File([blob], "thumb.jpg", { type: "image/jpeg" }) : null);
      }, "image/jpeg", 0.85);
    };
    video.onerror = () => {
      URL.revokeObjectURL(video.src);
      resolve(null);
    };
  });
}

export default function UploadPage() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("general");
  const [contentType, setContentType] = useState("video");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);

  function handleFile(f) {
    if (!f?.type.startsWith("video/")) {
      setError("Please select a valid video file");
      return;
    }
    setFile(f);
    setError("");
    if (!title) setTitle(f.name.replace(/\.[^.]+$/, ""));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!file) return setError("Select a video file");
    if (!title.trim()) return setError("Title is required");

    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("video", file);
      formData.append("title", title.trim());
      formData.append("description", description.trim());
      formData.append("category", category);
      formData.append("type", contentType);

      const thumb = await captureThumbnail(file);
      if (thumb) formData.append("thumbnail", thumb);

      const { data } = await api.post("/videos", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      navigate(contentType === "reel" ? "/reels" : `/watch/${data.data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-2xl font-semibold">Upload to Kinora</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setContentType("video")}
            className={`rounded-xl border px-4 py-3 text-left text-sm font-medium ${
              contentType === "video"
                ? "border-teal-600 bg-teal-50 dark:bg-teal-950/40"
                : "border-zinc-300 dark:border-zinc-700"
            }`}
          >
            Video
            <span className="mt-1 block text-xs font-normal text-zinc-500">
              Long-form watch page
            </span>
          </button>
          <button
            type="button"
            onClick={() => setContentType("reel")}
            className={`rounded-xl border px-4 py-3 text-left text-sm font-medium ${
              contentType === "reel"
                ? "border-teal-600 bg-teal-50 dark:bg-teal-950/40"
                : "border-zinc-300 dark:border-zinc-700"
            }`}
          >
            Reel
            <span className="mt-1 block text-xs font-normal text-zinc-500">
              Vertical short feed
            </span>
          </button>
        </div>

        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            handleFile(e.dataTransfer.files[0]);
          }}
          className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-12 transition-colors ${
            dragOver
              ? "border-teal-600 bg-teal-50 dark:bg-teal-950/20"
              : "border-zinc-300 dark:border-zinc-700"
          }`}
        >
          <FiUploadCloud size={48} className="mb-4 text-zinc-400" />
          <p className="mb-2 text-lg font-medium">Drag and drop video file</p>
          <p className="mb-4 text-sm text-zinc-500">or</p>
          <label className="cursor-pointer rounded-full bg-teal-700 px-6 py-2 text-sm font-medium text-white hover:bg-teal-800">
            Select file
            <input
              type="file"
              accept="video/*"
              className="hidden"
              onChange={(e) => handleFile(e.target.files[0])}
            />
          </label>
          {file && (
            <p className="mt-4 text-sm text-green-600 dark:text-green-400">
              Selected: {file.name}
            </p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Title</label>
          <input
            className="w-full rounded-lg border border-zinc-300 bg-transparent px-4 py-2.5 outline-none focus:border-blue-500 dark:border-zinc-700"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={100}
            placeholder="Add a title that describes your video"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Description</label>
          <textarea
            className="w-full rounded-lg border border-zinc-300 bg-transparent px-4 py-2.5 outline-none focus:border-blue-500 dark:border-zinc-700"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Tell viewers about your video"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Category</label>
          <select
            className="w-full rounded-lg border border-zinc-300 bg-transparent px-4 py-2.5 dark:border-zinc-700"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="general">General</option>
            <option value="Animation">Animation</option>
            <option value="Tech">Tech</option>
            <option value="Sci-Fi">Sci-Fi</option>
            <option value="Entertainment">Entertainment</option>
          </select>
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={uploading}
          className="rounded-full bg-teal-700 px-8 py-2.5 font-medium text-white hover:bg-teal-800 disabled:opacity-50"
        >
          {uploading ? "Uploading..." : contentType === "reel" ? "Publish reel" : "Upload"}
        </button>
      </form>
    </div>
  );
}
