/* ————————————————————————————————————————————————
   Coreografia do showroom 360° — compartilhada entre a
   peça 2D (PNG) e o modelo 3D (GLB). O giro mantém velocidade
   constante; câmera e texto respiram sem travar a peça.
   ———————————————————————————————————————————————— */

export interface Pose {
  deg: number; /* rotação acumulada (0 → 360) */
  zoom: number; /* escala da câmera */
  y: number; /* deriva vertical, fração da altura */
}

interface Key extends Pose {
  p: number;
}

/* Os platôs seguram apenas enquadramento e altura; o giro segue contínuo. */
const K: Key[] = [
  { p: 0.0, deg: 0, zoom: 0.82, y: -0.03 },
  { p: 0.08, deg: 24, zoom: 0.9, y: 0 },
  { p: 0.2, deg: 24, zoom: 0.9, y: 0 }, /* pausa — cap. 01 · o fio */
  { p: 0.3, deg: 112, zoom: 1.16, y: 0.015 },
  { p: 0.42, deg: 112, zoom: 1.16, y: 0.015 }, /* pausa — cap. 02 · o nó */
  { p: 0.52, deg: 202, zoom: 0.94, y: -0.01 },
  { p: 0.64, deg: 202, zoom: 0.94, y: -0.01 }, /* pausa — cap. 03 · o tempo */
  { p: 0.74, deg: 292, zoom: 1.2, y: 0.02 },
  { p: 0.82, deg: 292, zoom: 1.2, y: 0.02 }, /* pausa — cap. 04 · a mão */
  { p: 0.90, deg: 360, zoom: 1.0, y: 0 },
  { p: 1.0, deg: 360, zoom: 1.0, y: 0 },
];

/* smootherstep evita mudança perceptível de aceleração nos cortes de câmera. */
const smooth = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const TURN_END = 0.9;

export function sample(p: number): Pose {
  const x = Math.min(1, Math.max(0, p));
  for (let i = 0; i < K.length - 1; i++) {
    const a = K[i];
    const b = K[i + 1];
    if (x >= a.p && x <= b.p) {
      const t = smooth((x - a.p) / Math.max(b.p - a.p, 1e-6));
      return {
        deg: Math.min(x / TURN_END, 1) * 360,
        zoom: lerp(a.zoom, b.zoom, t),
        y: lerp(a.y, b.y, t),
      };
    }
  }
  const last = K[K.length - 1];
  return { deg: last.deg, zoom: last.zoom, y: last.y };
}

/* janelas de pausa — onde cada capítulo respira */
export const HOLDS = [
  { from: 0.08, to: 0.2 },
  { from: 0.3, to: 0.42 },
  { from: 0.52, to: 0.64 },
  { from: 0.74, to: 0.86 },
];

/* rampas entre capítulos — onde as linhas de corte atravessam */
export const MOVES = [
  { from: 0.2, to: 0.3 },
  { from: 0.42, to: 0.52 },
  { from: 0.64, to: 0.74 },
  { from: 0.86, to: 0.94 },
];

export const FINAL_AT = 0.9;

/** A continuous lens move layered over the complete object revolution. */
export function sampleCamera(p: number) {
  const keys = [
    {p:0, dolly:1, offset:0, focus:0},
    {p:.08, dolly:1.05, offset:-.28, focus:0},
    {p:.20, dolly:1.05, offset:-.28, focus:0},
    {p:.30, dolly:1.28, offset:.26, focus:.1},
    {p:.42, dolly:1.28, offset:.26, focus:.1},
    {p:.52, dolly:1.08, offset:-.28, focus:0},
    {p:.64, dolly:1.08, offset:-.28, focus:0},
    {p:.74, dolly:1.22, offset:.26, focus:-.06},
    {p:.82, dolly:1.22, offset:.26, focus:-.06},
    {p:.90, dolly:1, offset:0, focus:-.04},
    {p:1, dolly:1, offset:0, focus:-.04},
  ];
  const x=Math.max(0,Math.min(1,p));
  for(let i=0;i<keys.length-1;i++) {
    const a=keys[i],b=keys[i+1];
    if(x<=b.p){const t=smooth((x-a.p)/(b.p-a.p));return {dolly:lerp(a.dolly,b.dolly,t),offset:lerp(a.offset,b.offset,t),focus:lerp(a.focus,b.focus,t)};}
  }
  return keys[keys.length-1];
}
