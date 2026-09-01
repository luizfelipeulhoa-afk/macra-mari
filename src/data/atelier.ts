export type Category = "Bolsas" | "Painéis" | "Suportes" | "Casa";

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
   FOTOS REAIS DO CATÁLOGO ORIGINAL (site antigo no Wix)
   Servidas pela CDN pública do Wix com redimensionamento
   e compressão AVIF no servidor — leve e confiável.
   ———————————————————————————————————————————————— */
export const wixImg = (uri: string, w = 900, h = 1125) =>
  `https://static.wixstatic.com/media/${uri}/v1/fill/w_${w},h_${h},al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/${uri}`;

/* identidade visual real do ateliê */
export const BRAND = {
  /* foto de capa do site antigo — usada como emblema/logo */
  cover: "nsplsh_70ebfff2f69a433ca654b613dc6c8b9b~mv2.jpg",
  coverImg: wixImg(
    "nsplsh_70ebfff2f69a433ca654b613dc6c8b9b~mv2.jpg",
    1200,
    1600
  ),
  /* capas das categorias exatamente como no site antigo */
  catBolsas: "d25b8a_7d9592790b5e4688abaf3a33298bc656~mv2.jpg",
  catPaineis: "d25b8a_ea2c03fec71b4f2aad125a6cde655171~mv2.jpg",
  catCasa: "d25b8a_33054f5d583c4c0dabd19412d6d385fe~mv2.jpg",
};

export const atelierImg = BRAND.coverImg;

/* contato real */
export const CONTACT = {
  whatsapp: "5562995514015",
  whatsappLabel: "(62) 99551-4015",
  email: "mariulhoaq@gmail.com",
  instagram: "https://www.instagram.com/macra_mari16/",
  instagramLabel: "@macra_mari16",
};

const P = (
  id: string,
  name: string,
  category: Category,
  price: number,
  uri: string,
  material: string,
  size: string,
  dye: string,
  badge?: Product["badge"]
): Product => ({
  id,
  name,
  category,
  price,
  img: wixImg(uri),
  material,
  size,
  dye,
  badge,
});

/* Catálogo completo — 34 peças reais do ateliê */
export const products: Product[] = [
  /* ———— Bolsas & Clutches ———— */
  P("bolsa-concha-1", "Bolsa Concha", "Bolsas", 179, "d25b8a_9232a1776d944202813b64c83f9f62b2~mv2.jpg", "Fio de algodão · formato concha com alça de mão", "28 × 22 cm", "bege", "mais tecida"),
  P("clutch-cetim", "Clutch Fio de Cetim", "Bolsas", 299, "d25b8a_160726f2087e4ab099403cfd4a1e3daa~mv2.jpg", "Fio de cetim trançado à mão · forro interno", "25 × 15 cm", "perolado"),
  P("bolsa-celular", "Bolsa para Celular", "Bolsas", 89, "d25b8a_5c34d356832c427aace7ad151af32b3a~mv2.jpg", "Algodão 4 mm · alça transversal ajustável", "12 × 19 cm", "cru"),
  P("bolsa-concha-2", "Bolsa Concha Terracota", "Bolsas", 179, "d25b8a_94dca4857c184ce0a08965e3af3c2d8e~mv2.jpg", "Fio de algodão · formato concha com alça de mão", "28 × 22 cm", "terracota"),
  P("bolsa-celular-nautico-rami", "Bolsa Celular Fio Náutico Rami", "Bolsas", 79, "d25b8a_2340c2d3f4cf475a820c0d0962d93a18~mv2.jpg", "Fio náutico 5 mm · resistente à água", "12 × 19 cm", "rami"),
  P("bolsa-nautico-rattan-preta", "Bolsa Náutico/Rattan Preta", "Bolsas", 289, "d25b8a_5ac953eb626a4128b54d90533f9ee7e4~mv2.jpg", "Fio náutico 5 mm + alça de rattan", "30 × 26 cm", "preta"),
  P("bolsa-nautico-madeira-royal", "Bolsa Náutico/Madeira Royal", "Bolsas", 289, "d25b8a_fd021b52e68a4465a8d3c45907ab0c6c~mv2.jpg", "Fio náutico 5 mm + alça de madeira", "30 × 26 cm", "royal"),
  P("bolsa-nautico-madeira-rami", "Bolsa Náutico/Madeira Rami", "Bolsas", 289, "d25b8a_607eae4859d04978bfdc2377fdd4f11e~mv2.jpg", "Fio náutico 5 mm + alça de madeira", "30 × 26 cm", "rami", "última peça"),
  P("bolsa-praia-bege", "Bolsa Praia 24 Fios", "Bolsas", 179, "d25b8a_30c5619ed6d04f64970152ad5fae388d~mv2.jpg", "Barbante 24 fios · espaçosa, leva toalha e protetor", "42 × 38 cm", "bege"),
  P("bolsa-lurex-amendoa", "Bolsa Lurex/Madeira Amêndoa", "Bolsas", 299, "d25b8a_7d9592790b5e4688abaf3a33298bc656~mv2.jpg", "Fio lurex 5 mm com brilho sutil + alça de madeira", "30 × 26 cm", "amêndoa"),
  P("clutch-lurex-amendoa", "Clutch Lurex Amêndoa", "Bolsas", 159, "d25b8a_b64f5e997a6548f7a50a0961da127969~mv2.jpg", "Fio lurex 4 mm · fechamento com botão de madeira", "26 × 16 cm", "amêndoa"),
  P("clutch-lurex-marrom", "Clutch Lurex Marrom", "Bolsas", 159, "d25b8a_a6073dd1158b49ebb2ab9a33060b5c58~mv2.jpg", "Fio lurex 4 mm · fechamento com botão de madeira", "26 × 16 cm", "marrom"),
  P("clutch-malha-roxo", "Clutch Malha 25mm Roxa", "Bolsas", 92, "d25b8a_a31b82882e9543e5abf6e335e876cc0b~mv2.jpg", "Fio de malha 25 mm · macia e estruturada", "26 × 16 cm", "roxo"),
  P("clutch-malha-franja-azul", "Clutch Malha Franja Azul", "Bolsas", 92, "d25b8a_6c56a4adbd0d4c13905d91769568a61f~mv2.jpg", "Fio de malha 25 mm com franjas aparadas à mão", "26 × 16 cm", "azul", "nova"),
  P("bolsa-raffia-malva", "Bolsa Algodão/Raffia Malva", "Bolsas", 290, "d25b8a_8c1371fb88d84993929b7b53b15077b4~mv2.jpg", "Cordão de algodão cru + detalhes em raffia", "34 × 30 cm", "malva"),
  P("bolsa-camurca-cru", "Bolsa Algodão/Camurça Cru", "Bolsas", 249, "d25b8a_7719bd8899444af3a0a3a03f4c97b448~mv2.jpg", "Cordão de algodão cru + alça de camurça", "34 × 30 cm", "cru"),
  P("bolsa-camurca-preta", "Bolsa Algodão/Camurça Preta", "Bolsas", 289, "d25b8a_9f18c44d8a344840a77daecd0e8b8d9a~mv2.jpg", "Cordão de algodão preto + alça de camurça", "34 × 30 cm", "preta"),
  P("bolsa-celular-lurex-marrom", "Bolsa Celular Lurex Marrom", "Bolsas", 89, "d25b8a_23ec8b1bb8ff4510a93147854b423186~mv2.jpg", "Fio lurex 4 mm · alça transversal", "12 × 19 cm", "marrom"),

  /* ———— Painéis de parede ———— */
  P("painel-flor-lotus", "Painel Flor de Lótus", "Painéis", 139, "d25b8a_07a3d4f3fd5d4a0ca77a88b98de7b392~mv2.jpg", "Algodão 3 mm · desenho de lótus em nós festonê", "40 × 80 cm", "cru"),
  P("escultura-ondas", "Escultura Ondas", "Painéis", 160, "d25b8a_37ce216b04fa4ec1a904aea5901d3026~mv2.jpg", "Algodão 4 mm · ondas esculpidas nó a nó", "50 × 90 cm", "cru"),
  P("painel-colar-barbante", "Painel Colar com Barbante", "Painéis", 190, "d25b8a_4e5d1c5b0781411c84e1060da8b130ac~mv2.jpg", "Barbante ecológico · colar de nós sobre a vara", "35 × 95 cm", "natural"),
  P("painel-verde-cura", "Painel Verde Cura", "Painéis", 290, "d25b8a_6b624e86b6224ae49bf74eda7d7ada94~mv2.jpg", "Algodão tingido com folhas · textura de trança", "60 × 100 cm", "verde-cura", "nova"),
  P("painel-azul-mar", "Painel Azul Mar", "Painéis", 240, "d25b8a_0d826dd3b6dc40e2bb4b7d415193fc41~mv2.jpg", "Algodão 4 mm · marés em camadas de nós", "60 × 100 cm", "azul-mar"),
  P("painel-macrawave", "Painel Macrawave", "Painéis", 320, "d25b8a_9921c5226e2e4484ad3d900d948b8386~mv2.jpg", "Macramê + tapeçaria · técnica mista exclusiva", "70 × 110 cm", "mesclado", "mais tecida"),
  P("painel-flor-marrom", "Painel Flor Marrom", "Painéis", 250, "d25b8a_34e2ce54f5674a0fa197cfa4d3ef7fe9~mv2.jpg", "Algodão 3 mm · flor central com pétalas em espiral", "55 × 85 cm", "marrom"),

  /* ———— Suportes ———— */
  P("suporte-tapete-yoga", "Suporte Tapete de Yoga", "Suportes", 69, "d25b8a_39031f00655b4c7d827ec8c0d0367069~mv2.jpg", "Barbante 5 mm · carrega o tapete no ombro", "70 cm · alça ajustável", "rami"),
  P("suporte-plantas-trancado", "Suporte Plantas Trançado", "Suportes", 48, "d25b8a_28afd03c166c4fb8ac3624afa7997f91~mv2.png", "Algodão trançado · argola de madeira", "75 cm · vaso até 15 cm", "verde/terra"),
  P("suporte-plantas-azul-mar", "Suporte Plantas Azul Mar", "Suportes", 45, "d25b8a_93ba32fe20bc4ff3850b9331d4c13a9e~mv2.jpg", "Algodão 3 mm · argola de madeira", "80 cm · vaso até 15 cm", "azul-mar"),
  P("suporte-plantas-verde-terra", "Suporte Plantas Verde/Terra", "Suportes", 52, "d25b8a_8c3f93266d404134a8ac92d14be25391~mv2.jpg", "Algodão 3 mm · argola de madeira", "80 cm · vaso até 15 cm", "verde/terra"),

  /* ———— Casa & afeto ———— */
  P("garrafao", "Garrafão", "Casa", 82, "d25b8a_6a0243c90d864c88b23e871b658c1af5~mv2.jpg", "Revestimento em barbante para garrafão de vidro", "p/ garrafão 5 L", "natural"),
  P("cesto-barbante", "Cesto Barbante 24 Fios", "Casa", 120, "d25b8a_588d8f26c90a410487a6f5702055d5ab~mv2.jpg", "Barbante 24 fios · estrutura firme, sem arame", "Ø 30 × 25 cm", "natural"),
  P("cesto-barbante-2", "Cesto Barbante Detalhe", "Casa", 140, "d25b8a_33054f5d583c4c0dabd19412d6d385fe~mv2.jpg", "Barbante 24 fios com ponto de detalhe", "Ø 32 × 28 cm", "natural"),
  P("terco-madeira", "Terço Algodão/Madeira", "Casa", 280, "d25b8a_81845ecde789422490eef41eb7a22e21~mv2.jpg", "Algodão cru + contas de madeira torneadas à mão", "45 cm", "cru"),
  P("conjunto-porta-vela", "Conjunto Porta Vela/Trecos", "Casa", 58, "d25b8a_17f21c8b5c9b43ba95dddd3299d01efe~mv2.png", "Par trançado · para velas, pincéis ou temperos", "Ø 9 × 10 cm cada", "natural", "nova"),
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

/* Coleções — com as mesmas capas de categoria do site antigo */
export const collections: Collection[] = [
  {
    id: "bolsas",
    name: "Bolsas & Clutches",
    desc: "Fio náutico, lurex, malha e cordão de algodão. Alças de madeira, rattan e camurça — cada uma aguenta feira, praia e vida.",
    img: wixImg(BRAND.catBolsas, 1300, 1000),
    category: "Bolsas",
    tone: "clay",
    pieces: 18,
  },
  {
    id: "paineis",
    name: "Painéis",
    desc: "Paredes que respiram: lótus, ondas, flores e marés amarradas em barbante e algodão, da vara à franja.",
    img: wixImg(BRAND.catPaineis, 1300, 1000),
    category: "Painéis",
    tone: "moss",
    pieces: 7,
  },
  {
    id: "casa",
    name: "Casa & Suportes",
    desc: "Cestos, porta-velas, terços, garrafões e suportes de planta — as peças pequenas que organizam e abençoam a casa.",
    img: wixImg(BRAND.catCasa, 1300, 1000),
    category: "Casa",
    tone: "ocre",
    pieces: 9,
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
      "A bolsa chegou com um bilhete escrito à mão e cheiro de fio novo. Uso toda semana há meses — continua impecável.",
    name: "Renata F.",
    city: "Curitiba · PR",
    piece: "Bolsa Praia 24 Fios",
  },
  {
    quote:
      "Encomendei um painel sob medida pra sala. A Mari mandou foto do tear a cada etapa — parecia que eu estava tecendo junto.",
    name: "Caio & Duda",
    city: "Florianópolis · SC",
    piece: "Painel sob medida",
  },
  {
    quote:
      "O terço que ela fez pra minha mãe a fez chorar antes mesmo de abrir o pacote. Trabalho de uma delicadeza rara.",
    name: "Iara M.",
    city: "Recife · PE",
    piece: "Terço Algodão/Madeira",
  },
  {
    quote:
      "Comprei o suporte de yoga e dois suportes de planta. Tudo firme, bonito e com aquele cuidado que só mão de gente tem.",
    name: "Teo A.",
    city: "São Paulo · SP",
    piece: "Suporte Tapete de Yoga",
  },
];

export const marqueeWords = [
  "feito à mão em goiânia",
  "34 peças no varal",
  "enviamos para todo o Brasil",
  "peças sob medida",
  "fio náutico · lurex · malha · barbante",
  "cada nó conta uma história",
];

export const formatBRL = (v: number) =>
  v.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

/* ————————————————————————————————————————————————
   MODELOS 3D REAIS DAS PEÇAS (Google Drive do ateliê)
   wallZip  — macrame wall hanging (zip: glb/gltf/obj)
   blueBag  — blue knitted bag (.glb)
   ———————————————————————————————————————————————— */
export const MODELS = {
  wallZip: "1_f2Ks2-9Gu3V2BKTDbtCHrbOpae02t0D",
  blueBag: "1zBaxJqYkHwgacQZb2tI7DZfruNBq7p5H",
};
