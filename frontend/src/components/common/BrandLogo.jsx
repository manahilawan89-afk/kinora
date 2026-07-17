import { Link } from "react-router-dom";

export default function BrandLogo({ className = "" }) {
  return (
    <Link to="/" className={`group flex items-center gap-2.5 ${className}`}>
      <span className="relative inline-flex animate-floaty">
        <svg
          width="34"
          height="34"
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          className="shrink-0 drop-shadow-[0_0_10px_rgba(15,118,110,0.35)] dark:drop-shadow-[0_0_12px_rgba(45,212,191,0.45)]"
        >
          <rect width="40" height="40" rx="11" fill="#0F766E" />
          <path
            d="M16.5 12.8c0-.9.97-1.46 1.74-.99l11.2 6.7c.76.46.76 1.52 0 1.98l-11.2 6.7c-.77.47-1.74-.09-1.74-.99V12.8z"
            fill="#F8FAFC"
          />
          <circle cx="30.5" cy="11.5" r="3.2" fill="#F59E0B" />
        </svg>
      </span>
      <span className="font-brand hidden text-[1.4rem] font-semibold tracking-tight text-zinc-900 dark:text-white sm:block">
        Kinora
      </span>
    </Link>
  );
}
