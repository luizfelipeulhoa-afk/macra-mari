export const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
export const smooth = (value: number) => {
  const t = clamp01(value);
  return t * t * (3 - 2 * t);
};

// Cada ponto da corda fecha em ordem; voltar o scroll desfaz a mesma trajetória.
export function cordAssembly(progress: number, along: number, strand: number) {
  return smooth((progress - 0.18 - along * 0.28 - strand * 0.012) / 0.38);
}

export function constructionChapter(progress: number) {
  return progress < 0.22 ? 0 : progress < 0.48 ? 1 : progress < 0.78 ? 2 : 3;
}
