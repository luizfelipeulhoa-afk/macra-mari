import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;

function Base({ children, ...props }: P) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

/** Marca da casa: um nó de quatro laçadas. */
export function KnotMark(props: P) {
  return (
    <Base {...props}>
      <path d="M12 2.2c2.4 2.6 2.4 5.3 0 7.8-2.4-2.5-2.4-5.2 0-7.8Z" />
      <path d="M12 21.8c-2.4-2.6-2.4-5.3 0-7.8 2.4 2.5 2.4 5.2 0 7.8Z" />
      <path d="M2.2 12c2.6-2.4 5.3-2.4 7.8 0-2.5 2.4-5.2 2.4-7.8 0Z" />
      <path d="M21.8 12c-2.6 2.4-5.3 2.4-7.8 0 2.5-2.4 5.2-2.4 7.8 0Z" />
      <circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none" />
    </Base>
  );
}

export function CottonIcon(props: P) {
  return (
    <Base {...props}>
      <circle cx="9" cy="9" r="3.4" />
      <circle cx="15.2" cy="10.4" r="2.9" />
      <circle cx="11.4" cy="14.2" r="2.7" />
      <path d="M12.6 16.6c.6 2.4 2.2 3.9 4.6 4.4M14.6 18l-1.2 1.4" />
    </Base>
  );
}

export function DyeIcon(props: P) {
  return (
    <Base {...props}>
      <path d="M12 3.2c3.2 3.9 5.6 6.9 5.6 10a5.6 5.6 0 0 1-11.2 0c0-3.1 2.4-6.1 5.6-10Z" />
      <path d="M9.4 13.4a2.8 2.8 0 0 0 2.4 3" />
    </Base>
  );
}

export function WoodIcon(props: P) {
  return (
    <Base {...props}>
      <ellipse cx="7" cy="12" rx="3.4" ry="6.5" />
      <path d="M7 5.5h10.5c1.9 0 3.3 2.9 3.3 6.5s-1.4 6.5-3.3 6.5H7" />
      <ellipse cx="7" cy="12" rx="1.3" ry="2.6" />
    </Base>
  );
}

export function ParcelIcon(props: P) {
  return (
    <Base {...props}>
      <path d="M4 8.2 12 4l8 4.2v7.6L12 20l-8-4.2V8.2Z" />
      <path d="M4 8.2l8 4 8-4M12 12.2V20M8 6.2l8 4" />
    </Base>
  );
}

export function BagIcon(props: P) {
  return (
    <Base {...props}>
      <path d="M5.5 8.5h13l-1 11a1.6 1.6 0 0 1-1.6 1.5H8.1A1.6 1.6 0 0 1 6.5 19.5l-1-11Z" />
      <path d="M8.8 8.5V7a3.2 3.2 0 0 1 6.4 0v1.5" />
    </Base>
  );
}

export function ArrowRight(props: P) {
  return (
    <Base {...props}>
      <path d="M4 12h16M13.5 5.5 20 12l-6.5 6.5" />
    </Base>
  );
}

export function ArrowUpRight(props: P) {
  return (
    <Base {...props}>
      <path d="M6.5 17.5 17.5 6.5M8.5 6.5h9v9" />
    </Base>
  );
}

export function PlusIcon(props: P) {
  return (
    <Base {...props}>
      <path d="M12 5v14M5 12h14" />
    </Base>
  );
}

export function MinusIcon(props: P) {
  return (
    <Base {...props}>
      <path d="M5 12h14" />
    </Base>
  );
}

export function XIcon(props: P) {
  return (
    <Base {...props}>
      <path d="m6 6 12 12M18 6 6 18" />
    </Base>
  );
}

export function CheckIcon(props: P) {
  return (
    <Base {...props}>
      <path d="m4.5 12.5 5 5L19.5 7" />
    </Base>
  );
}

export function StarIcon(props: P) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12 2.8l2.6 5.6 6.1.7-4.5 4.2 1.2 6-5.4-3-5.4 3 1.2-6-4.5-4.2 6.1-.7L12 2.8Z" />
    </svg>
  );
}

export function PauseIcon(props: P) {
  return (
    <Base {...props}>
      <path d="M9 5.5v13M15 5.5v13" strokeWidth={2} />
    </Base>
  );
}

export function PlayIcon(props: P) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M8 5.2v13.6L19 12 8 5.2Z" />
    </svg>
  );
}

export function MenuIcon(props: P) {
  return (
    <Base {...props}>
      <path d="M4 7h16M4 12h16M4 17h10" />
    </Base>
  );
}

export function TruckIcon(props: P) {
  return (
    <Base {...props}>
      <path d="M2.5 6h11v10h-11zM13.5 9.5h4L21 13v3h-3.5" />
      <circle cx="7" cy="17.5" r="1.8" />
      <circle cx="16.5" cy="17.5" r="1.8" />
    </Base>
  );
}

export function SpoolIcon(props: P) {
  return (
    <Base {...props}>
      <path d="M6 4h12M6 20h12M8 4v16M16 4v16" />
      <path d="M8 8.5h8M8 12h8M8 15.5h8" />
    </Base>
  );
}

export function HandHeartIcon(props: P) {
  return (
    <Base {...props}>
      <path d="M12 8.6c1-2.4 4.6-2.5 5.4-.2.7 2-1.7 4-5.4 6.8-3.7-2.8-6.1-4.8-5.4-6.8.8-2.3 4.4-2.2 5.4.2Z" />
      <path d="M3.5 20.5c2.5-.4 4-1.4 5-3M20.5 20.5c-2.5-.4-4-1.4-5-3" />
    </Base>
  );
}

export function InstagramIcon(props: P) {
  return (
    <Base {...props}>
      <rect x="4" y="4" width="16" height="16" rx="4.5" />
      <circle cx="12" cy="12" r="3.6" />
      <circle cx="16.8" cy="7.2" r="0.9" fill="currentColor" stroke="none" />
    </Base>
  );
}

export function PinterestIcon(props: P) {
  return (
    <Base {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M10.2 20 12 13M9 9.2A3.2 3.2 0 1 1 15 11c-.6 1.7-2 2.6-3.4 2.2" />
    </Base>
  );
}

export function WhatsAppIcon(props: P) {
  return (
    <Base {...props}>
      <path d="M12 3.5a8.5 8.5 0 0 0-7.3 12.8L3.5 20.5l4.3-1.1A8.5 8.5 0 1 0 12 3.5Z" />
      <path d="M9 8.8c-.4 1.6.8 4 2.4 5.2 1.2.9 2.6 1.3 3.6.8l.5-1.2-1.9-1-.8.7c-.8-.4-1.6-1.3-1.9-2.1l.7-.8-.9-1.9L9 8.8Z" />
    </Base>
  );
}

export function LeafIcon(props: P) {
  return (
    <Base {...props}>
      <path d="M19.5 4.5C12 4.5 5.5 8.5 5.5 15.5c0 2 .8 3.4 2 4 6.5 0 12-5.5 12-15Z" />
      <path d="M5.5 19.5C9 14 13 10.5 17.5 8" />
    </Base>
  );
}
