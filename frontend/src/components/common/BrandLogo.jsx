import { Link } from "react-router-dom";

export default function BrandLogo({ className = "" }) {
  return (
    <Link
      to="/"
      className={`group flex items-center gap-2.5 ${className}`}
      aria-label="Kinora home"
    >
      <svg
        width="34"
        height="34"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="shrink-0 transition group-hover:opacity-90"
      >
        <rect width="40" height="40" rx="12" fill="#0F766E" />
        <circle cx="20" cy="20" r="11.5" stroke="#99F6E4" strokeWidth="1.6" opacity="0.55" />
        <circle cx="20" cy="20" r="7.2" stroke="#F0FDFA" strokeWidth="1.4" opacity="0.85" />
        <path
          d="M15.2 12.4h2.55l4.2 6.15 1.85-2.7V12.4H26.8v15.2h-2.85V21.2l-1.55 2.2-5.05 7.2h-2.85l5.55-7.85-5.05-7.35z"
          fill="#F8FFFC"
        />
      </svg>
      <span className="font-brand truncate text-[1.25rem] font-semibold tracking-[-0.04em] text-[#134e4a] dark:text-[#ccfbf1]">
        Kinora
      </span>
    </Link>
  );
}
