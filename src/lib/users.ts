export type User = {
  id: string;
  name: string;
  username: string;
  email: string;
  location: string;
  bio: string;
  avatar: string;
  /** Média das avaliações (0–5). */
  rating: number;
  reviewCount: number;
};

// PLACEHOLDERS: trocar pelas fotografias reais quando forem exportadas do Figma
const avatar = "/assets/placeholders/avatar.png";
const avatarJoao = "/assets/placeholders/avatar-joao.png";

/**
 * MOCK — enquanto não há base de dados.
 * Mapeamento id → utilizador; `ObjectListing.ownerId` aponta para estas chaves.
 */
export const users: Record<string, User> = {
  "user-1": {
    id: "user-1",
    name: "Ricardo Costa",
    username: "ricardo.costa",
    email: "ricardo.costa@email.pt",
    location: "Lisboa, Portugal",
    bio: "Apaixonado por fotografia e por dar uma segunda vida ao equipamento que já não uso.",
    avatar,
    rating: 4.9,
    reviewCount: 18,
  },
  "user-2": {
    id: "user-2",
    name: "Marta Lopes",
    username: "marta.lopes",
    email: "marta.lopes@email.pt",
    location: "Lisboa, Portugal",
    bio: "Gosto de campismo e de bricolage. Empresto o que tenho cá por casa.",
    avatar,
    rating: 4.7,
    reviewCount: 9,
  },
  "user-3": {
    id: "user-3",
    name: "Tiago Ramos",
    username: "tiago.ramos",
    email: "tiago.ramos@email.pt",
    location: "Lisboa, Portugal",
    bio: "Ciclista de fim de semana e entusiasta de caminhadas.",
    avatar,
    rating: 4.8,
    reviewCount: 12,
  },
  "user-4": {
    id: "user-4",
    name: "Inês Duarte",
    username: "ines.duarte",
    email: "ines.duarte@email.pt",
    location: "Lisboa, Portugal",
    bio: "Leitora compulsiva. Os livros cá de casa procuram novas estantes.",
    avatar,
    rating: 5,
    reviewCount: 4,
  },
  "user-5": {
    id: "user-5",
    name: "João Pereira",
    username: "joao.pereira",
    email: "joao.pereira@email.pt",
    location: "Lisboa, Portugal",
    bio: "Jogos, tecnologia e boa conversa.",
    avatar,
    rating: 4.6,
    reviewCount: 7,
  },
  // Utilizador com sessão iniciada (página "A minha conta")
  "user-6": {
    id: "user-6",
    name: "João Ferreira",
    username: "joao.ferreira",
    email: "joao.ferreira@email.pt",
    location: "Porto, Portugal",
    bio: "Gosto de fotografar, explorar trilhos e dar uma nova vida ao que já não uso. Por aqui, partilho objetos e boas histórias.",
    avatar: avatarJoao,
    rating: 4.8,
    reviewCount: 6,
  },
};

/** MOCK — substituir pelo utilizador da sessão quando houver autenticação com dados. */
export const currentUserId = "user-6";

export function getCurrentUser(): User {
  return users[currentUserId];
}

/** Procura o utilizador que publicou o objeto (`ObjectListing.ownerId`). */
export function getUserById(id: string): User | undefined {
  return users[id];
}
