export type User = {
  id: string;
  name: string;
  avatar: string;
  /** Média das avaliações (0–5). */
  rating: number;
  reviewCount: number;
};

// PLACEHOLDER: trocar pela fotografia real quando for exportada do Figma
const avatar = "/assets/placeholders/avatar.png";

export const users: Record<string, User> = {
  "user-1": {
    id: "user-1",
    name: "Ricardo Costa",
    avatar,
    rating: 4.9,
    reviewCount: 18,
  },
  "user-2": {
    id: "user-2",
    name: "Marta Lopes",
    avatar,
    rating: 4.7,
    reviewCount: 9,
  },
  "user-3": {
    id: "user-3",
    name: "Tiago Ramos",
    avatar,
    rating: 4.8,
    reviewCount: 12,
  },
  "user-4": {
    id: "user-4",
    name: "Inês Duarte",
    avatar,
    rating: 5,
    reviewCount: 4,
  },
  "user-5": {
    id: "user-5",
    name: "João Pereira",
    avatar,
    rating: 4.6,
    reviewCount: 7,
  },
};

/** Procura o utilizador que publicou o objeto (`ObjectListing.ownerId`). */
export function getUserById(id: string): User | undefined {
  return users[id];
}
