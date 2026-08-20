export type Category =
  | "Quadros"
  | "Mandalas"
  | "Porta-vasos"
  | "Bolsas"
  | "Casa";

export interface Product {
  id: string;
  name: string;
  category: Category;
  price: number;
  img: string;
  material: string;
  size: string;
  badge?: "nova" | "última peça" | "mais tecida";
  dye: string;
}

/* ————————————————————————————————————————————————
   FOTOS REAIS DAS PEÇAS (Google Drive do atelier)
   Servidas pelo endpoint de thumbnail do Drive, que
   redimensiona no servidor — nada de baixar 4 MB.
   Para trocar a foto de uma peça, basta mover o id
   do arquivo entre os produtos abaixo.
   ———————————————————————————————————————————————— */
export const driveThumb = (id: string, w = 1600) =>
  `https://drive.google.com/thumbnail?id=${id}&sz=w${w}`;

const FOTOS = {
  mare: "1m_f-JIurokHemAB2f2hLerIgMIGLhZw2",
  mandalaSolar: "19KtN284IweoNAsYF176CnlyhqiqXUJxI",
  vasoSuspenso: "1MyAD0lSUmQRuQNpHL490Ap8yh6PsAyC-",
  bolsaFeira: "1QJ1DYCmK3A0oyIrkSj1Oh3OJdtf95WEZ",
  portaCopos: "1jqabTRzpy-4qEROX52E8UuXjNPhVBq5a",
  cortinaVento: "18pNqzetxJsvgzqC_JeF5iT_eSQUlf9N8",
  quadroDunas: "1aLZ_LUZF3rTNvdympStVlMjSqVuzM1ya",
  mandalaLua: "16EFAO6y4TPMXVpbO_uUOA3HsqfDFTPf-",
  /* ——— recém-chegadas do varal ——— */
  quadroTranca: "119E54FAfZylhb6oeJya-kowblmvN9YCD",
  mandalaSertao: "1hL_0_CC5qpM3-GGCyKcJ9_AaHw2WPYfC",
  vasoTrio: "1x5igZI_l6rRcZpa7Ea20_EKRsY9Sjkyl",
  caminhoNo: "1ZE2f9Vb4Etp_rE-8TAr72c_vZPLd2pX9",
};

/* as quatro peças que acabaram de sair do tear */
export const newPieces = [
  { id: FOTOS.quadroTranca, label: "Quadro Trança" },
  { id: FOTOS.mandalaSertao, label: "Mandala Sertão" },
  { id: FOTOS.vasoTrio, label: "Porta-vaso Trio" },
  { id: FOTOS.caminhoNo, label: "Caminho de Mesa Nó" },
];

/* reserva visual caso o Drive esteja indisponível (arte da série anterior) */
export const DRIVE_FALLBACKS: Record<string, string> = {
  [FOTOS.mare]:
    "https://image.qwenlm.ai/generated-images/1e73c8f1-028f-4093-8a8b-6052357385e8/_result.png",
  [FOTOS.mandalaSolar]:
    "https://image.qwenlm.ai/generated-images/d95b2adb-1d43-4612-812e-795b3e6a86a1/_result.png",
  [FOTOS.vasoSuspenso]:
    "https://image.qwenlm.ai/generated-images/3d8f4ee1-adf7-4190-b70a-b3ccdc88b2bc/_result.png",
  [FOTOS.bolsaFeira]:
    "https://image.qwenlm.ai/generated-images/1eaaceb8-a0c6-4510-9e13-b43985130252/_result.png",
  [FOTOS.portaCopos]:
    "https://image.qwenlm.ai/generated-images/2a1fdd2a-8a35-4e41-945e-b48d140910c7/_result.png",
  [FOTOS.cortinaVento]:
    "https://image.qwenlm.ai/generated-images/8f502694-9063-4bbd-b046-e0ea4016d2ee/_result.png",
  [FOTOS.quadroDunas]:
    "https://image.qwenlm.ai/generated-images/9ac945b6-995b-4421-8553-00cdbd0d9519/_result.png",
  [FOTOS.mandalaLua]:
    "https://image.qwenlm.ai/generated-images/3ab25080-2c85-435f-ac68-234194b8e0d2/_result.png",
};

export const products: Product[] = [
  {
    id: "mare",
    name: "Quadro Maré",
    category: "Quadros",
    price: 320,
    img: driveThumb(FOTOS.mare),
    material: "Algodão orgânico 4 mm · vara de madeira de demolição",
    size: "60 × 90 cm",
    badge: "mais tecida",
    dye: "cru",
  },
  {
    id: "mandala-solar",
    name: "Mandala Solar",
    category: "Mandalas",
    price: 260,
    img: driveThumb(FOTOS.mandalaSolar),
    material: "Algodão 3 mm · bastidor de jatobá",
    size: "Ø 70 cm",
    badge: "nova",
    dye: "terracota",
  },
  {
    id: "vaso-suspenso",
    name: "Porta-vaso Suspenso",
    category: "Porta-vasos",
    price: 95,
    img: driveThumb(FOTOS.vasoSuspenso),
    material: "Algodão 3 mm · argola de latão",
    size: "80 cm · vaso 15 cm",
    dye: "cru",
  },
  {
    id: "bolsa-feira",
    name: "Bolsa Feira",
    category: "Bolsas",
    price: 140,
    img: driveThumb(FOTOS.bolsaFeira),
    material: "Algodão reciclado 5 mm · alça trançada",
    size: "38 × 42 cm",
    badge: "última peça",
    dye: "mostarda",
  },
  {
    id: "kit-porta-copos",
    name: "Kit Porta-copos Nó",
    category: "Casa",
    price: 70,
    img: driveThumb(FOTOS.portaCopos),
    material: "Algodão 2 mm · kit com 4 unidades",
    size: "Ø 11 cm cada",
    dye: "verde-musgo",
  },
  {
    id: "cortina-vento",
    name: "Cortina Vento",
    category: "Quadros",
    price: 480,
    img: driveThumb(FOTOS.cortinaVento),
    material: "Algodão 4 mm · 38 fileiras de nós",
    size: "150 × 200 cm",
    dye: "cru",
  },
  {
    id: "quadro-dunas",
    name: "Quadro Dunas",
    category: "Quadros",
    price: 210,
    img: driveThumb(FOTOS.quadroDunas),
    material: "Algodão 3 mm · arco de eucalipto tratado",
    size: "40 × 60 cm",
    dye: "terracota",
  },
  {
    id: "mandala-lua",
    name: "Mandala Lua",
    category: "Mandalas",
    price: 150,
    img: driveThumb(FOTOS.mandalaLua),
    material: "Algodão 2,5 mm · bastidor + meia-lua de cobre",
    size: "Ø 45 cm",
    dye: "cru",
  },
  {
    id: "quadro-tranca",
    name: "Quadro Trança",
    category: "Quadros",
    price: 340,
    img: driveThumb(FOTOS.quadroTranca),
    material: "Algodão 4 mm · trança de 3 cabos · vara de ipê",
    size: "50 × 80 cm",
    badge: "nova",
    dye: "cru",
  },
  {
    id: "mandala-sertao",
    name: "Mandala Sertão",
    category: "Mandalas",
    price: 290,
    img: driveThumb(FOTOS.mandalaSertao),
    material: "Algodão 3 mm · tingida com açafrão e urucum",
    size: "Ø 60 cm",
    badge: "nova",
    dye: "mostarda",
  },
  {
    id: "vaso-trio",
    name: "Porta-vaso Trio",
    category: "Porta-vasos",
    price: 160,
    img: driveThumb(FOTOS.vasoTrio),
    material: "Algodão 3 mm · 3 alturas escalonadas",
    size: "60 · 80 · 100 cm",
    badge: "nova",
    dye: "verde-musgo",
  },
  {
    id: "caminho-no",
    name: "Caminho de Mesa Nó",
    category: "Casa",
    price: 130,
    img: driveThumb(FOTOS.caminhoNo),
    material: "Algodão 2 mm · franjas nas pontas",
    size: "40 × 150 cm",
    badge: "nova",
    dye: "cru",
  },
];

export interface Collection {
  id: string;
  name: string;
  desc: string;
  img: string;
  category: Category;
  tone: "clay" | "moss" | "ocre";
  pieces: number;
}

export const collections: Collection[] = [
  {
    id: "terral",
    name: "Terral",
    desc: "Fios tingidos com urucum e casca de cebola. O quente da terra pra dentro de casa.",
    img: products[1].img,
    category: "Mandalas",
    tone: "clay",
    pieces: 7,
  },
  {
    id: "mare",
    name: "Maré",
    desc: "Cru sobre cru, texturas que sobem e descem como respiração de praia.",
    img: products[0].img,
    category: "Quadros",
    tone: "moss",
    pieces: 9,
  },
  {
    id: "sertao",
    name: "Sertão",
    desc: "Mostarda, ocre e sol. Peças robustas, fios grossos, franjas ao vento.",
    img: products[3].img,
    category: "Bolsas",
    tone: "ocre",
    pieces: 5,
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
      "O quadro chegou com um bilhete escrito à mão e cheiro de algodão novo. Pendurei e a sala inteira mudou de clima.",
    name: "Renata F.",
    city: "Curitiba · PR",
    piece: "Quadro Maré",
  },
  {
    quote:
      "Encomendei uma cortina sob medida pra varanda. A Mari mandou foto do tear a cada etapa — parecia que eu estava tecendo junto.",
    name: "Caio & Duda",
    city: "Florianópolis · SC",
    piece: "Cortina sob medida",
  },
  {
    quote:
      "Terceira mandala que compro. Presenteei minha mãe e ela chorou antes mesmo de abrir. Trabalho de uma delicadeza rara.",
    name: "Iara M.",
    city: "Recife · PE",
    piece: "Mandala Lua",
  },
  {
    quote:
      "Uso a Bolsa Feira toda semana há oito meses. Já levou chuva, feira lotada e criança pendurada — continua impecável.",
    name: "Teo A.",
    city: "São Paulo · SP",
    piece: "Bolsa Feira",
  },
];

export const marqueeWords = [
  "feito à mão em pequena escala",
  "fios de algodão orgânico",
  "enviamos para todo o Brasil",
  "peças sob medida",
  "tingimento natural",
  "cada nó conta uma história",
];

/* bancada do atelier — registro do ofício */
export const atelierImg =
  "https://image.qwenlm.ai/generated-images/01701503-0901-4a3e-b3aa-f592d84c1db5/_result.png";

export const formatBRL = (v: number) =>
  v.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
