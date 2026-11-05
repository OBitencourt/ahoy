"use client";

import Image from "next/image";
import { useState } from "react";
import Chip from "./chip";

type ShareFilter = "todos" | "doacao" | "emprestimo" | "aluguer";

const shareFilters: { id: ShareFilter; label: string; icon?: string }[] = [
  { id: "todos", label: "Todos" },
  { id: "doacao", label: "Doação", icon: "/assets/gift.svg" },
  { id: "emprestimo", label: "Empréstimo", icon: "/assets/repeat-2.svg" },
  { id: "aluguer", label: "Aluguer", icon: "/assets/coins.svg" },
];

export default function SearchFilters() {
  const [share, setShare] = useState<ShareFilter>("todos");

  return (
    <section className="flex flex-col gap-7" aria-labelledby="explorar-titulo">
      <div className="flex flex-col gap-2">
        <h1
          id="explorar-titulo"
          className="text-[36px] font-bold leading-[44px] text-on-teal"
        >
          Descobre o teu próximo tesouro.
        </h1>
        <p className="text-base font-normal leading-6 text-muted">
          Objetos com mais para dar. Pessoas por perto para partilhar.
        </p>
      </div>

      <form
        className="flex flex-col gap-2"
        role="search"
        onSubmit={(event) => event.preventDefault()}
      >
        <label
          htmlFor="pesquisa-objeto"
          className="text-sm font-semibold text-ink"
        >
          Encontra o que precisas
        </label>
        <div className="flex h-16 items-center gap-5 rounded-2xl border border-line bg-white p-2">
          <div className="flex min-w-0 flex-1 items-center gap-3 pl-3">
            <Image
              src="/assets/search-lg.svg"
              width={24}
              height={24}
              alt=""
              className="shrink-0"
            />
            <input
              id="pesquisa-objeto"
              type="search"
              placeholder="O que estás à procura?"
              className="min-w-0 flex-1 bg-transparent text-base font-normal text-ink outline-none placeholder:text-muted"
            />
          </div>
          <div className="h-7 w-px shrink-0 bg-line" aria-hidden="true" />
          <button
            type="button"
            className="flex w-[242px] shrink-0 cursor-pointer items-center gap-2.5 text-sm font-medium text-ink"
          >
            <Image
              src="/assets/map-pin.svg"
              width={20}
              height={20}
              alt=""
              className="shrink-0"
            />
            <span>Lisboa · até 5 km</span>
            <Image
              src="/assets/chevron-down.svg"
              width={16}
              height={16}
              alt=""
              className="shrink-0"
            />
          </button>
          <button
            type="submit"
            className="h-12 shrink-0 cursor-pointer rounded-xl bg-teal px-6 text-sm font-bold text-on-teal"
          >
            Pesquisar
          </button>
        </div>
      </form>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div
          className="flex flex-wrap gap-2"
          role="group"
          aria-label="Tipo de partilha"
        >
          {shareFilters.map(({ id, label, icon }) => (
            <Chip
              key={id}
              selected={share === id}
              aria-pressed={share === id}
              onClick={() => setShare(id)}
            >
              {icon && <Image src={icon} width={20} height={20} alt="" />}
              {label}
            </Chip>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          <Chip>
            Categoria
            <Image src="/assets/chevron-down.svg" width={16} height={16} alt="" />
          </Chip>
          <Chip>
            Preço
            <Image src="/assets/chevron-down.svg" width={16} height={16} alt="" />
          </Chip>
          <Chip>
            <Image src="/assets/calendar-days.svg" width={20} height={20} alt="" />
            Disponibilidade
            <Image src="/assets/chevron-down.svg" width={16} height={16} alt="" />
          </Chip>
          <button
            type="button"
            className="h-11 cursor-pointer px-3 text-sm font-semibold text-navy underline"
            onClick={() => setShare("todos")}
          >
            Limpar filtros
          </button>
        </div>
      </div>
    </section>
  );
}
