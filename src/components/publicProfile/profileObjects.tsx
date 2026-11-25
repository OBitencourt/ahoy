"use client";

import Image from "next/image";
import { useState } from "react";
import Chip from "@/src/components/explore/chip";
import ObjectCard from "@/src/components/explore/objectCard";
import {
  listingLabels,
  type ListingType,
  type ObjectListing,
} from "@/src/lib/mocks/objects";

type Filter = ListingType | "todos";

const filters: { id: Filter; label: string; icon?: string }[] = [
  { id: "todos", label: "Todos" },
  { id: "doacao", label: listingLabels.doacao, icon: "/assets/gift.svg" },
  { id: "emprestimo", label: listingLabels.emprestimo, icon: "/assets/repeat-2.svg" },
  { id: "aluguer", label: listingLabels.aluguer, icon: "/assets/coins.svg" },
];

export default function ProfileObjects({
  firstName,
  objects,
}: {
  firstName: string;
  objects: ObjectListing[];
}) {
  const [filter, setFilter] = useState<Filter>("todos");

  const visible =
    filter === "todos" ? objects : objects.filter(({ type }) => type === filter);

  return (
    <section className="flex flex-col gap-6" aria-labelledby="artefactos-titulo">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h2
          id="artefactos-titulo"
          className="text-[22px] font-bold leading-[30px] text-on-teal"
        >
          Artefactos de {firstName}
        </h2>
        <p className="text-sm font-normal text-muted">
          {objects.length} {objects.length === 1 ? "objeto disponível" : "objetos disponíveis"}
        </p>
      </div>

      <div className="flex flex-wrap gap-2" role="group" aria-label="Tipo de partilha">
        {filters.map(({ id, label, icon }) => {
          const count =
            id === "todos"
              ? objects.length
              : objects.filter(({ type }) => type === id).length;

          return (
            <Chip
              key={id}
              selected={filter === id}
              aria-pressed={filter === id}
              onClick={() => setFilter(id)}
            >
              {icon && <Image src={icon} width={20} height={20} alt="" />}
              {label}
              <span className="text-xs font-normal text-muted">{count}</span>
            </Chip>
          );
        })}
      </div>

      {visible.length > 0 ? (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-6">
          {visible.map((object) => (
            <ObjectCard key={object.id} object={object} showDistance={false} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4 rounded-xl bg-mint px-6 py-5">
          <Image src="/assets/package-open.svg" width={28} height={28} alt="" />
          <div className="flex flex-col items-center gap-1 text-center text-sm">
            <p className="font-semibold text-on-teal">
              {objects.length === 0
                ? "Sem objetos publicados"
                : `Sem objetos de ${listingLabels[filter as ListingType].toLowerCase()}`}
            </p>
            <p className="font-normal text-muted">
              {objects.length === 0
                ? "Este membro ainda não publicou objetos para partilhar."
                : "Experimenta outro tipo de partilha."}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}