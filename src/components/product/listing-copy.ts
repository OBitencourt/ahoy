import type { ListingType, ObjectListing } from "@/src/lib/mocks/objects";

export type Condition = {
  icon: string;
  title: string;
  description: string;
};

export type ListingCopy = {
  conditionsTitle: string;
  conditions: Condition[];
  /** Texto do botão principal. */
  requestLabel: string;
  availability: string;
  requestNote: string;
};

/**
 * Textos que mudam com o tipo de anúncio. O design só mostra o caso "aluguer";
 * empréstimo e doação seguem a mesma estrutura.
 */

const builders: Record<
  ListingType,
  (object: ObjectListing, ownerName: string) => ListingCopy
> = {
  aluguer: ({ pricePerDay, minDays = 1, city }, ownerName) => ({
    conditionsTitle: "Como funciona este aluguer",
    conditions: [
      {
        icon: "/assets/calendar-days.svg",
        title: `${pricePerDay ?? "—"} € por dia · mínimo de ${minDays} ${
          minDays === 1 ? "dia" : "dias"
        }`,
        description: `As datas e a duração são combinadas com ${ownerName}.`,
      },
      {
        icon: "/assets/map-pin.svg",
        title: `Entrega em mão em ${city}`,
        description: "Local e horário a combinar por mensagem.",
      },
      {
        icon: "/assets/repeat-2.svg",
        title: "Devolução na data combinada",
        description:
          "Devolve o equipamento completo, limpo e nas mesmas condições.",
      },
    ],
    requestLabel: "Solicitar aluguer",
    availability: `Indica as datas por mensagem. O aluguer só fica combinado após a aceitação de ${ownerName}.`,
    requestNote: "Enviar um pedido não confirma o aluguer.",
  }),

  emprestimo: ({ condition, city }, ownerName) => ({
    conditionsTitle: "Como funciona este empréstimo",
    conditions: [
      {
        icon: "/assets/calendar-days.svg",
        title: "Empréstimo gratuito",
        description: `${condition}. As datas são combinadas com ${ownerName}.`,
      },
      {
        icon: "/assets/map-pin.svg",
        title: `Entrega em mão em ${city}`,
        description: "Local e horário a combinar por mensagem.",
      },
      {
        icon: "/assets/repeat-2.svg",
        title: "Devolução na data combinada",
        description: "Devolve o objeto completo, limpo e nas mesmas condições.",
      },
    ],
    requestLabel: "Solicitar empréstimo",
    availability: `Indica as datas por mensagem. O empréstimo só fica combinado após a aceitação de ${ownerName}.`,
    requestNote: "Enviar um pedido não confirma o empréstimo.",
  }),

  doacao: ({ city }, ownerName) => ({
    conditionsTitle: "Como funciona esta doação",
    conditions: [
      {
        icon: "/assets/gift.svg",
        title: "Oferta gratuita",
        description: "O objeto fica contigo, não é preciso devolver.",
      },
      {
        icon: "/assets/map-pin.svg",
        title: `Levantamento em mão em ${city}`,
        description: "Local e horário a combinar por mensagem.",
      },
      {
        icon: "/assets/calendar-days.svg",
        title: "Combina o dia e a hora",
        description: `Fala com ${ownerName} para acertarem o levantamento.`,
      },
    ],
    requestLabel: "Pedir para receber",
    availability: `Envia o teu pedido por mensagem. A doação só fica combinada após a aceitação de ${ownerName}.`,
    requestNote: "Enviar um pedido não garante a doação.",
  }),
};

export function getListingCopy(
  object: ObjectListing,
  ownerName: string,
): ListingCopy {
  return builders[object.type](object, ownerName);
}
