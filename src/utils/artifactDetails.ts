import { ListingType } from "../lib/mocks/objects";

export const badgeIcons: Record<ListingType, string> = {
  doacao: "/assets/gift-sm.svg",
  emprestimo: "/assets/repeat-2-sm.svg",
  aluguer: "/assets/coins-sm.svg",
};

export const badgeColors: Record<ListingType, string> = {
  doacao: "bg-mint",
  emprestimo: "bg-sky",
  aluguer: "bg-sand",
};


export const categories = [
  "Caminhadas",
  "Campismo",
  "Eletrónica",
  "Ferramentas",
  "Fotografia",
  "Livros",
  "Mobilidade",
  "Videojogos",
  "Outros",
];

export const conditions = ["Novo", "Como novo", "Bom estado", "Usado"];

export const priceUnits = [
  { id: "dia", label: "Por dia", short: "dia" },
  { id: "semana", label: "Por semana", short: "semana" },
  { id: "mes", label: "Por mês", short: "mês" },
] as const;

export const modalities: { id: ListingType; icon: string; text: string }[] = [
  { id: "doacao", icon: "/assets/gift.svg", text: "Oferece o teu objeto gratuitamente." },
  {
    id: "emprestimo",
    icon: "/assets/repeat-2.svg",
    text: "Partilha o objeto durante um período e recebe-o de volta.",
  },
  { id: "aluguer", icon: "/assets/coins.svg", text: "Define um preço para a utilização do objeto." },
];