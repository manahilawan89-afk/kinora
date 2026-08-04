import { Link } from "react-router-dom";

export default function BrandLogo({ className = "" }) {
  return (
    <Link to="/" className={`group flex items-center gap-2 ${className}`}>
      <svg
        width="30"
        height="30"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="shrink-0"
      >
        <rect width="40" height="40" rx="10" fill="#FF0033" />
        <path
          d="M16.5 12.8c0-.9.97-1.46 1.74-.99l11.2 6.7c.76.46.76 1.52 0 1.98l-11.2 6.7c-.77.47-1.74-.09-1.74-.99V12.8z"
          fill="#FFFFFF"
        />
      </svg>
      <span className="truncate text-xl font-bold tracking-tight text-[#0f0f0f] dark:text-white">
        Kinora
      </span>
    </Link>
  );
}
