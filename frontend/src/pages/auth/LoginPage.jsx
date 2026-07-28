import { useDispatch } from "react-redux";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { loginUser } from "../../redux/slices/authSlice";
import BrandLogo from "../../components/common/BrandLogo";

function getErrorMessage(err) {
  if (!err) return "Login failed";
  if (typeof err === "string") return err;
  return err.message || err.error || "Login failed";
}

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await dispatch(
        loginUser({
          email: form.email.trim(),
          password: form.password,
        })
      ).unwrap();
      navigate("/");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md items-center px-1 sm:min-h-[70vh]">
      <motion.form
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={onSubmit}
        className="w-full space-y-4 rounded-2xl border border-zinc-200 bg-white p-5 shadow-xl shadow-zinc-900/10 dark:border-white/10 dark:bg-white/5 dark:shadow-[0_30px_80px_rgba(0,0,0,0.4)] dark:backdrop-blur-xl sm:rounded-3xl sm:p-8"
      >
        <div className="mb-2 flex justify-center">
          <BrandLogo />
        </div>
        <h1 className="font-brand text-center text-2xl font-semibold text-zinc-900 dark:text-white">
          Welcome back
        </h1>
        <p className="text-center text-sm text-zinc-500 dark:text-zinc-400">
          Demo: demo@youtube.com / password123
        </p>
        <input
          className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-zinc-900 outline-none focus:border-teal-600 dark:border-white/10 dark:bg-black/30 dark:text-zinc-100 dark:focus:border-kinora-glow/50"
          placeholder="Email"
          type="email"
          autoComplete="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 pr-12 text-zinc-900 outline-none focus:border-teal-600 dark:border-white/10 dark:bg-black/30 dark:text-zinc-100 dark:focus:border-kinora-glow/50"
            placeholder="Password"
            autoComplete="current-password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
          </button>
        </div>
        {error && <p className="text-sm text-rose-500">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-amber-500 py-2.5 font-semibold text-black hover:brightness-110 disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
        <p className="text-center text-sm text-zinc-500 dark:text-zinc-400">
          No account?{" "}
          <Link to="/register" className="text-teal-700 hover:underline dark:text-kinora-glow">
            Create one
          </Link>
        </p>
      </motion.form>
    </div>
  );
}
