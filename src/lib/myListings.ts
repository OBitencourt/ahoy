import { getObjectById, type ObjectListing } from "@/src/lib/objects";

export type ListingStatus = "ativo" | "indisponivel" | "concluido";

export type MyListing = {
  object: ObjectListing;
  status: ListingStatus;
  pendingRequests: number;
  /** Só nos concluídos: a quem foi entregue. */
  handedTo?: string;
  /** Substitui `object.condition` (ex.: "Doação concluída"). */
  conditionLabel?: string;
};

/**
 * MOCK — anúncios do utilizador com sessão, enquanto não há base de dados.
 * `objectId` aponta para `objects` em objects.ts.
 */
const mock: (Omit<MyListing, "object"> & { objectId: string })[] = [
  { objectId: "canon-eos-2000d", status: "ativo", pendingRequests: 2 },
  { objectId: "tenda-2-pessoas", status: "ativo", pendingRequests: 1 },
  { objectId: "bicicleta-de-cidade", status: "indisponivel", pendingRequests: 0 },
  { objectId: "berbequim-bosch", status: "ativo", pendingRequests: 0 },
  {
    objectId: "livros-novas-historias",
    status: "concluido",
    pendingRequests: 0,
    handedTo: "Inês",
    conditionLabel: "Doação concluída",
  },
  { objectId: "projetor-portatil", status: "indisponivel", pendingRequests: 0 },
];

export function getMyListings(): MyListing[] {
  return mock.flatMap(({ objectId, ...rest }) => {
    const object = getObjectById(objectId);
    return object ? [{ object, ...rest }] : [];
  });
}