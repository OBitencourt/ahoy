export type ListingType = "doacao" | "emprestimo" | "aluguer";

export type ObjectListing = {
  id: string;
  title: string;
  type: ListingType;
  area: string;
  distance: string;
  /** Preço por dia (só aluguer). Objetos gratuitos usam `condition`. */
  pricePerDay?: number;
  condition: string;
  photo: string;
  saved?: boolean;
};

export const listingLabels: Record<ListingType, string> = {
  doacao: "Doação",
  emprestimo: "Empréstimo",
  aluguer: "Aluguer",
};

export const objects: ObjectListing[] = [
  {
    id: "canon-eos-2000d",
    title: "Canon EOS 2000D",
    type: "aluguer",
    area: "Arroios",
    distance: "1,2 km",
    pricePerDay: 12,
    condition: "Preço por dia",
    photo: "/assets/objeto-1.png",
  },
  {
    id: "tenda-2-pessoas",
    title: "Tenda para 2 pessoas",
    type: "emprestimo",
    area: "Alvalade",
    distance: "2,4 km",
    condition: "Devolver em 5 dias",
    photo: "/assets/objeto-2.png",
  },
  {
    id: "bicicleta-de-cidade",
    title: "Bicicleta de cidade",
    type: "aluguer",
    area: "Avenidas Novas",
    distance: "1,8 km",
    pricePerDay: 8,
    condition: "Preço por dia",
    photo: "/assets/objeto-3.png",
    saved: true,
  },
  {
    id: "berbequim-bosch",
    title: "Berbequim sem fios Bosch",
    type: "emprestimo",
    area: "Penha de França",
    distance: "0,8 km",
    condition: "Devolver em 3 dias",
    photo: "/assets/objeto-4.png",
  },
  {
    id: "livros-novas-historias",
    title: "Livros para novas histórias",
    type: "doacao",
    area: "Graça",
    distance: "1,6 km",
    condition: "Pedir para receber",
    photo: "/assets/objeto-5.png",
  },
  {
    id: "comando-ps4",
    title: "Comando sem fios PS4",
    type: "doacao",
    area: "Anjos",
    distance: "0,6 km",
    condition: "Pedir para receber",
    photo: "/assets/objeto-6.png",
  },
  {
    id: "projetor-portatil",
    title: "Projetor portátil",
    type: "aluguer",
    area: "Campo de Ourique",
    distance: "3,2 km",
    pricePerDay: 10,
    condition: "Preço por dia",
    photo: "/assets/objeto-7.png",
  },
  {
    id: "mochila-40l",
    title: "Mochila de caminhada 40 L",
    type: "emprestimo",
    area: "Estrela",
    distance: "3,5 km",
    condition: "Devolver em 7 dias",
    photo: "/assets/objeto-8.png",
  },
];
