import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import HomePage from "./pages/home/HomePage";
import WatchPage from "./pages/video/WatchPage";
import ChannelPage from "./pages/channel/ChannelPage";
import SearchPage from "./pages/search/SearchPage";
import UploadPage from "./pages/upload/UploadPage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import SettingsPage from "./pages/settings/SettingsPage";
import ReelsPage from "./pages/reels/ReelsPage";
import PlaylistsPage from "./pages/playlist/PlaylistsPage";
import PlaylistDetailPage from "./pages/playlist/PlaylistDetailPage";
import ProtectedRoute from "./components/auth/ProtectedRoute";

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/reels" element={<ReelsPage />} />
        <Route path="/watch/:id" element={<WatchPage />} />
        <Route path="/channel/:username" element={<ChannelPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/playlists"
          element={
            <ProtectedRoute>
              <PlaylistsPage />
            </ProtectedRoute>
          }
        />
        <Route path="/playlists/:id" element={<PlaylistDetailPage />} />
        <Route
          path="/upload"
          element={
            <ProtectedRoute>
              <UploadPage />
            </ProtectedRoute>
          }
        />
        <Route path="/settings" element={<SettingsPage />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute roles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
}
