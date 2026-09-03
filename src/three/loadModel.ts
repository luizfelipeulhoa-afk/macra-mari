import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

/* ————————————————————————————————————————————————
   Carregador de GLB à prova de falhas:
   · tenta fontes em ordem (local primeiro — mesma origem nunca
     sofre bloqueio de CORS — e o Drive como reserva);
   · valida os "magic bytes" do glTF (uma página HTML do Drive
     disfarçada de download é rejeitada na hora);
   · timeout por tentativa para nenhuma fonte travar a fila;
   · cache por conjunto de fontes (uma única descarga por sessão).
   ———————————————————————————————————————————————— */

const GLB_MAGIC = 0x46546c67; /* 'glTF' em little-endian */

const isGlb = (buf: ArrayBuffer) =>
  buf.byteLength > 12 && new DataView(buf).getUint32(0, true) === GLB_MAGIC;

const driveEndpoints = (id: string) => [
  /* CDN direta do Drive — a mais amigável para CORS */
  `https://lh3.googleusercontent.com/d/${id}`,
  `https://drive.usercontent.google.com/download?id=${id}&export=download&confirm=t`,
  `https://drive.google.com/uc?export=download&id=${id}&confirm=t`,
];

async function fetchBytes(url: string, timeoutMs = 25000): Promise<ArrayBuffer> {
  const ctrl = new AbortController();
  const t = window.setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: ctrl.signal, redirect: "follow" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const type = res.headers.get("content-type") ?? "";
    if (type.includes("text/html")) throw new Error("página HTML do Drive (não é o arquivo)");
    const buf = await res.arrayBuffer();
    if (!isGlb(buf)) throw new Error("conteúdo não é um GLB válido");
    return buf;
  } finally {
    window.clearTimeout(t);
  }
}

const dlCache = new Map<string, Promise<ArrayBuffer>>();

export async function fetchGlb(sources: string[]): Promise<ArrayBuffer> {
  const key = sources.join("|");
  const hit = dlCache.get(key);
  if (hit) return hit;

  const p = (async () => {
    const log: string[] = [];
    for (const url of sources) {
      try {
        const buf = await fetchBytes(url);
        console.info(`[macramari] modelo 3D carregado de: ${url}`);
        return buf;
      } catch (e) {
        log.push(`  ✗ ${url} → ${(e as Error).message}`);
      }
    }
    console.info(
      "[macramari] nenhuma fonte entregou o modelo 3D:\n" +
        log.join("\n") +
        "\nSolução definitiva: salve o .glb como public/models/wall-hanging.glb no projeto e rode o build — o carregamento passa a ser de mesma origem (100% confiável)."
    );
    throw new Error("todas as fontes falharam");
  })();

  dlCache.set(key, p);
  p.catch(() => dlCache.delete(key));
  return p;
}

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

/* carrega o GLB tentando o local antes do Drive */
export async function loadGlbSmart(localPath: string, driveId: string): Promise<THREE.Group> {
  const buf = await fetchGlb([localPath, ...driveEndpoints(driveId)]);
  return new Promise((resolve, reject) => {
    new GLTFLoader().parse(
      buf,
      "",
      (gltf) => resolve(gltf.scene as THREE.Group),
      (err) => reject(err)
    );
  });
}
