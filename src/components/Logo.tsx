import { BRAND } from "../data/atelier";
import { scrollToId } from "../lib/motion";

/* Marca do ateliê: a foto real de capa do site antigo virou o emblema
   circular, envolto por um anel de nó, ao lado do wordmark. */
export default function Logo({ dark = false }: { dark?: boolean }) {
  return (
    <a
      href="#inicio"
      onClick={(e) => {
        e.preventDefault();
        scrollToId("inicio");
      }}
      className="group flex items-center gap-2.5"
      aria-label="Macra Mari — voltar ao início"
    >
      <span className="relative block h-9 w-9 shrink-0">
        {/* anel de nó */}
        <svg
          viewBox="0 0 36 36"
          className={`absolute inset-0 h-full w-full transition-transform duration-500 group-hover:rotate-180 ${
            dark ? "text-ocre" : "text-clay"
          }`}
          aria-hidden="true"
        >
          <circle cx="18" cy="18" r="16.5" fill="none" stroke="currentColor" strokeWidth="2" />
          <path
            d="M11 10c6 2 6 5 6 8s0 6-6 8M25 10c-6 2-6 5-6 8s0 6 6 8"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
        {/* emblema com a foto real */}
        <span className="absolute inset-[5px] block overflow-hidden rounded-full border border-ink/20">
          <img
            src={BRAND.coverImg}
            alt=""
            className="h-full w-full object-cover"
            loading="eager"
          />
        </span>
      </span>
      <span
        className={`font-display text-[21px] font-extrabold leading-none tracking-tight ${
          dark ? "text-cream" : "text-ink"
        }`}
      >
        Macra<span className={dark ? "text-ocre" : "text-clay"}>Mari</span>
      </span>
    </a>
  );
}
