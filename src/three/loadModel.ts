import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import JSZip from "jszip";

/* ——— download de arquivos públicos do Drive com cadeia de endpoints ——— */

const endpoints = (id: string) => [
  `https://drive.usercontent.google.com/download?id=${id}&export=download&confirm=t`,
  `https://drive.google.com/uc?export=view&id=${id}`,
  `https://lh3.googleusercontent.com/d/${id}`,
];

async function fetchDrive(id: string): Promise<ArrayBuffer> {
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

/* ——— carrega um modelo empacotado em .zip (glb, gltf+recursos ou obj) ——— */
export async function loadZipModel(driveId: string): Promise<THREE.Group> {
  const buf = await fetchDrive(driveId);
  const zip = await JSZip.loadAsync(buf);
  const files = Object.values(zip.files).filter((f) => !f.dir);
  const find = (ext: string) =>
    files.find((f) => f.name.toLowerCase().endsWith(ext));

  /* 1) .glb dentro do zip */
  const glb = find(".glb");
  if (glb) {
    const data = await glb.async("arraybuffer");
    return new Promise((resolve, reject) => {
      gltfLoader().parse(
        data,
        "",
        (g) => resolve(g.scene as THREE.Group),
        (e) => reject(e)
      );
    });
  }

  /* 2) .gltf com .bin/texturas externos — resolve tudo dentro do zip */
  const gltf = find(".gltf");
  if (gltf) {
    const text = await gltf.async("text");
    const urlMap = new Map<string, string>();
    for (const f of files) {
      const blob = await f.async("blob");
      const url = URL.createObjectURL(blob);
      urlMap.set(f.name, url);
      urlMap.set(f.name.split("/").pop() ?? f.name, url);
    }
    const manager = new THREE.LoadingManager();
    manager.resolveURL = (url: string) => {
      const clean = decodeURIComponent(url.split(/[?#]/)[0]);
      return urlMap.get(clean) ?? urlMap.get(clean.split("/").pop() ?? clean) ?? url;
    };
    return new Promise((resolve, reject) => {
      new GLTFLoader(manager).parse(
        text,
        "",
        (g) => resolve(g.scene as THREE.Group),
        (e) => reject(e)
      );
    });
  }

  /* 3) .obj — aplica material de algodão cru */
  const obj = find(".obj");
  if (obj) {
    const text = await obj.async("text");
    const parsed = new OBJLoader().parse(text);
    const cotton = new THREE.MeshStandardMaterial({
      color: 0xeee1c4,
      roughness: 0.92,
    });
    parsed.traverse((o) => {
      const m = o as THREE.Mesh;
      if (m.isMesh && (!m.material || (m.material as THREE.Material).name === "")) {
        m.material = cotton;
      }
    });
    return parsed as THREE.Group;
  }

  throw new Error("zip sem formato 3D reconhecido (glb/gltf/obj)");
}
