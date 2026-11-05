"use client";

import Image from "next/image";
import { useState } from "react";
import { listingLabels, type ListingType, type ObjectListing } from "@/src/lib/objects";

const badgeIcons: Record<ListingType, string> = {
  doacao: "/assets/gift-sm.svg",
  emprestimo: "/assets/repeat-2-sm.svg",
  aluguer: "/assets/coins-sm.svg",
};

const badgeColors: Record<ListingType, string> = {
  doacao: "bg-mint",
  emprestimo: "bg-sky",
  aluguer: "bg-sand",
};

/** Objeto: 282 × 392 no Figma */
export default function ObjectCard({ object }: { object: ObjectListing }) {
  const [saved, setSaved] = useState(Boolean(object.saved));
  const { title, type, area, distance, pricePerDay, condition, photo } = object;

  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-line bg-white">
      <div className="relative h-[212px] shrink-0">
        <Image
          src={photo}
          alt={title}
          fill
          sizes="(min-width: 1200px) 282px, 50vw"
          className="object-cover"
        />
        <button
          type="button"
          className="absolute right-3 top-3 flex size-11 cursor-pointer items-center justify-center rounded-full bg-white"
          aria-label={saved ? "Remover dos favoritos" : "Guardar nos favoritos"}
          aria-pressed={saved}
          onClick={() => setSaved((value) => !value)}
        >
          {saved ? (
            <Image src="/assets/saved.svg" width={20} height={20} alt="" />
          ) : (
            <Image src="/assets/heart.svg" width={20} height={20} alt="" />
          )}
        </button>
      </div>

      <div className="flex flex-col items-start gap-2.5 p-4">
        <span
          className={`inline-flex items-center gap-1 whitespace-nowrap rounded-md px-2 py-1 text-xs font-semibold leading-4 text-navy ${badgeColors[type]}`}
        >
          <Image
            src={badgeIcons[type]}
            width={14}
            height={14}
            alt=""
            className="shrink-0"
          />
          {listingLabels[type]}
        </span>

        <div className="flex w-full flex-col gap-1">
          <h3 className="truncate text-lg font-bold leading-[26px] text-on-teal">
            {title}
          </h3>
          <p className="flex items-center gap-1 whitespace-nowrap text-sm font-normal leading-5 text-muted">
            <Image
              src="/assets/map-pin-sm.svg"
              width={14}
              height={14}
              alt=""
              className="shrink-0"
            />
            {area} · {distance}
          </p>
        </div>

        <div className="flex w-full items-center justify-between border-t border-line pt-2.5">
          <div className="flex flex-col gap-0.5 whitespace-nowrap">
            {pricePerDay !== undefined ? (
              <p className="text-lg font-bold leading-[26px] text-navy">
                {pricePerDay} €
                <span className="text-sm font-normal text-muted"> /dia</span>
              </p>
            ) : (
              <p className="text-lg font-bold leading-[26px] text-navy">Grátis</p>
            )}
            <p className="text-xs font-normal leading-4 text-muted">{condition}</p>
          </div>
          <Image
            src="/assets/arrow-up-right.svg"
            width={20}
            height={20}
            alt=""
            className="shrink-0"
          />
        </div>
      </div>
    </article>
  );
}
