import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;

const base = (props: P) => ({
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  viewBox: "0 0 24 24",
  ...props,
});

/* logotipo: nó de macramê estilizado */
export function KnotMark(props: P) {
  return (
    <svg viewBox="0 0 32 32" fill="none" {...props}>
      <circle cx="16" cy="16" r="14.5" stroke="currentColor" strokeWidth="2" />
      <path
        d="M10 9c6 2 6 5 6 7s0 5-6 7M22 9c-6 2-6 5-6 7s0 5 6 7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="16" cy="16" r="1.6" fill="currentColor" />
    </svg>
  );
}

export function BagIcon(props: P) {
  return (
    <svg {...base(props)}>
      <path d="M5 8.5h14l-1.2 11a2 2 0 0 1-2 1.8H8.2a2 2 0 0 1-2-1.8L5 8.5Z" />
      <path d="M8.5 11V6.8a3.5 3.5 0 0 1 7 0V11" />
      <path d="M9.5 15.5c1.5 1.8 3.5 1.8 5 0" strokeDasharray="2.5 2.5" />
    </svg>
  );
}

export function ScissorsIcon(props: P) {
  return (
    <svg {...base(props)}>
      <circle cx="6.5" cy="6.5" r="2.5" />
      <circle cx="6.5" cy="17.5" r="2.5" />
      <path d="M8.7 8.2 20 19M8.7 15.8 20 5" />
    </svg>
  );
}

export function RulerIcon(props: P) {
  return (
    <svg {...base(props)}>
      <rect x="3" y="9" width="18" height="6" rx="1" transform="rotate(-20 12 12)" />
      <path d="m8 12.7 1 2.6M11.5 11.4l.7 1.9M15 10.1l1 2.6M18.4 8.8l.7 1.9" />
    </svg>
  );
}

export function ThreadIcon(props: P) {
  return (
    <svg {...base(props)}>
      <path d="M4 18c4-1 5-6 9-7 3.4-.9 5 1.5 7 1" />
      <path d="M4 14.5c4-1 5-6 9-7" opacity=".55" />
      <circle cx="19.5" cy="6" r="1.4" />
    </svg>
  );
}

export function LeafIcon(props: P) {
  return (
    <svg {...base(props)}>
      <path d="M19 5c-8 0-13 4-13 10 0 2 .8 3.6 2 4.6C9.5 14 13 10 19 5Z" />
      <path d="M6 19.5c3-6 7-9.5 13-13" />
    </svg>
  );
}

export function HandIcon(props: P) {
  return (
    <svg {...base(props)}>
      <path d="M8 11.5V5.8a1.4 1.4 0 0 1 2.8 0v5M10.8 10V4.4a1.4 1.4 0 0 1 2.8 0V10M13.6 10.4V6a1.4 1.4 0 0 1 2.8 0v6.5" />
      <path d="M16.4 12.5c1.8-1.6 3.4-.4 2.4 1.4l-3.2 5.3a5 5 0 0 1-4.3 2.3c-2.6 0-3.9-1.2-5-3.4L4.6 14c-.7-1.3.8-2.5 2-1.6l1.4 1.1" />
    </svg>
  );
}

export function ArrowIcon(props: P) {
  return (
    <svg {...base(props)}>
      <path d="M4 12h15M13.5 5.5 20 12l-6.5 6.5" />
    </svg>
  );
}

export function ArrowDownIcon(props: P) {
  return (
    <svg {...base(props)}>
      <path d="M12 4v15M5.5 13.5 12 20l6.5-6.5" />
    </svg>
  );
}

export function StarIcon(props: P) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="m12 2.5 2.6 6.2 6.7.5-5.1 4.4 1.6 6.6L12 16.6l-5.8 3.6 1.6-6.6-5.1-4.4 6.7-.5L12 2.5Z" />
    </svg>
  );
}

export function CloseIcon(props: P) {
  return (
    <svg {...base(props)}>
      <path d="m6 6 12 12M18 6 6 18" />
    </svg>
  );
}

export function PlusIcon(props: P) {
  return (
    <svg {...base(props)}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function MinusIcon(props: P) {
  return (
    <svg {...base(props)}>
      <path d="M5 12h14" />
    </svg>
  );
}

export function PinIcon(props: P) {
  return (
    <svg {...base(props)}>
      <path d="M12 21s-6.5-5.6-6.5-10.4a6.5 6.5 0 0 1 13 0C18.5 15.4 12 21 12 21Z" />
      <circle cx="12" cy="10.5" r="2.2" />
    </svg>
  );
}

export function ClockIcon(props: P) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </svg>
  );
}

export function TruckIcon(props: P) {
  return (
    <svg {...base(props)}>
      <path d="M3 7h11v9H3zM14 10h4l3 3v3h-7" />
      <circle cx="7" cy="18" r="1.8" />
      <circle cx="17.5" cy="18" r="1.8" />
    </svg>
  );
}

export function CheckIcon(props: P) {
  return (
    <svg {...base(props)}>
      <path d="m4.5 12.5 5 5 10-11" />
    </svg>
  );
}

export function MailIcon(props: P) {
  return (
    <svg {...base(props)}>
      <rect x="3.5" y="5.5" width="17" height="13" rx="1.5" />
      <path d="m4.5 7 7.5 6 7.5-6" />
    </svg>
  );
}

export function InstagramIcon(props: P) {
  return (
    <svg {...base(props)}>
      <rect x="4" y="4" width="16" height="16" rx="4.5" />
      <circle cx="12" cy="12" r="3.6" />
      <circle cx="16.8" cy="7.2" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function WhatsIcon(props: P) {
  return (
    <svg {...base(props)}>
      <path d="M12 3.8a8.2 8.2 0 0 0-7 12.4L4 20l3.9-1a8.2 8.2 0 1 0 4.1-15.2Z" />
      <path d="M9 8.8c-.6 2.7 3.5 6.8 6.2 6.2l.6-1.5-2-1-.9.7c-1-.5-1.9-1.4-2.4-2.4l.7-.9-1-2L9 8.8Z" />
    </svg>
  );
}
