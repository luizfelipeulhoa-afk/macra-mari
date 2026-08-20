import { useMemo, useState, type SyntheticEvent } from "react";
import { DRIVE_FALLBACKS } from "../data/atelier";

interface SmartImgProps {
  src: string;
  alt: string;
  className?: string;
  loading?: "lazy" | "eager";
}

/* Cadeia de resiliência para fotos hospedadas no Drive:
   1) thumbnail redimensionado do Drive
   2) CDN pública do Google (mesmo arquivo)
   3) arte de reserva da série anterior — a página nunca quebra */
export default function SmartImg({
  src,
  alt,
  className = "",
  loading = "lazy",
}: SmartImgProps) {
  const chain = useMemo(() => {
    const out = [src];
    const m = src.match(/[?&]id=([\w-]+)/);
    if (m) {
      const id = m[1];
      out.push(`https://lh3.googleusercontent.com/d/${id}`);
      const fb = DRIVE_FALLBACKS[src] ?? DRIVE_FALLBACKS[`id:${id}`];
      if (fb) out.push(fb);
    }
    return out;
  }, [src]);

  const [idx, setIdx] = useState(0);

  const onError = (e: SyntheticEvent<HTMLImageElement>) => {
    const next = idx + 1;
    if (next < chain.length) {
      setIdx(next);
    } else {
      (e.target as HTMLImageElement).style.visibility = "hidden";
    }
  };

  return (
    <img
      src={chain[idx]}
      alt={alt}
      className={className}
      loading={loading}
      onError={onError}
      referrerPolicy="no-referrer"
    />
  );
}
