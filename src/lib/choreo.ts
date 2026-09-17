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

export interface CameraShot {
  dolly: number;
  offset: number;
  focus: number;
  fov: number;
  roll: number;
}

interface CameraKey extends CameraShot { p: number }

/*
 * Travelling de campanha: plano geral → detalhe do nó → recuo → detalhe das
 * franjas → hero shot. Catmull-Rom mantém velocidade e direção contínuas nos
 * pontos de passagem, sem os platôs mecânicos da versão anterior.
 */
const CAMERA_KEYS: CameraKey[] = [
  { p: 0,    dolly: .92, offset: 0,    focus: .03,  fov: 34, roll: 0 },
  { p: .12,  dolly: 1.08, offset: -.14, focus: .15,  fov: 31, roll: -.45 },
  { p: .29,  dolly: 1.43, offset: .23,  focus: .2,   fov: 27, roll: .7 },
  { p: .47,  dolly: 1.1,  offset: -.2,  focus: -.06, fov: 32, roll: -.35 },
  { p: .65,  dolly: 1.48, offset: .2,   focus: -.18, fov: 26, roll: .6 },
  { p: .8,   dolly: 1.16, offset: -.12, focus: .06,  fov: 30, roll: -.25 },
  { p: .92,  dolly: .96, offset: 0,     focus: 0,    fov: 34, roll: 0 },
  { p: 1,    dolly: .9,  offset: 0,     focus: -.02, fov: 35, roll: 0 },
];

const catmull = (a: number, b: number, c: number, d: number, t: number) => {
  const t2 = t * t;
  const t3 = t2 * t;
  return .5 * ((2 * b) + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t2 + (-a + 3 * b - 3 * c + d) * t3);
};

export function sampleCamera(p: number): CameraShot {
  const x = Math.max(0, Math.min(1, p));
  let i = CAMERA_KEYS.findIndex((key) => x <= key.p);
  if (i <= 0) return { ...CAMERA_KEYS[0] };
  if (i < 0) return { ...CAMERA_KEYS[CAMERA_KEYS.length - 1] };
  const b = CAMERA_KEYS[i - 1];
  const c = CAMERA_KEYS[i];
  const a = CAMERA_KEYS[Math.max(0, i - 2)];
  const d = CAMERA_KEYS[Math.min(CAMERA_KEYS.length - 1, i + 1)];
  const t = (x - b.p) / Math.max(c.p - b.p, 1e-6);
  return {
    dolly: Math.max(.86, Math.min(1.52, catmull(a.dolly, b.dolly, c.dolly, d.dolly, t))),
    offset: catmull(a.offset, b.offset, c.offset, d.offset, t),
    focus: catmull(a.focus, b.focus, c.focus, d.focus, t),
    fov: catmull(a.fov, b.fov, c.fov, d.fov, t),
    roll: catmull(a.roll, b.roll, c.roll, d.roll, t),
  };
}
