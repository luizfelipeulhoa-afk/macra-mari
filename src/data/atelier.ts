export type Category = "Painéis" | "Bolsas" | "Suportes" | "Casa";

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
   TODAS as fotos do app vêm da pasta pública do Drive
   da Macra Mari — nenhuma outra fonte de imagem.
   Servidas pelo endpoint de thumbnail, que já
   redimensiona no servidor (nada de baixar 3 MB).
   ———————————————————————————————————————————————— */
export const driveThumb = (id: string, w = 1200) =>
  `https://drive.google.com/thumbnail?id=${id}&sz=w${w}`;

const FOTOS = {
  painelLotus: "1m_f-JIurokHemAB2f2hLerIgMIGLhZw2",
  meiaLua: "19KtN284IweoNAsYF176CnlyhqiqXUJxI",
  painelTranca: "119E54FAfZylhb6oeJya-kowblmvN9YCD",
  painelDunas: "1MyAD0lSUmQRuQNpHL490Ap8yh6PsAyC-",
  bolsaConcha: "1QJ1DYCmK3A0oyIrkSj1Oh3OJdtf95WEZ",
  clutchFranja: "1jqabTRzpy-4qEROX52E8UuXjNPhVBq5a",
  bolsaCordao: "18pNqzetxJsvgzqC_JeF5iT_eSQUlf9N8",
  suporteSuspenso: "1hL_0_CC5qpM3-GGCyKcJ9_AaHw2WPYfC",
  suporteDuplo: "1x5igZI_l6rRcZpa7Ea20_EKRsY9Sjkyl",
  cesto: "1ZE2f9Vb4Etp_rE-8TAr72c_vZPLd2pX9",
  caminhoMesa: "1aLZ_LUZF3rTNvdympStVlMjSqVuzM1ya",
  portaVela: "16EFAO6y4TPMXVpbO_uUOA3HsqfDFTPf-",
};

export const products: Product[] = [
  {
    id: "painel-lotus",
    name: "Painel Flor de Lótus",
    category: "Painéis",
    price: 179,
    img: driveThumb(FOTOS.painelLotus),
    material: "Algodão 4 mm · vara de madeira de demolição",
    size: "60 × 90 cm",
    badge: "mais tecida",
    dye: "cru",
  },
  {
    id: "painel-meia-lua",
    name: "Painel Meia-Lua",
    category: "Painéis",
    price: 159,
    img: driveThumb(FOTOS.meiaLua),
    material: "Algodão 3 mm · arco de eucalipto tratado",
    size: "Ø 60 cm",
    badge: "nova",
    dye: "terracota",
  },
  {
    id: "painel-tranca",
    name: "Painel Trança",
    category: "Painéis",
    price: 145,
    img: driveThumb(FOTOS.painelTranca),
    material: "Algodão 5 mm · tranças de três cabos",
    size: "40 × 70 cm",
    dye: "cru",
  },
  {
    id: "painel-dunas",
    name: "Painel Dunas",
    category: "Painéis",
    price: 129,
    img: driveThumb(FOTOS.painelDunas),
    material: "Algodão 3 mm · franja penteada",
    size: "45 × 65 cm",
    dye: "areia",
  },
  {
    id: "bolsa-concha",
    name: "Bolsa Concha",
    category: "Bolsas",
    price: 179,
    img: driveThumb(FOTOS.bolsaConcha),
    material: "Malha de algodão 25 mm · forro interno",
    size: "32 × 38 cm",
    badge: "última peça",
    dye: "cru",
  },
  {
    id: "clutch-franja",
    name: "Clutch Franja",
    category: "Bolsas",
    price: 92,
    img: driveThumb(FOTOS.clutchFranja),
    material: "Malha 25 mm · franja azul à mão",
    size: "26 × 18 cm",
    dye: "azul",
  },
  {
    id: "bolsa-cordao",
    name: "Bolsa Cordão Cru",
    category: "Bolsas",
    price: 149,
    img: driveThumb(FOTOS.bolsaCordao),
    material: "Cordão de algodão · ráfia e alça trançada",
    size: "35 × 40 cm",
    badge: "nova",
    dye: "malva",
  },
  {
    id: "suporte-suspenso",
    name: "Suporte de Planta Suspenso",
    category: "Suportes",
    price: 55,
    img: driveThumb(FOTOS.suporteSuspenso),
    material: "Algodão 3 mm · argola de latão",
    size: "80 cm · vaso 15 cm",
    dye: "cru",
  },
  {
    id: "suporte-duplo",
    name: "Suporte Duplo Terral",
    category: "Suportes",
    price: 89,
    img: driveThumb(FOTOS.suporteDuplo),
    material: "Algodão 4 mm · dois vasos de cerâmica",
    size: "70 + 95 cm",
    dye: "terracota",
  },
  {
    id: "cesto-organizador",
    name: "Cesto Organizador",
    category: "Casa",
    price: 68,
    img: driveThumb(FOTOS.cesto),
    material: "Cordão 5 mm · estrutura firme",
    size: "Ø 28 × 20 cm",
    dye: "cru",
  },
  {
    id: "caminho-mesa",
    name: "Caminho de Mesa Nó",
    category: "Casa",
    price: 79,
    img: driveThumb(FOTOS.caminhoMesa),
    material: "Algodão 2 mm · 14 fileiras de nós",
    size: "40 × 150 cm",
    badge: "nova",
    dye: "cru",
  },
  {
    id: "porta-vela",
    name: "Porta-vela & Trecos",
    category: "Casa",
    price: 58,
    img: driveThumb(FOTOS.portaVela),
    material: "Algodão 2 mm · kit com 2 unidades",
    size: "Ø 10 × 9 cm",
    dye: "verde-musgo",
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

/* coleções usam as mesmas fotos do Drive (capas por categoria) */
export const collections: Collection[] = [
  {
    id: "painel",
    name: "Parede Viva",
    desc: "Painéis que transformam qualquer parede em ateliê — fios crus, franjas ao vento e madeira de verdade.",
    img: products[0].img,
    category: "Painéis",
    tone: "clay",
    pieces: 4,
  },
  {
    id: "mao",
    name: "Na Mão",
    desc: "Bolsas e clutches tecidas em malha grossa. Leves, laváveis e prontas pra feira, praia e cidade.",
    img: products[4].img,
    category: "Bolsas",
    tone: "moss",
    pieces: 3,
  },
  {
    id: "cantos",
    name: "Cantos Verdes",
    desc: "Suportes e peças de casa que abraçam plantas, velas e a bagunça boa do dia a dia.",
    img: products[7].img,
    category: "Suportes",
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

/* foto do ateliê — também do Drive */
export const atelierImg = driveThumb(FOTOS.caminhoMesa);

export const marqueeWords = [
  "feito à mão em pequena escala",
  "fios de algodão",
  "enviamos para todo o Brasil",
  "peças sob medida",
  "cada nó conta uma história",
  "goiânia · desde 2023",
];

/* modelos 3D reais (Drive) */
export const MODELS = {
  blueBag: "1zBaxJqYkHwgacQZb2tI7DZfruNBq7p5H",
  wallZip: "1_f2Ks2-9Gu3V2BKTDbtCHrbOpae02t0D",
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
