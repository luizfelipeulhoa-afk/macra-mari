import { useMemo, useState, type SyntheticEvent } from "react";
import { wixImg, BRAND } from "../data/atelier";

interface SmartImgProps {
  src: string;
  alt: string;
  className?: string;
  loading?: "lazy" | "eager";
}

/* Cadeia de resiliência de imagem:
   1) fonte original (CDN Wix com AVIF/redimensionamento)
   2) mesma foto em PNG direto da CDN (sem transformação)
   3) foto de capa do ateliê — a página nunca fica quebrada */
export default function SmartImg({
  src,
  alt,
  className = "",
  loading = "lazy",
}: SmartImgProps) {
  const chain = useMemo(() => {
    const out = [src];
    const m = src.match(/\/media\/([^/]+)~mv2\.(jpe?g|png)/);
    if (m) {
      out.push(
        `https://static.wixstatic.com/media/${m[1]}~mv2.${m[2]}`
      );
    }
    out.push(wixImg(BRAND.cover, 900, 1125));
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
    />
  );
}
