import { getObjectById, type ObjectListing } from "@/src/lib/mocks/objects";
import { getUserById, type User } from "@/src/lib/mocks/users";

export type Message = {
  id: string;
  from: "me" | "them";
  text: string;
  /** Hora de envio (HH:mm). */
  time: string;
};

/** Mensagens agrupadas por dia (ex.: "Hoje, 17 de outubro"). */
export type MessageDay = {
  label: string;
  messages: Message[];
};

/** Pedido associado à conversa (aparece por baixo do objeto). */
export type RequestInfo = {
  status: "pendente";
  /** Período pedido (ex.: "23–25 out."). */
  period: string;
  explanation: string;
};

export type Conversation = {
  id: string;
  participant: User;
  /** Objeto sobre o qual se está a conversar. */
  object: ObjectListing;
  /** Hora ou dia da última atividade, como aparece na lista (ex.: "10:42", "Ontem"). */
  updatedAt: string;
  unread: boolean;
  request?: RequestInfo;
  days: MessageDay[];
};

type ConversationData = Omit<Conversation, "participant" | "object"> & {
  /** → `users` em users.ts */
  participantId: string;
  /** → `objects` em objects.ts */
  objectId: string;
};

/**
 * MOCK — enquanto não há base de dados.
 * O utilizador com sessão é `getCurrentUser()` (user-6, "João"); cada conversa
 * liga-o a outro utilizador e a um objeto do mock.
 */
const conversations: ConversationData[] = [
  {
    id: "conversa-1",
    participantId: "user-1",
    objectId: "canon-eos-2000d",
    updatedAt: "10:42",
    unread: false,
    request: {
      status: "pendente",
      period: "23–25 out.",
      explanation: "Aguarda a aceitação do Ricardo. O aluguer ainda não está confirmado.",
    },
    days: [
      {
        label: "Hoje, 17 de outubro",
        messages: [
          {
            id: "m-1-1",
            from: "me",
            text: "Olá Ricardo! Gostava de alugar a Canon de 23 a 25 de outubro. Tens disponibilidade?",
            time: "10:30",
          },
          {
            id: "m-1-2",
            from: "them",
            text: "Olá João! Em princípio sim. A objetiva 18–55 mm e a bateria estão incluídas.",
            time: "10:34",
          },
          {
            id: "m-1-3",
            from: "me",
            text: "Ótimo! Posso levantar na sexta ao fim da tarde e devolver no domingo, no Porto?",
            time: "10:36",
          },
          {
            id: "m-1-4",
            from: "them",
            text: "Sim, podemos combinar na Trindade. A que horas te dava jeito na sexta?",
            time: "10:42",
          },
        ],
      },
    ],
  },
  {
    id: "conversa-2",
    participantId: "user-2",
    objectId: "tenda-2-pessoas",
    updatedAt: "09:18",
    unread: true,
    request: {
      status: "pendente",
      period: "1–3 nov.",
      explanation: "Aguarda a aceitação da Marta. O empréstimo ainda não está confirmado.",
    },
    days: [
      {
        label: "Hoje, 17 de outubro",
        messages: [
          {
            id: "m-2-1",
            from: "me",
            text: "Olá Marta! A tenda ainda está disponível para o fim de semana de 1 de novembro?",
            time: "09:05",
          },
          {
            id: "m-2-2",
            from: "them",
            text: "Olá João! A tenda está disponível.",
            time: "09:18",
          },
        ],
      },
    ],
  },
  {
    id: "conversa-3",
    participantId: "user-4",
    objectId: "livros-novas-historias",
    updatedAt: "Ontem",
    unread: true,
    days: [
      {
        label: "Ontem, 16 de outubro",
        messages: [
          {
            id: "m-3-1",
            from: "me",
            text: "Olá Inês! Os livros já estão arrumados numa caixa, podes passar quando quiseres.",
            time: "18:20",
          },
          {
            id: "m-3-2",
            from: "them",
            text: "Obrigada pelos livros, João!",
            time: "21:47",
          },
        ],
      },
    ],
  },
  {
    id: "conversa-4",
    participantId: "user-3",
    objectId: "mochila-40l",
    updatedAt: "Qua.",
    unread: false,
    days: [
      {
        label: "Quarta-feira, 15 de outubro",
        messages: [
          {
            id: "m-4-1",
            from: "them",
            text: "Olá João! A mochila fica contigo até ao fim de semana.",
            time: "14:02",
          },
          {
            id: "m-4-2",
            from: "me",
            text: "Posso devolver na segunda-feira?",
            time: "14:10",
          },
        ],
      },
    ],
  },
];

/** MOCK — substituir por pedido à base de dados (conversas do utilizador com sessão). */
export function getConversations(): Conversation[] {
  return conversations.flatMap(({ participantId, objectId, ...rest }) => {
    const participant = getUserById(participantId);
    const object = getObjectById(objectId);

    return participant && object ? [{ ...rest, participant, object }] : [];
  });
}