import { scrollToId } from "../lib/motion";

/* Logo original em corda, inteiramente vetorial. */
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
      <img
        src="/brand/macramari-logo.svg"
        alt=""
        aria-hidden="true"
        width="120"
        height="26"
        className="h-auto w-[120px] shrink-0"
      />
      <span
        className={`hidden font-display text-[21px] font-extrabold leading-none tracking-tight sm:inline ${
          dark ? "text-cream" : "text-ink"
        }`}
      >
        Macra<span className={dark ? "text-ocre" : "text-clay"}>Mari</span>
      </span>
    </a>
  );
}
