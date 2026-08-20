import * as THREE from "three";

export type ModelId =
  | "mandala"
  | "quadro"
  | "portaVaso"
  | "bolsa"
  | "portaCopos"
  | "guirlanda";

export const PALETTE = {
  cream: 0xefe6d3,
  linen: 0xf5edda,
  sand: 0xdcc9a4,
  walnut: 0x7a5a3c,
  bark: 0x4e371f,
  olive: 0x7d7f52,
  oliveDark: 0x5f6038,
  clay: 0xa97e55,
};

function mat(color: number, roughness = 0.92) {
  return new THREE.MeshStandardMaterial({ color, roughness, metalness: 0.02 });
}

function cord(radius: number, length: number, material: THREE.Material) {
  return new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, length, 6), material);
}

function knot(radius: number, material: THREE.Material) {
  return new THREE.Mesh(new THREE.IcosahedronGeometry(radius, 1), material);
}

function ring(radius: number, tube: number, material: THREE.Material) {
  return new THREE.Mesh(new THREE.TorusGeometry(radius, tube, 10, 64), material);
}

function tubeBetween(
  a: THREE.Vector3,
  b: THREE.Vector3,
  c: THREE.Vector3,
  radius: number,
  material: THREE.Material
) {
  const curve = new THREE.QuadraticBezierCurve3(a, c, b);
  const mesh = new THREE.Mesh(new THREE.TubeGeometry(curve, 14, radius, 6, false), material);
  return { mesh, curve };
}

/* ---------------------------------- Mandala --------------------------------- */
function buildMandala(): THREE.Group {
  const g = new THREE.Group();
  const cream = mat(PALETTE.cream);
  const sand = mat(PALETTE.sand);
  const walnut = mat(PALETTE.walnut);
  const olive = mat(PALETTE.olive);
  const clay = mat(PALETTE.clay);

  const hoop = ring(1.5, 0.055, walnut);
  g.add(hoop);

  const r1 = ring(1.15, 0.042, cream);
  const r2 = ring(0.82, 0.038, sand);
  const r3 = ring(0.5, 0.034, olive);
  g.add(r1, r2, r3);

  // nós sobre cada anel
  const knotRow = (radius: number, count: number, size: number, material: THREE.Material) => {
    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2;
      const k = knot(size, material);
      k.position.set(Math.cos(a) * radius, Math.sin(a) * radius, 0.03);
      g.add(k);
    }
  };
  knotRow(1.15, 14, 0.055, sand);
  knotRow(0.82, 10, 0.05, cream);
  knotRow(0.5, 8, 0.045, clay);

  // raios do centro
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2 + Math.PI / 8;
    const spoke = cord(0.012, 1.12, cream);
    spoke.position.set(Math.cos(a) * 0.56, Math.sin(a) * 0.56, 0);
    spoke.rotation.z = a - Math.PI / 2;
    g.add(spoke);
  }

  const center = knot(0.13, clay);
  g.add(center);
  const centerKnot = knot(0.07, cream);
  centerKnot.position.z = 0.08;
  g.add(centerKnot);

  // franja inferior
  for (let i = 0; i < 21; i++) {
    const x = -1.4 + (i / 20) * 2.8;
    const len = 0.5 + Math.sin((i / 20) * Math.PI) * 0.55;
    const strand = cord(0.011, len, i % 2 === 0 ? sand : cream);
    strand.position.set(x, -1.5 - len / 2, 0);
    g.add(strand);
  }

  return g;
}

/* ---------------------------------- Quadro ---------------------------------- */
function buildQuadro(): THREE.Group {
  const g = new THREE.Group();
  const cream = mat(PALETTE.cream);
  const sand = mat(PALETTE.sand);
  const walnut = mat(PALETTE.walnut);
  const clay = mat(PALETTE.clay);

  const dowel = cord(0.045, 2.4, walnut);
  dowel.rotation.z = Math.PI / 2;
  dowel.position.y = 1.0;
  g.add(dowel);

  // cordas de pendurar
  for (const side of [-1, 1]) {
    const { mesh } = tubeBetween(
      new THREE.Vector3(side * 1.05, 1.0, 0),
      new THREE.Vector3(0, 1.85, 0),
      new THREE.Vector3(side * 0.5, 1.55, 0),
      0.012,
      sand
    );
    g.add(mesh);
  }

  // fios verticais (urdidura)
  const lengths = [1.5, 1.75, 1.95, 2.1, 2.25, 2.4, 2.45, 2.4, 2.25, 2.1, 1.95, 1.75, 1.5];
  lengths.forEach((len, i) => {
    const x = -1.14 + (i / (lengths.length - 1)) * 2.28;
    const strand = cord(0.011, len, cream);
    strand.position.set(x, 1.0 - len / 2, 0);
    g.add(strand);
    // franja na ponta
    const fringe = cord(0.008, 0.34, sand);
    fringe.position.set(x, 1.0 - len - 0.17, 0);
    g.add(fringe);
  });

  // losango tramado ao centro
  const diamond = new THREE.Mesh(new THREE.BoxGeometry(0.98, 0.98, 0.02), sand);
  diamond.rotation.z = Math.PI / 4;
  diamond.position.set(0, -0.05, 0.02);
  g.add(diamond);
  const diamondInner = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.55, 0.02), cream);
  diamondInner.rotation.z = Math.PI / 4;
  diamondInner.position.set(0, -0.05, 0.05);
  g.add(diamondInner);

  // contas nas pontas do losango
  const tips: Array<[number, number]> = [
    [0, 0.65],
    [0.7, -0.05],
    [0, -0.75],
    [-0.7, -0.05],
  ];
  tips.forEach(([x, y]) => {
    const k = knot(0.05, clay);
    k.position.set(x, y, 0.05);
    g.add(k);
  });

  // fileira de nós
  for (let i = 0; i < 9; i++) {
    const x = -0.8 + (i / 8) * 1.6;
    const k = knot(0.04, i % 2 === 0 ? sand : clay);
    k.position.set(x, 0.78, 0.03);
    g.add(k);
  }

  g.position.y = -0.15;
  return g;
}

/* -------------------------------- Porta-vasos ------------------------------- */
function buildPortaVaso(): THREE.Group {
  const g = new THREE.Group();
  const cream = mat(PALETTE.cream);
  const sand = mat(PALETTE.sand);
  const clay = mat(PALETTE.clay, 0.85);
  const olive = mat(PALETTE.olive);
  const oliveDark = mat(PALETTE.oliveDark);
  const bark = mat(PALETTE.bark);

  const loop = ring(0.15, 0.03, mat(PALETTE.walnut));
  loop.rotation.x = Math.PI / 2;
  loop.position.y = 1.45;
  g.add(loop);

  const topKnot = knot(0.075, cream);
  topKnot.position.y = 1.26;
  g.add(topKnot);

  // vaso de cerâmica (perfil torneado)
  const profile = [
    new THREE.Vector2(0.02, 0),
    new THREE.Vector2(0.34, 0),
    new THREE.Vector2(0.43, 0.1),
    new THREE.Vector2(0.46, 0.32),
    new THREE.Vector2(0.38, 0.5),
    new THREE.Vector2(0.41, 0.54),
  ];
  const pot = new THREE.Mesh(new THREE.LatheGeometry(profile, 24), clay);
  pot.position.y = -0.75;
  g.add(pot);

  const soil = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.05, 20), bark);
  soil.position.y = -0.75 + 0.5;
  g.add(soil);

  // planta
  for (let i = 0; i < 3; i++) {
    const stem = cord(0.012, 0.42, oliveDark);
    stem.position.set((i - 1) * 0.1, -0.05, 0);
    stem.rotation.z = (i - 1) * 0.22;
    g.add(stem);
  }
  const leafSpots: Array<[number, number, number, number]> = [
    [0, 0.22, 0, 0.17],
    [-0.2, 0.08, 0.06, 0.13],
    [0.22, 0.1, -0.05, 0.14],
    [-0.08, 0.34, -0.08, 0.11],
    [0.12, 0.32, 0.08, 0.12],
    [0, 0.05, 0.16, 0.1],
  ];
  leafSpots.forEach(([x, y, z, r], i) => {
    const leaf = knot(r, i % 2 === 0 ? olive : oliveDark);
    leaf.position.set(x, y, z);
    g.add(leaf);
  });

  // pernas de nós até a borda do vaso
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
    const end = new THREE.Vector3(Math.cos(a) * 0.42, -0.28, Math.sin(a) * 0.42);
    const ctrl = new THREE.Vector3(Math.cos(a) * 0.62, 0.5, Math.sin(a) * 0.62);
    const { mesh, curve } = tubeBetween(new THREE.Vector3(0, 1.24, 0), end, ctrl, 0.014, cream);
    g.add(mesh);
    const bead = knot(0.045, i % 2 === 0 ? sand : clay);
    bead.position.copy(curve.getPoint(0.5));
    g.add(bead);
  }

  return g;
}

/* ----------------------------------- Bolsa ---------------------------------- */
function buildBolsa(): THREE.Group {
  const g = new THREE.Group();
  const cream = mat(PALETTE.cream);
  const sand = mat(PALETTE.sand);
  const clay = mat(PALETTE.clay);

  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.58, 0.5, 0.85, 24), cream);
  body.scale.z = 0.55;
  body.position.y = -0.15;
  g.add(body);

  const rim = ring(0.58, 0.032, sand);
  rim.scale.z = 0.55;
  rim.rotation.x = Math.PI / 2;
  rim.position.y = 0.27;
  g.add(rim);

  const handle = new THREE.Mesh(
    new THREE.TorusGeometry(0.46, 0.034, 10, 40, Math.PI),
    sand
  );
  handle.position.y = 0.3;
  g.add(handle);

  // malha de nós na frente
  const rows = [
    { y: 0.12, xs: [-0.32, -0.11, 0.11, 0.32] },
    { y: -0.06, xs: [-0.22, 0, 0.22] },
    { y: -0.24, xs: [-0.32, -0.11, 0.11, 0.32] },
    { y: -0.42, xs: [-0.2, 0.02, 0.24] },
  ];
  rows.forEach((row, ri) => {
    row.xs.forEach((x) => {
      const k = knot(0.03, ri % 2 === 0 ? sand : clay);
      const z = Math.sqrt(Math.max(0.06, 0.54 * 0.54 - x * x)) * 0.55 + 0.025;
      k.position.set(x, row.y, z);
      g.add(k);
    });
  });

  // tassel lateral
  const tasselKnot = knot(0.05, clay);
  tasselKnot.position.set(0.52, 0.1, 0.12);
  g.add(tasselKnot);
  for (let i = 0; i < 5; i++) {
    const strand = cord(0.007, 0.2, sand);
    strand.position.set(0.52 + (i - 2) * 0.018, -0.05, 0.12);
    strand.rotation.z = (i - 2) * 0.06;
    g.add(strand);
  }

  g.rotation.y = -0.45;
  return g;
}

/* -------------------------------- Porta-copos ------------------------------- */
function buildCoaster(tintA: number, tintB: number): THREE.Group {
  const c = new THREE.Group();
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.42, 0.05, 28), mat(tintA));
  c.add(base);
  const r1 = ring(0.28, 0.022, mat(tintB));
  r1.rotation.x = Math.PI / 2;
  r1.position.y = 0.032;
  c.add(r1);
  const r2 = ring(0.15, 0.02, mat(tintB));
  r2.rotation.x = Math.PI / 2;
  r2.position.y = 0.036;
  c.add(r2);
  const k = knot(0.05, mat(PALETTE.clay));
  k.position.y = 0.05;
  c.add(k);
  return c;
}

function buildPortaCopos(): THREE.Group {
  const g = new THREE.Group();

  const a = buildCoaster(PALETTE.cream, PALETTE.sand);
  a.position.set(-0.28, 0, 0.12);
  const b = buildCoaster(PALETTE.sand, PALETTE.olive);
  b.position.set(0.32, 0, -0.18);
  b.rotation.y = 0.7;
  const c = buildCoaster(PALETTE.olive, PALETTE.cream);
  c.rotation.x = -1.15;
  c.rotation.y = 0.35;
  c.position.set(0.05, 0.24, -0.42);

  g.add(a, b, c);
  g.rotation.x = -0.92;
  g.rotation.y = 0.18;
  return g;
}

/* --------------------------------- Guirlanda -------------------------------- */
function buildGuirlanda(): THREE.Group {
  const g = new THREE.Group();
  const cream = mat(PALETTE.cream);
  const sand = mat(PALETTE.sand);
  const walnut = mat(PALETTE.walnut);
  const olive = mat(PALETTE.olive);

  const main = cord(0.016, 2.7, walnut);
  main.rotation.z = Math.PI / 2;
  main.position.y = 0.85;
  g.add(main);

  const lengths = [0.45, 0.75, 1.05, 1.35, 1.55, 1.35, 1.05, 0.75, 0.45];
  lengths.forEach((len, i) => {
    const x = -1.2 + (i / (lengths.length - 1)) * 2.4;
    const strand = cord(0.011, len, cream);
    strand.position.set(x, 0.85 - len / 2, 0);
    g.add(strand);

    const bead1 = knot(0.045, i % 2 === 0 ? walnut : olive);
    bead1.position.set(x, 0.85 - len * 0.38, 0.02);
    const bead2 = knot(0.04, i % 2 === 0 ? olive : walnut);
    bead2.position.set(x, 0.85 - len * 0.68, 0.02);
    g.add(bead1, bead2);

    // tufo na ponta
    for (let t = 0; t < 3; t++) {
      const tuft = cord(0.006, 0.18, sand);
      tuft.position.set(x + (t - 1) * 0.014, 0.85 - len - 0.08, 0);
      tuft.rotation.z = (t - 1) * 0.14;
      g.add(tuft);
    }
  });

  for (const side of [-1, 1]) {
    const loop = ring(0.06, 0.012, sand);
    loop.position.set(side * 1.38, 0.85, 0);
    g.add(loop);
  }

  return g;
}

/* ---------------------------------- factory --------------------------------- */
export function buildModel(id: ModelId): THREE.Group {
  switch (id) {
    case "mandala":
      return buildMandala();
    case "quadro":
      return buildQuadro();
    case "portaVaso":
      return buildPortaVaso();
    case "bolsa":
      return buildBolsa();
    case "portaCopos":
      return buildPortaCopos();
    case "guirlanda":
      return buildGuirlanda();
  }
}

/** Libera geometrias e materiais de um objeto (e descendentes). */
export function disposeObject(root: THREE.Object3D) {
  root.traverse((obj) => {
    if (obj instanceof THREE.Mesh) {
      obj.geometry?.dispose();
      const m = obj.material;
      if (Array.isArray(m)) m.forEach((mm) => mm.dispose());
      else m?.dispose();
    }
  });
}
