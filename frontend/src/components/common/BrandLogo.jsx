import { Link } from "react-router-dom";

export default function BrandLogo({ className = "" }) {
  return (
    <Link
      to="/"
      className={`group flex items-center gap-2.5 ${className}`}
      aria-label="Kinora home"
    >
      <span className="relative inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] bg-gradient-to-br from-[#ff2d55] via-[#ff0033] to-[#c40028] shadow-sm ring-1 ring-black/5 transition group-hover:brightness-110">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path
            d="M3.2 1.8c0-.7.76-1.14 1.36-.77l8.1 4.85c.6.36.6 1.18 0 1.54l-8.1 4.85c-.6.37-1.36-.07-1.36-.77V1.8z"
            fill="#fff"
          />
        </svg>
      </span>
      <span className="font-brand truncate text-[1.35rem] font-bold tracking-[-0.03em] text-[#0f0f0f] dark:text-white">
        Kinora
      </span>
    </Link>
  );
}
