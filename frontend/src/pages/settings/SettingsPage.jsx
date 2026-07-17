import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  FiUser,
  FiMoon,
  FiSun,
  FiLock,
  FiLogOut,
  FiExternalLink,
  FiCheck,
} from "react-icons/fi";
import api from "../../services/api";
import { logout, setUser } from "../../redux/slices/authSlice";
import { setDarkMode } from "../../redux/slices/themeSlice";

const TABS = [
  { id: "profile", label: "Profile", icon: FiUser },
  { id: "appearance", label: "Appearance", icon: FiMoon },
  { id: "security", label: "Security", icon: FiLock },
];

export default function SettingsPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((s) => s.auth.user);
  const darkMode = useSelector((s) => s.theme.darkMode);
  const [tab, setTab] = useState("profile");

  const [profile, setProfile] = useState({
    fullName: "",
    username: "",
    bio: "",
    avatar: "",
  });
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;
    setProfile({
      fullName: user.fullName || "",
      username: user.username || "",
      bio: user.bio || "",
      avatar: user.avatar || "",
    });
  }, [user]);

  function showSuccess(text) {
    setError("");
    setMessage(text);
    setTimeout(() => setMessage(""), 3000);
  }

  async function saveProfile(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const { data } = await api.patch("/auth/profile", profile);
      dispatch(setUser(data.user));
      showSuccess("Profile updated");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  }

  async function savePassword(e) {
    e.preventDefault();
    setError("");
    if (passwords.newPassword !== passwords.confirmPassword) {
      setError("New passwords do not match");
      return;
    }
    setSaving(true);
    try {
      await api.patch("/auth/password", {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      });
      setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
      showSuccess("Password changed");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to change password");
    } finally {
      setSaving(false);
    }
  }

  function handleLogout() {
    dispatch(logout());
    navigate("/login");
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-lg py-16 text-center">
        <p className="mb-4 text-zinc-500">Sign in to manage your settings.</p>
        <Link to="/login" className="text-blue-500 hover:underline">
          Go to login
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="mb-6 text-2xl font-semibold">Settings</h1>

      <div className="flex flex-col gap-6 md:flex-row">
        <nav className="flex shrink-0 gap-1 overflow-x-auto md:w-48 md:flex-col">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => {
                setTab(id);
                setError("");
                setMessage("");
              }}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium whitespace-nowrap ${
                tab === id
                  ? "bg-zinc-100 dark:bg-zinc-800"
                  : "hover:bg-zinc-100 dark:hover:bg-zinc-800/60"
              }`}
            >
              <Icon size={18} />
              {label}
            </button>
          ))}
        </nav>

        <div className="min-w-0 flex-1 rounded-xl border border-zinc-200 p-5 dark:border-zinc-800 md:p-6">
          {(message || error) && (
            <div
              className={`mb-4 flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${
                error
                  ? "bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400"
                  : "bg-green-50 text-green-700 dark:bg-green-950/40 dark:text-green-400"
              }`}
            >
              {!error && <FiCheck />}
              {error || message}
            </div>
          )}

          {tab === "profile" && (
            <form onSubmit={saveProfile} className="space-y-5">
              <div>
                <h2 className="text-lg font-medium">Profile</h2>
                <p className="text-sm text-zinc-500">
                  How you appear on Kinora
                </p>
              </div>

              <div className="flex items-center gap-4">
                <div className="h-16 w-16 overflow-hidden rounded-full bg-zinc-700">
                  {profile.avatar ? (
                    <img
                      src={profile.avatar}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xl text-white">
                      {profile.username?.[0]?.toUpperCase() || "?"}
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <label className="mb-1 block text-sm font-medium">
                    Avatar URL
                  </label>
                  <input
                    className="w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-2 text-sm outline-none focus:border-blue-500 dark:border-zinc-700"
                    value={profile.avatar}
                    onChange={(e) =>
                      setProfile({ ...profile, avatar: e.target.value })
                    }
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">Name</label>
                <input
                  className="w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-2.5 outline-none focus:border-blue-500 dark:border-zinc-700"
                  value={profile.fullName}
                  onChange={(e) =>
                    setProfile({ ...profile, fullName: e.target.value })
                  }
                  maxLength={80}
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">Username</label>
                <div className="flex items-center gap-1">
                  <span className="text-zinc-500">@</span>
                  <input
                    className="w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-2.5 outline-none focus:border-blue-500 dark:border-zinc-700"
                    value={profile.username}
                    onChange={(e) =>
                      setProfile({ ...profile, username: e.target.value })
                    }
                    maxLength={30}
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">Bio</label>
                <textarea
                  className="w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-2.5 outline-none focus:border-blue-500 dark:border-zinc-700"
                  rows={3}
                  value={profile.bio}
                  onChange={(e) =>
                    setProfile({ ...profile, bio: e.target.value })
                  }
                  maxLength={500}
                  placeholder="Tell viewers about your channel"
                />
                <p className="mt-1 text-xs text-zinc-500">
                  {profile.bio.length}/500
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-full bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save"}
                </button>
                <Link
                  to={`/channel/${user.username}`}
                  className="inline-flex items-center gap-1 text-sm text-blue-500 hover:underline"
                >
                  View channel <FiExternalLink size={14} />
                </Link>
              </div>
            </form>
          )}

          {tab === "appearance" && (
            <div className="space-y-5">
              <div>
                <h2 className="text-lg font-medium">Appearance</h2>
                <p className="text-sm text-zinc-500">
                  Choose how Kinora looks for you
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => dispatch(setDarkMode(false))}
                  className={`flex items-center gap-3 rounded-xl border p-4 text-left transition ${
                    !darkMode
                      ? "border-teal-600 bg-teal-50 dark:bg-teal-950/30"
                      : "border-zinc-200 hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800/50"
                  }`}
                >
                  <FiSun size={22} />
                  <div>
                    <p className="font-medium">Light</p>
                    <p className="text-xs text-zinc-500">Bright, clean look</p>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => dispatch(setDarkMode(true))}
                  className={`flex items-center gap-3 rounded-xl border p-4 text-left transition ${
                    darkMode
                      ? "border-teal-600 bg-teal-50 dark:bg-teal-950/30"
                      : "border-zinc-200 hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800/50"
                  }`}
                >
                  <FiMoon size={22} />
                  <div>
                    <p className="font-medium">Dark</p>
                    <p className="text-xs text-zinc-500">Cinematic Kinora vibe</p>
                  </div>
                </button>
              </div>
            </div>
          )}

          {tab === "security" && (
            <div className="space-y-8">
              <form onSubmit={savePassword} className="space-y-5">
                <div>
                  <h2 className="text-lg font-medium">Change password</h2>
                  <p className="text-sm text-zinc-500">
                    Keep your account secure
                  </p>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Current password
                  </label>
                  <input
                    type="password"
                    className="w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-2.5 outline-none focus:border-blue-500 dark:border-zinc-700"
                    value={passwords.currentPassword}
                    onChange={(e) =>
                      setPasswords({
                        ...passwords,
                        currentPassword: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium">
                    New password
                  </label>
                  <input
                    type="password"
                    className="w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-2.5 outline-none focus:border-blue-500 dark:border-zinc-700"
                    value={passwords.newPassword}
                    onChange={(e) =>
                      setPasswords({
                        ...passwords,
                        newPassword: e.target.value,
                      })
                    }
                    minLength={6}
                    required
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Confirm new password
                  </label>
                  <input
                    type="password"
                    className="w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-2.5 outline-none focus:border-blue-500 dark:border-zinc-700"
                    value={passwords.confirmPassword}
                    onChange={(e) =>
                      setPasswords({
                        ...passwords,
                        confirmPassword: e.target.value,
                      })
                    }
                    minLength={6}
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-full bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  {saving ? "Updating..." : "Update password"}
                </button>
              </form>

              <div className="border-t border-zinc-200 pt-6 dark:border-zinc-800">
                <h2 className="mb-1 text-lg font-medium">Account</h2>
                <p className="mb-4 text-sm text-zinc-500">
                  Signed in as{" "}
                  <span className="font-medium text-zinc-800 dark:text-zinc-200">
                    {user.email}
                  </span>
                </p>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="inline-flex items-center gap-2 rounded-full border border-zinc-300 px-5 py-2 text-sm font-medium hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
                >
                  <FiLogOut />
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
