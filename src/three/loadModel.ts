import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

/* ——— download de arquivos públicos do Drive com cadeia de endpoints ——— */

const endpoints = (id: string) => [
  `https://drive.usercontent.google.com/download?id=${id}&export=download&confirm=t`,
  `https://drive.google.com/uc?export=view&id=${id}`,
  `https://lh3.googleusercontent.com/d/${id}`,
];

/* cache por id: o mesmo modelo nunca é baixado duas vezes */
const dlCache = new Map<string, Promise<ArrayBuffer>>();

async function fetchDrive(id: string): Promise<ArrayBuffer> {
  const hit = dlCache.get(id);
  if (hit) return hit;
  const p = doFetch(id);
  dlCache.set(id, p);
  p.catch(() => dlCache.delete(id));
  return p;
}

async function doFetch(id: string): Promise<ArrayBuffer> {
  let lastErr: unknown = new Error("todos os endpoints falharam");
  for (const url of endpoints(id)) {
    try {
      const res = await fetch(url, { redirect: "follow" });
      if (!res.ok) continue;
      const type = res.headers.get("content-type") ?? "";
      if (type.includes("text/html")) continue; /* página de erro/scan */
      const buf = await res.arrayBuffer();
      if (buf.byteLength > 1024) return buf;
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr;
}

const gltfLoader = () => new GLTFLoader();

/* normaliza: centraliza e escala para a altura-alvo */
export function normalize(obj: THREE.Object3D, targetH: number): THREE.Group {
  const wrap = new THREE.Group();
  const box = new THREE.Box3().setFromObject(obj);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  const s = targetH / Math.max(size.y, 0.001);
  obj.position.sub(center);
  obj.position.y += (size.y * s) / 2 - targetH / 2;
  obj.scale.setScalar(s);
  wrap.add(obj);
  return wrap;
}

/* ——— carrega um .glb direto do Drive ——— */
export async function loadGlb(driveId: string): Promise<THREE.Group> {
  const buf = await fetchDrive(driveId);
  return new Promise((resolve, reject) => {
    gltfLoader().parse(
      buf,
      "",
      (gltf) => resolve(gltf.scene as THREE.Group),
      (err) => reject(err)
    );
  });
}
