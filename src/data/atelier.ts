import { catalogProducts } from "./catalog";

export type Category = "Painéis" | "Bolsas" | "Casa";

export interface Product {
  id: string;
  name: string;
  category: Category;
  price: number;
  img: string;
  images: string[];
  sourceUrl: string;
  material: string;
  size: string;
  badge?: "nova" | "última peça" | "mais tecida";
  dye: string;
}

export const products: Product[] = catalogProducts;

// As capas passam a usar as fotografias dos produtos do catálogo real.
const firstPanel = products.find((p) => p.category === "Painéis")!;
const firstBag = products.find((p) => p.category === "Bolsas")!;
const firstHome = products.find((p) => p.category === "Casa")!;

export const BRAND = {
  catPaineis: firstPanel.img,
  catPaineisXL: firstPanel.images[1],
  catBolsas: firstBag.img,
};

// Mantido para compatibilidade com o componente de imagens existente.
export const driveThumb = (id: string, w = 1200) =>
  `https://drive.google.com/thumbnail?id=${id}&sz=w${w}`;

export interface Collection {
  id: string;
  name: string;
  desc: string;
  img: string;
  category: Category;
  tone: "clay" | "moss" | "ocre";
  pieces: number;
}

/* Capas e contagens das categorias do catálogo importado. */
export const collections: Collection[] = [
  {
    id: "painel",
    name: "Parede Viva",
    desc: "Painéis que transformam qualquer parede em ateliê — fios crus, franjas ao vento e madeira de verdade.",
    img: firstPanel.img,
    category: "Painéis",
    tone: "clay",
    pieces: products.filter((p) => p.category === "Painéis").length,
  },
  {
    id: "mao",
    name: "Na Mão",
    desc: "Bolsas e clutches tecidas em malha grossa. Leves, laváveis e prontas pra feira, praia e cidade.",
    img: firstBag.img,
    category: "Bolsas",
    tone: "moss",
    pieces: products.filter((p) => p.category === "Bolsas").length,
  },
  {
    id: "cantos",
    name: "Cantos Verdes",
    desc: "Suportes e peças de casa que abraçam plantas, velas e a bagunça boa do dia a dia.",
    img: firstHome.img,
    category: "Casa",
    tone: "ocre",
    pieces: products.filter((p) => p.category === "Casa").length,
  },
];

export interface Testimonial {
  quote: string;
  name: string;
  city: string;
  piece: string;
}

export const testimonials: Testimonial[] = [
  {
    quote:
      "O painel chegou com um bilhete escrito à mão e cheiro de algodão novo. Pendurei e a sala inteira mudou de clima.",
    name: "Renata F.",
    city: "Curitiba · PR",
    piece: "Painel Flor de Lótus",
  },
  {
    quote:
      "Encomendei uma peça sob medida pra varanda. A Mari mandou foto do tear a cada etapa — parecia que eu estava tecendo junto.",
    name: "Caio & Duda",
    city: "Florianópolis · SC",
    piece: "Peça sob medida",
  },
  {
    quote:
      "Terceira peça que compro. Presenteei minha mãe e ela chorou antes mesmo de abrir. Trabalho de uma delicadeza rara.",
    name: "Iara M.",
    city: "Recife · PE",
    piece: "Painel Meia-Lua",
  },
  {
    quote:
      "Uso a Bolsa Concha toda semana há oito meses. Já levou chuva, feira lotada e criança pendurada — continua impecável.",
    name: "Teo A.",
    city: "São Paulo · SP",
    piece: "Bolsa Concha",
  },
];

/* Foto contextual de uma peça de casa do catálogo. */
export const atelierImg = firstHome.images[1];

export const marqueeWords = [
  "feito à mão em pequena escala",
  "fios de algodão",
  "enviamos para todo o Brasil",
  "peças sob medida",
  "cada nó conta uma história",
  "goiânia · desde 2023",
];

/* ————————————————————————————————————————————————
   MODELO 3D — ORDEM DE TENTATIVA:
   1) local (mesma origem, NUNCA falha): salve o arquivo como
      public/models/wall-hanging.glb no projeto e faça o build.
   2) Drive (rede externa, pode ser barrada por CORS).
   ———————————————————————————————————————————————— */
export const MODELS = {
  wallLocal: "/models/wall-hanging.glb",
  /* modelo 3D da peça de entrada (Drive — link compartilhado) */
  wallDrive: "1jF_ff7FYJhm8u25X_Ct5zlJx-_lmV7Nx",
};

/* ————————————————————————————————————————————————
   ARTES 2D DA PEÇA DE ENTRADA (foto de estúdio + PNG sem fundo).
   ORDEM: local (public/images/, nunca falha) → Drive (reserva).
   O PNG, quando carrega, protagoniza a transição — a peça
   "flutua" recortada sobre o fundo de estúdio.
   ———————————————————————————————————————————————— */
export const PIECE_ART = {
  pngLocal: firstPanel.img,
  studioLocal: firstPanel.images[1],
  pngDrive: firstPanel.img,
  studioDrive: firstPanel.images[1],
};

export const CONTACT = {
  whatsapp: "5562995514015",
  whatsappLabel: "(62) 99551-4015",
  email: "mariulhoaq@gmail.com",
  instagram: "https://instagram.com/macra_mari16",
  instagramLabel: "@macra_mari16",
};

export const formatBRL = (v: number) =>
  v.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
