import type { ModelId } from "../three/models";

const IMG = {
  quadros:
    "https://image.qwenlm.ai/generated-images/d249b51f-cef8-4742-a93a-e942a6db4d0b/_result.png",
  mandalas:
    "https://image.qwenlm.ai/generated-images/2b4d3ce5-07f7-41da-97a2-37e4556aea7b/_result.png",
  portaVasos:
    "https://image.qwenlm.ai/generated-images/5776cfa2-b892-4c8d-b40e-50908e3b82df/_result.png",
  bolsas:
    "https://image.qwenlm.ai/generated-images/ef7b0e7b-6e6d-44af-8131-a57ec737a6e3/_result.png",
  portaCopos:
    "https://image.qwenlm.ai/generated-images/0c9b15a5-41b3-4cb1-928a-12909e6f9d65/_result.png",
  atelier:
    "https://image.qwenlm.ai/generated-images/0573af00-c229-4d13-bfc5-a3cecd7af342/_result.png",
  materiais:
    "https://image.qwenlm.ai/generated-images/6515b703-4f3e-4314-bce3-2236cad160bf/_result.png",
  fundadora:
    "https://image.qwenlm.ai/generated-images/66dcc0f0-6bda-4c2a-a849-f7b0f97902ca/_result.png",
};

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  compareAt?: number;
  description: string;
  materials: string[];
  badge?: string;
  daysToMake: number;
  model: ModelId;
  alt: string;
}

export const PRODUCTS: Product[] = [
  {
    id: "mandala-solar",
    name: "Mandala Solar",
    category: "mandalas",
    price: 189,
    description:
      "Tecer a Mandala Solar leva três dias inteiros: anéis concêntricos de nó sobre nó, do centro dourado até a franja que dança com o vento.",
    materials: ["Algodão reciclado", "Aro de madeira"],
    badge: "Mais vendida",
    daysToMake: 3,
    model: "mandala",
    alt: "Mandala de macramê com anéis concêntricos em algodão cru e franjas na parte inferior",
  },
  {
    id: "quadro-dunas",
    name: "Quadro Dunas",
    category: "quadros",
    price: 249,
    compareAt: 299,
    description:
      "Inspirado no desenho que o vento faz na areia: losango tramado ao centro, cordões em degradê de comprimento e franja solta.",
    materials: ["Algodão reciclado", "Cabo de eucalipto"],
    daysToMake: 4,
    model: "quadro",
    alt: "Quadro de macramê pendurado em cabo de madeira com losango tramado e franjas longas",
  },
  {
    id: "porta-vasos-ipe",
    name: "Porta-vasos Ipê",
    category: "porta-vasos",
    price: 129,
    description:
      "Quatro pernas de nós firmes abraçam o vaso de cerâmica e deixam sua planta samambar na altura da luz. Acompanha vaso artesanal.",
    materials: ["Algodão reciclado", "Cerâmica mineira"],
    badge: "Novo",
    daysToMake: 2,
    model: "portaVaso",
    alt: "Porta-vasos suspenso de macramê segurando vaso de cerâmica com planta pendente",
  },
  {
    id: "bolsa-trama",
    name: "Bolsa Trama",
    category: "bolsas",
    price: 179,
    description:
      "Malha de nós abertos, forro de sarja e alça que aguenta feira, praia e cidade. Cada malha é conferida nó a nó antes de sair do atelier.",
    materials: ["Algodão reciclado", "Forro de sarja"],
    daysToMake: 5,
    model: "bolsa",
    alt: "Bolsa de macramê com malha de nós abertos e alça de mão em algodão cru",
  },
  {
    id: "porta-copos-terras",
    name: "Porta-copos Terras · jogo com 4",
    category: "porta-copos",
    price: 89,
    description:
      "Quatro rodelas tecidas em espiral, uma delas tingida com casca de cebola. Protegem a mesa e rendem conversa na roda.",
    materials: ["Algodão reciclado", "Tingimento natural"],
    daysToMake: 1,
    model: "portaCopos",
    alt: "Jogo de quatro porta-copos redondos de macramê em espiral, um deles em tom oliva",
  },
  {
    id: "guirlanda-nos",
    name: "Guirlanda de Nós",
    category: "quadros",
    price: 119,
    description:
      "Nove pingentes de alturas escalonadas, contas de madeira e tufos na ponta. Veste paredes largas, cabeceiras e vãos de porta.",
    materials: ["Algodão reciclado", "Contas de madeira"],
    daysToMake: 2,
    model: "guirlanda",
    alt: "Guirlanda de parede de macramê com nove pingentes escalonados e contas de madeira",
  },
  {
    id: "quadro-mare",
    name: "Quadro Maré",
    category: "quadros",
    price: 289,
    description:
      "Peça larga de 1,2 m com três camadas de trama e franja dupla. Só fazemos duas por mês — o tempo da maré e o nosso.",
    materials: ["Algodão reciclado", "Cabo de demolição"],
    badge: "Edição limitada",
    daysToMake: 6,
    model: "quadro",
    alt: "Quadro de macramê largo com camadas de tramado e franjas duplas sobre o sofá",
  },
  {
    id: "mandala-lunar",
    name: "Mandala Lunar",
    category: "mandalas",
    price: 159,
    description:
      "Versão compacta da Solar, com meia-lua tramada ao centro. Feita para cantinhos, halls e paredes que pedem um respiro.",
    materials: ["Algodão reciclado", "Aro de madeira"],
    daysToMake: 2,
    model: "mandala",
    alt: "Mandala de macramê menor com meia-lua tramada ao centro e franjas curtas",
  },
];

export interface Category {
  id: string;
  label: string;
  num: string;
  image: string;
  alt: string;
  description: string;
  subs: string[];
}

export const CATEGORIES: Category[] = [
  {
    id: "quadros",
    label: "Quadros",
    num: "01",
    image: IMG.quadros,
    alt: "Sala boho com grande quadro de macramê sobre sofá de linho e almofadas verde-oliva",
    description:
      "Peças de parede que ancoram a sala inteira. Tramas largas, franjas longas e cabos de madeira de reaproveitamento — feitas para serem vistas de longe e de perto.",
    subs: ["Parede ampla", "Sobre o sofá", "Cantinho de leitura"],
  },
  {
    id: "mandalas",
    label: "Mandalas",
    num: "02",
    image: IMG.mandalas,
    alt: "Mandala redonda de macramê pendurada em parede de plaster creme com luz lateral suave",
    description:
      "Círculos tecidos do centro para fora, como uma meditação de mãos ocupadas. Cada anel é um ponto de partida — e um lugar para o olho descansar.",
    subs: ["Centro de parede", "Sobre a cama", "Hall de entrada"],
  },
  {
    id: "porta-vasos",
    label: "Porta-vasos",
    num: "03",
    image: IMG.portaVasos,
    alt: "Três porta-vasos suspensos de macramé perto da janela com plantas pendentes e luz de fim de tarde",
    description:
      "Tiramos as plantas do chão e devolvemos a elas o lugar de destaque. Nós firmes testados com peso de verdade e vasos de cerâmica feitos aqui por perto.",
    subs: ["Perto da janela", "Composições em trio", "Varanda coberta"],
  },
  {
    id: "bolsas",
    label: "Bolsas",
    num: "04",
    image: IMG.bolsas,
    alt: "Mulher de vestido de linho caminhando em pátio ensolarado com bolsa de macramê no ombro",
    description:
      "Macramê que sai de casa com você. Malhas abertas de algodão, forro resistente e alças calculadas para o peso da feira — não só para a foto.",
    subs: ["Dia a dia", "Feira & praia", "Presente"],
  },
  {
    id: "porta-copos",
    label: "Porta-copos",
    num: "05",
    image: IMG.portaCopos,
    alt: "Porta-copos de macramê sobre mesa de madeira rústica com xícaras de cerâmica e luz da manhã",
    description:
      "A porta de entrada para a casa de quem ainda não tem um macramê. Jogos de quatro, espirais apertadas que não deixam a gota passar.",
    subs: ["Jogos de 4", "Mesa posta", "Lembrancinhas"],
  },
];

export interface Testimonial {
  quote: string;
  name: string;
  place: string;
  product: string;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "O Quadro Dunas mudou a sala inteira. A foto não mostra a textura — ao vivo, dá vontade de passar a mão o dia todo.",
    name: "Camila R.",
    place: "São Paulo · SP",
    product: "Quadro Dunas",
  },
  {
    quote:
      "Encomendei os porta-copos de lembrancinha e a Mari escreveu o nome de cada convidado numa tag de papel-semente. Todo mundo comentou.",
    name: "João Pedro M.",
    place: "Belo Horizonte · MG",
    product: "Porta-copos Terras",
  },
  {
    quote:
      "Minha bolsa Trama já foi para a praia, para a feira e para o trabalho. Dois anos depois, os nós seguem firmes — e mais bonitos.",
    name: "Fernanda L.",
    place: "Florianópolis · SC",
    product: "Bolsa Trama",
  },
];

export interface ProcessStep {
  title: string;
  text: string;
}

export const PROCESS_STEPS: ProcessStep[] = [
  {
    title: "O fio",
    text: "Algodão reciclado de descarte têxtil, penteado e enrolado no próprio atelier.",
  },
  {
    title: "O banho",
    text: "Quando a peça pede cor: casca de cebola, açafrão ou folha de oliveira, sem pressa.",
  },
  {
    title: "A trama",
    text: "Nó por nó, carreiras contadas em voz alta. Sem molde — o desenho mora na mão.",
  },
  {
    title: "O remate",
    text: "Franjas penteadas, pontas seladas e a etiqueta numerada à mão, uma a uma.",
  },
];

export interface MaterialValue {
  icon: "cotton" | "dye" | "wood" | "parcel";
  title: string;
  text: string;
}

export const MATERIAL_VALUES: MaterialValue[] = [
  {
    icon: "cotton",
    title: "Algodão reciclado",
    text: "Fio vindo de sobras da indústria têxtil mineira. Nada de fibra virgem, nada de plástico disfarçado de cordão.",
  },
  {
    icon: "dye",
    title: "Tingimento de panela",
    text: "Cores que vêm da cozinha: casca de cebola, açafrão, café e folhas. Cada banho sai um pouco diferente — e é isso que a gente ama.",
  },
  {
    icon: "wood",
    title: "Madeira com passado",
    text: "Cabos e aros de demolição e poda urbana, lixados e encerados com cera de abelha aqui mesmo no atelier.",
  },
  {
    icon: "parcel",
    title: "Embalagem sem plástico",
    text: "Papel de semente, barbante de algodão e carimbo de tinta à base d'água. A caixa vira vaso, o papel vira flor.",
  },
];

export const FREE_SHIPPING_THRESHOLD = 249;

export function formatBRL(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
}

export function getProduct(id: string) {
  return PRODUCTS.find((p) => p.id === id);
}

export { IMG };
