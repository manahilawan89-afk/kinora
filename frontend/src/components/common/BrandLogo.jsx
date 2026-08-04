import { Link } from "react-router-dom";

export default function BrandLogo({ className = "" }) {
  return (
    <Link
      to="/"
      className={`group inline-flex items-baseline gap-0 ${className}`}
      aria-label="Kinora home"
    >
      <span className="font-brand relative text-[1.45rem] font-semibold leading-none tracking-[-0.055em] text-[#0b3d3a] dark:text-[#f0fdfa] sm:text-[1.55rem]">
        Kin
        <span className="text-teal-700 dark:text-teal-300">ora</span>
        <span
          aria-hidden="true"
          className="absolute -bottom-1 left-0 h-[2px] w-full origin-left scale-x-0 bg-gradient-to-r from-teal-700 to-teal-400 transition-transform duration-300 group-hover:scale-x-100 dark:from-teal-300 dark:to-teal-500"
        />
      </span>
    </Link>
  );
}
