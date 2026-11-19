"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import Chip from "@/src/components/chip";
import { listingLabels, type ListingType } from "@/src/lib/mocks/objects";
import type { ListingStatus, MyListing } from "@/src/lib/mocks/myListings";
import { badgeColors, badgeIcons } from "@/src/utils/artifactDetails";

type StatusFilter = ListingStatus | "todos";

const statusFilters: { id: StatusFilter; label: string }[] = [
  { id: "todos", label: "Todos" },
  { id: "ativo", label: "Ativos" },
  { id: "indisponivel", label: "Indisponíveis" },
  { id: "concluido", label: "Concluídos" },
];

const statusLabels: Record<ListingStatus, string> = {
  ativo: "Ativo",
  indisponivel: "Indisponível",
  concluido: "Concluído",
};

const publicationLabels: Record<ListingStatus, string> = {
  ativo: "Publicado · disponível",
  indisponivel: "Publicado · indisponível",
  concluido: "Publicado · entregue",
};

const menuItemClassName =
  "flex min-h-11 w-full cursor-pointer items-center gap-2 rounded-lg p-2 text-left text-[13px] font-normal leading-5 text-ink hover:bg-sky";

function priceLabel(pricePerDay?: number) {
  return pricePerDay !== undefined ? `${pricePerDay} €/dia` : "Grátis";
}

function requestsLabel({ status, pendingRequests, handedTo }: MyListing) {
  if (status === "concluido" && handedTo) return `Entregue a ${handedTo}`;
  if (pendingRequests === 0) return "Sem pedidos";
  return pendingRequests === 1
    ? "1 pedido pendente"
    : `${pendingRequests} pedidos pendentes`;
}

export default function MyObjects({ listings: initialListings }: { listings: MyListing[] }) {
  const [listings, setListings] = useState<MyListing[]>(initialListings);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("todos");
  const [typeFilter, setTypeFilter] = useState<ListingType | "todos">("todos");
  const [search, setSearch] = useState<string>("");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [toDelete, setToDelete] = useState<MyListing | null>(null);

  // Fecha o menu com Esc ou ao clicar fora; fecha o diálogo com Esc
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      setOpenMenuId(null);
      setToDelete(null);
    }
    function onPointerDown(event: PointerEvent) {
      if (!(event.target as Element).closest("[data-menu-root]")) {
        setOpenMenuId(null);
      }
    }

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, []);

  const query = search.trim().toLowerCase();
  const visible = listings.filter(
    ({ object, status }) =>
      (statusFilter === "todos" || status === statusFilter) &&
      (typeFilter === "todos" || object.type === typeFilter) &&
      (query === "" || object.title.toLowerCase().includes(query)),
  );

  // MOCK: trocar por chamadas ao servidor quando houver base de dados
  function toggleAvailability(id: string) {
    setListings((current) =>
      current.map((listing) =>
        listing.object.id === id
          ? { ...listing, status: listing.status === "ativo" ? "indisponivel" : "ativo" }
          : listing,
      ),
    );
    setOpenMenuId(null);
  }

  function confirmDelete() {
    if (!toDelete) return;
    setListings((current) => current.filter(({ object }) => object.id !== toDelete.object.id));
    setToDelete(null);
  }

  if (listings.length === 0) {
    return (
      <div className="flex flex-col items-center gap-5 rounded-2xl bg-cream p-12">
        <Image src="/assets/package-open.svg" width={40} height={40} alt="" />
        <div className="flex flex-col gap-2 text-center">
          <p className="text-[22px] font-bold leading-[30px] text-on-teal">
            O teu primeiro tesouro começa aqui.
          </p>
          <p className="text-sm font-normal leading-6 text-muted">
            Tens algo que usas pouco? Publica um objeto e dá-lhe uma nova vida na comunidade.
          </p>
        </div>
        <Link
          href="/publicar"
          className="flex h-12 items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-teal px-5 text-sm font-bold text-on-teal transition-opacity hover:opacity-90"
        >
          <Image src="/assets/plus.svg" width={20} height={20} alt="" />
          Publicar o primeiro objeto
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-5">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Estado dos anúncios">
          {statusFilters.map(({ id, label }) => (
            <Chip
              key={id}
              selected={statusFilter === id}
              aria-pressed={statusFilter === id}
              onClick={() => setStatusFilter(id)}
            >
              {label}
              <span className="text-xs font-normal text-muted">
                {id === "todos"
                  ? listings.length
                  : listings.filter(({ status }) => status === id).length}
              </span>
            </Chip>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <label className="flex h-12 w-full items-center gap-2.5 rounded-xl border border-line bg-white px-3.5 focus-within:border-navy focus-within:ring-1 focus-within:ring-navy sm:max-w-[480px]">
            <Image src="/assets/search.svg" width={20} height={20} alt="" className="shrink-0" />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Pesquisar os meus objetos"
              aria-label="Pesquisar os meus objetos"
              className="min-w-0 flex-1 bg-transparent text-sm font-normal text-ink outline-none placeholder:text-muted"
            />
          </label>

          <div className="relative">
            <select
              value={typeFilter}
              onChange={(event) => setTypeFilter(event.target.value as ListingType | "todos")}
              aria-label="Tipo de partilha"
              className="h-12 cursor-pointer appearance-none rounded-xl border border-line bg-white pl-4 pr-11 text-sm font-normal text-ink outline-none focus:border-navy focus:ring-1 focus:ring-navy"
            >
              <option value="todos">Todos os tipos</option>
              <option value="doacao">{listingLabels.doacao}</option>
              <option value="emprestimo">{listingLabels.emprestimo}</option>
              <option value="aluguer">{listingLabels.aluguer}</option>
            </select>
            <Image
              src="/assets/chevron-down.svg"
              width={16}
              height={16}
              alt=""
              className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2"
            />
          </div>
        </div>
      </div>

      <section className="flex flex-col gap-5" aria-label="Objetos publicados">
        <p className="text-sm font-normal text-muted" aria-live="polite">
          {visible.length} {visible.length === 1 ? "objeto publicado" : "objetos publicados"}
        </p>

        {visible.length === 0 ? (
          <p className="rounded-xl bg-mint px-6 py-5 text-center text-sm font-normal text-muted">
            Nenhum objeto corresponde aos filtros escolhidos.
          </p>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-6">
            {visible.map((listing) => {
              const { object, status, conditionLabel } = listing;
              const { id, title, type, photo, pricePerDay, condition } = object;
              const menuOpen = openMenuId === id;

              return (
                <article
                  key={id}
                  data-menu-root
                  className="relative flex flex-col rounded-2xl border border-line bg-white"
                >
                  <div className="relative aspect-[4/3] overflow-hidden rounded-t-2xl">
                    <Image
                      src={photo}
                      alt={title}
                      fill
                      sizes="(min-width: 1200px) 384px, 100vw"
                      className="object-cover"
                    />
                  </div>

                  <button
                    type="button"
                    aria-label={`Mais opções para ${title}`}
                    aria-haspopup="menu"
                    aria-expanded={menuOpen}
                    onClick={() => setOpenMenuId(menuOpen ? null : id)}
                    className="absolute right-2.5 top-2.5 z-10 flex size-11 cursor-pointer items-center justify-center rounded-full bg-white"
                  >
                    <Image src="/assets/ellipsis.svg" width={20} height={20} alt="" />
                  </button>

                  {menuOpen && (
                    <div
                      role="menu"
                      className="absolute right-2.75 top-14.75 z-20 flex w-62 max-w-[calc(100%-22px)] flex-col rounded-xl border border-line bg-white p-2 shadow-[0_4px_16px_rgba(8,43,58,0.08)]"
                    >
                      <Link
                        href={`/artefacto/${id}/editar`}
                        role="menuitem"
                        className={menuItemClassName}
                      >
                        <Image src="/assets/pencil.svg" width={16} height={16} alt="" className="shrink-0" />
                        Editar
                      </Link>
                      {status !== "concluido" && (
                        <button
                          type="button"
                          role="menuitem"
                          onClick={() => toggleAvailability(id)}
                          className={menuItemClassName}
                        >
                          <Image
                            src={status === "ativo" ? "/assets/eye-off.svg" : "/assets/eye.svg"}
                            width={16}
                            height={16}
                            alt=""
                            className="shrink-0"
                          />
                          {status === "ativo" ? "Marcar como indisponível" : "Reativar"}
                        </button>
                      )}
                      <button
                        type="button"
                        role="menuitem"
                        onClick={() => {
                          setOpenMenuId(null);
                          setToDelete(listing);
                        }}
                        className={`${menuItemClassName} text-danger`}
                      >
                        <Image src="/assets/trash-2.svg" width={16} height={16} alt="" className="shrink-0" />
                        Eliminar
                      </button>
                    </div>
                  )}

                  <div className="flex flex-col items-start gap-2.5 p-4">
                    <span
                      className={`inline-flex items-center gap-1 whitespace-nowrap rounded-md px-2 py-1 text-xs font-semibold leading-4 text-navy ${badgeColors[type]}`}
                    >
                      <Image src={badgeIcons[type]} width={14} height={14} alt="" className="shrink-0" />
                      {listingLabels[type]}
                    </span>

                    <h2 className="min-h-6.5 w-full text-lg font-bold leading-6.5 text-on-teal">
                      {/* Link esticado: o ::after cobre o cartão todo, menos os botões (z-10) */}
                      <Link
                        href={`/artefacto/${id}`}
                        className="after:absolute after:inset-0 after:rounded-2xl focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-teal"
                      >
                        {title}
                      </Link>
                    </h2>

                    <div className="flex w-full flex-col gap-1">
                      <p className="flex items-center gap-1.5 text-sm font-semibold text-ink">
                        <span
                          aria-hidden="true"
                          className={`size-1.5 rounded-full ${status === "ativo" ? "bg-teal" : "bg-muted"}`}
                        />
                        {statusLabels[status]}
                      </p>
                      <p className="text-xs font-normal leading-[18px] text-muted">
                        {publicationLabels[status]}
                      </p>
                    </div>

                    <div className="flex w-full flex-col gap-1 border-t border-line pt-2.5">
                      <p className="text-lg font-bold text-navy">{priceLabel(pricePerDay)}</p>
                      <p className="text-xs font-normal leading-[18px] text-muted">
                        {conditionLabel ?? condition}
                      </p>
                    </div>

                    <div className="flex h-9 w-full items-center justify-between">
                      <p className="text-xs font-normal text-muted">{requestsLabel(listing)}</p>
                      <Link
                        href={`/artefacto/${id}/editar`}
                        aria-label={`Editar ${title}`}
                        className="relative z-10"
                      >
                        <Image src="/assets/pencil.svg" width={16} height={16} alt="" />
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {toDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-on-teal/40 p-4 sm:p-20"
          onClick={() => setToDelete(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="eliminar-titulo"
            aria-describedby="eliminar-descricao"
            onClick={(event) => event.stopPropagation()}
            className="flex w-full max-w-[440px] flex-col gap-5 rounded-2xl bg-white p-8"
          >
            <div className="flex items-center justify-between">
              <div className="flex size-11 items-center justify-center rounded-full bg-danger-soft">
                <Image src="/assets/trash-2.svg" width={20} height={20} alt="" />
              </div>
              <button
                type="button"
                aria-label="Fechar"
                onClick={() => setToDelete(null)}
                className="cursor-pointer"
              >
                <Image src="/assets/x.svg" width={20} height={20} alt="" />
              </button>
            </div>

            <h2 id="eliminar-titulo" className="text-[22px] font-bold text-on-teal">
              Eliminar este objeto?
            </h2>
            <p id="eliminar-descricao" className="text-sm font-normal leading-6 text-muted">
              O anúncio «{toDelete.object.title}» deixará de estar disponível. Esta ação não pode ser anulada.
            </p>

            <div className="flex items-center gap-3 rounded-xl border border-line p-3">
              <Image
                src={toDelete.object.photo}
                width={56}
                height={56}
                alt=""
                className="size-14 shrink-0 rounded-lg object-cover"
              />
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <p className="text-sm font-bold text-on-teal">{toDelete.object.title}</p>
                <p className="text-xs font-normal text-muted">
                  {listingLabels[toDelete.object.type]}
                  {toDelete.object.pricePerDay !== undefined &&
                    ` · ${priceLabel(toDelete.object.pricePerDay)}`}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button
                type="button"
                autoFocus
                onClick={() => setToDelete(null)}
                className="h-12 cursor-pointer rounded-xl border-2 border-navy bg-white px-5 text-sm font-bold text-on-teal"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="h-12 cursor-pointer rounded-xl bg-danger px-5 text-sm font-bold text-white transition-opacity hover:opacity-90"
              >
                Eliminar objeto
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}