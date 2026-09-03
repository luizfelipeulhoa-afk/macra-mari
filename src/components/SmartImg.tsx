import { useMemo, useState, type SyntheticEvent } from "react";
import { products, driveThumb } from "../data/atelier";

interface SmartImgProps {
  src: string;
  alt: string;
  className?: string;
  loading?: "lazy" | "eager";
}

/* Cadeia de resiliência (só fotos do Drive):
   1) thumbnail redimensionado
   2) CDN pública do Google (mesmo arquivo)
   3) outra foto do Drive — a página nunca fica quebrada */
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
      out.push(`https://lh3.googleusercontent.com/d/${m[1]}`);
    }
    out.push(products[0].img);
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

export { driveThumb };
