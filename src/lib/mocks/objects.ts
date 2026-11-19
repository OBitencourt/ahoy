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
  ownerId: string;

  // --- Página do produto ---
  category: string;
  /** Estado de conservação (ex.: "Muito bom estado"). */
  state: string;
  city: string;
  /** Frase de destaque por cima da descrição. */
  headline: string;
  description: string;
  /** O que está incluído / notas sobre o estado. */
  includes: string;
  /** Fotografias extra da galeria (a principal é `photo`). */
  extraPhotos: string[];
  /** Mínimo de dias (só aluguer). */
  minDays?: number;
};

export const listingLabels: Record<ListingType, string> = {
  doacao: "Doação",
  emprestimo: "Empréstimo",
  aluguer: "Aluguer",
};

// PLACEHOLDERS: trocar pelas fotografias reais quando forem exportadas do Figma
const vista2 = "/assets/placeholders/vista-2.png";
const vista3 = "/assets/placeholders/vista-3.png";

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
    ownerId: "user-1",
    category: "Fotografia",
    state: "Muito bom estado",
    city: "Lisboa",
    headline: "Para os momentos que queres guardar.",
    description:
      "Uma reflex simples e fiável para quem quer aprender fotografia ou registar uma viagem. A Canon EOS 2000D tem sensor de 24,1 MP, ecrã de 3 polegadas e grava vídeo Full HD. Vem com a objetiva de kit 18–55 mm, perfeita para começar.",
    includes:
      "Inclui objetiva 18–55 mm, bateria, carregador, alça e bolsa. Traz o teu cartão SD. Material em muito bom estado, com pequenas marcas de uso na base.",
    extraPhotos: [vista2, vista3],
    minDays: 1,
  },
  {
    id: "tenda-2-pessoas",
    title: "Tenda para 2 pessoas",
    type: "emprestimo",
    area: "Alvalade",
    distance: "2,4 km",
    condition: "Devolver em 5 dias",
    photo: "/assets/objeto-2.png",
    ownerId: "user-2",
    category: "Campismo",
    state: "Bom estado",
    city: "Lisboa",
    headline: "Uma noite ao ar livre começa aqui.",
    description:
      "Tenda de montagem rápida para duas pessoas, leve e fácil de transportar. Ideal para festivais, caminhadas de fim de semana ou para a primeira experiência de campismo.",
    includes:
      "Inclui sacola, varetas e estacas. Não tem tapete interior, por isso leva o teu. Ligeiramente usada, sem rasgões.",
    extraPhotos: [vista2, vista3],
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
    ownerId: "user-3",
    category: "Mobilidade",
    state: "Muito bom estado",
    city: "Lisboa",
    headline: "A cidade fica mais perto de bicicleta.",
    description:
      "Bicicleta de cidade com cesto à frente e selim confortável, ótima para passeios à beira-rio e deslocações curtas. Mudanças suaves e travões revistos recentemente.",
    includes:
      "Inclui cadeado e luzes dianteira e traseira. O capacete não está incluído.",
    extraPhotos: [vista2, vista3],
    minDays: 1,
  },
  {
    id: "berbequim-bosch",
    title: "Berbequim sem fios Bosch",
    type: "emprestimo",
    area: "Penha de França",
    distance: "0,8 km",
    condition: "Devolver em 3 dias",
    photo: "/assets/objeto-4.png",
    ownerId: "user-2",
    category: "Ferramentas",
    state: "Bom estado",
    city: "Lisboa",
    headline: "Menos desculpas, mais prateleiras no sítio.",
    description:
      "Berbequim-aparafusador sem fios, com duas velocidades e controlo de binário. Chega para pendurar prateleiras, montar móveis e fazer pequenas reparações em casa.",
    includes:
      "Inclui duas baterias, carregador e um conjunto de brocas e pontas. Devolve-o com a bateria carregada.",
    extraPhotos: [vista2, vista3],
  },
  {
    id: "livros-novas-historias",
    title: "Livros para novas histórias",
    type: "doacao",
    area: "Graça",
    distance: "1,6 km",
    condition: "Pedir para receber",
    photo: "/assets/objeto-5.png",
    ownerId: "user-4",
    category: "Livros",
    state: "Bom estado",
    city: "Lisboa",
    headline: "Histórias que merecem uma segunda leitura.",
    description:
      "Um conjunto de romances e livros de bolso em português, já lidos e prontos para novas mãos. Podes ficar com todos ou só com os que mais te interessarem.",
    includes:
      "Cerca de 12 livros. Alguns têm marcas de uso nas capas. Levantamento em mão.",
    extraPhotos: [vista2, vista3],
  },
  {
    id: "comando-ps4",
    title: "Comando sem fios PS4",
    type: "doacao",
    area: "Anjos",
    distance: "0,6 km",
    condition: "Pedir para receber",
    photo: "/assets/objeto-6.png",
    ownerId: "user-5",
    category: "Videojogos",
    state: "Muito bom estado",
    city: "Lisboa",
    headline: "Mais um jogador na sala.",
    description:
      "Comando sem fios DualShock 4 para PlayStation 4, com botões e manípulos a funcionar na perfeição. Liga por Bluetooth e carrega por cabo micro-USB.",
    includes: "Inclui cabo de carregamento. A bateria mantém boa autonomia.",
    extraPhotos: [vista2, vista3],
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
    ownerId: "user-1",
    category: "Eletrónica",
    state: "Muito bom estado",
    city: "Lisboa",
    headline: "Cinema em casa, quando quiseres.",
    description:
      "Projetor portátil com ligação HDMI e Wi-Fi, ideal para noites de cinema ou apresentações em família. Funciona melhor em salas com pouca luz.",
    includes:
      "Inclui comando, cabo HDMI e saco de transporte. Precisas de uma parede clara ou de um ecrã.",
    extraPhotos: [vista2, vista3],
    minDays: 1,
  },
  {
    id: "mochila-40l",
    title: "Mochila de caminhada 40 L",
    type: "emprestimo",
    area: "Estrela",
    distance: "3,5 km",
    condition: "Devolver em 7 dias",
    photo: "/assets/objeto-8.png",
    ownerId: "user-3",
    category: "Caminhadas",
    state: "Bom estado",
    city: "Lisboa",
    headline: "Leva o essencial até ao topo.",
    description:
      "Mochila de caminhada de 40 litros com costas ventiladas, cinto de peso e capa de chuva integrada. Confortável para percursos de um ou dois dias.",
    includes: "Inclui capa de chuva. Limpa e pronta a usar.",
    extraPhotos: [vista2, vista3],
  },
];

/** Procura um objeto do mock pelo id (para a página /objetos/[id]). */
export function getObjectById(id: string): ObjectListing | undefined {
  return objects.find((object) => object.id === id);
}

/** Outros objetos para a secção "Objetos semelhantes" (mesmo tipo primeiro). */
export function getSimilarObjects(id: string, limit = 4): ObjectListing[] {
  const current = getObjectById(id);

  return objects
    .filter((object) => object.id !== id)
    .sort(
      (a, b) =>
        Number(b.type === current?.type) - Number(a.type === current?.type),
    )
    .slice(0, limit);
}
