import * as THREE from "three";

/* ————————————————————————————————————————————————
   Peças procedurais de macramê em Three.js.
   São a base garantida do palco 3D: renderizam em
   qualquer deploy, sem depender de download externo.
   Se os modelos reais do Drive carregarem, eles
   substituem estas peças (upgrade em segundo plano).
   ———————————————————————————————————————————————— */

const matCream = new THREE.MeshStandardMaterial({ color: 0xf1e3c6, roughness: 0.92 });
const matWood = new THREE.MeshStandardMaterial({ color: 0x8a5a33, roughness: 0.6 });
const matTerra = new THREE.MeshStandardMaterial({ color: 0xc2512b, roughness: 0.85 });
const matMustard = new THREE.MeshStandardMaterial({ color: 0xd89b3d, roughness: 0.82 });
const matDenim = new THREE.MeshStandardMaterial({ color: 0x41608c, roughness: 0.88 });
const matDenimLight = new THREE.MeshStandardMaterial({ color: 0x5d7fae, roughness: 0.85 });

function tubeBetween(a: THREE.Vector3, b: THREE.Vector3, r: number, mat: THREE.Material) {
  const dir = new THREE.Vector3().subVectors(b, a);
  const len = dir.length();
  const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, len, 8), mat);
  m.position.copy(a).addScaledVector(dir, 0.5);
  m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());
  return m;
}

/* ——— wall hanging de macramê ——— */
export function buildWallHanging(): THREE.Group {
  const g = new THREE.Group();
  const W = 2.6;
  const dowelY = 1.5;

  const dowel = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, W + 0.5, 14), matWood);
  dowel.rotation.z = Math.PI / 2;
  dowel.position.y = dowelY;
  g.add(dowel);
  [-1, 1].forEach((s) => {
    const cap = new THREE.Mesh(new THREE.SphereGeometry(0.09, 10, 10), matWood);
    cap.position.set(s * (W / 2 + 0.25), dowelY, 0);
    g.add(cap);
  });

  /* cordão em V para pendurar */
  const apex = new THREE.Vector3(0, dowelY + 0.9, 0);
  [-1, 1].forEach((s) => {
    g.add(tubeBetween(new THREE.Vector3(s * (W / 2 - 0.1), dowelY, 0), apex, 0.022, matWood));
  });
  const topKnot = new THREE.Mesh(new THREE.SphereGeometry(0.07, 10, 10), matTerra);
  topKnot.position.copy(apex);
  g.add(topKnot);

  /* fios verticais */
  const cords = 13;
  const xs: number[] = [];
  for (let i = 0; i < cords; i++) {
    const x = -W / 2 + (i / (cords - 1)) * W;
    xs.push(x);
    g.add(tubeBetween(new THREE.Vector3(x, dowelY, 0), new THREE.Vector3(x, -1.35, 0), 0.026, matCream));
  }

  /* carreiras de nós (losangos) */
  const rows = [
    { y: 0.95, step: 2, mat: matTerra, off: 0 },
    { y: 0.5, step: 2, mat: matMustard, off: 1 },
    { y: 0.05, step: 2, mat: matTerra, off: 0 },
    { y: -0.4, step: 2, mat: matCream, off: 1 },
  ];
  rows.forEach((row) => {
    for (let i = row.off; i < xs.length - 1; i += row.step) {
      const cx = (xs[i] + xs[Math.min(i + 1, xs.length - 1)]) / 2;
      const knot = new THREE.Mesh(new THREE.TorusGeometry(0.075, 0.045, 10, 18), row.mat);
      knot.position.set(cx, row.y, 0.03);
      g.add(knot);
    }
  });

  /* franjas na base */
  xs.forEach((x, i) => {
    const len = 0.55 + Math.abs(Math.sin(i * 1.7)) * 0.4;
    const f = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.01, len, 6), i % 3 === 0 ? matMustard : matCream);
    f.position.set(x, -1.35 - len / 2, 0);
    f.rotation.z = Math.cos(i) * 0.12;
    g.add(f);
  });

  return g;
}

/* ——— blue knitted bag ——— */
export function buildKnitBag(): THREE.Group {
  const g = new THREE.Group();

  /* corpo: lathe arredondado de bolsinha */
  const pts: THREE.Vector2[] = [];
  for (let i = 0; i <= 12; i++) {
    const t = i / 12;
    const y = t * 1.3;
    const r = 0.72 * Math.sin(Math.PI * (0.12 + 0.76 * t)) + 0.16;
    pts.push(new THREE.Vector2(r, y));
  }
  const body = new THREE.Mesh(new THREE.LatheGeometry(pts, 40), matDenim);
  body.position.y = -0.65;
  g.add(body);

  /* canelados do tricô: anéis horizontais */
  for (let i = 0; i < 6; i++) {
    const y = -0.5 + i * 0.2;
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.62 - i * 0.015, 0.028, 8, 40), matDenimLight);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = y;
    g.add(ring);
  }

  /* boca da bolsa */
  const rim = new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.06, 10, 40), matDenimLight);
  rim.rotation.x = Math.PI / 2;
  rim.position.y = 0.66;
  g.add(rim);

  /* alça */
  const handle = new THREE.Mesh(new THREE.TorusGeometry(0.48, 0.05, 10, 40, Math.PI), matDenim);
  handle.position.y = 0.66;
  g.add(handle);

  return g;
}
