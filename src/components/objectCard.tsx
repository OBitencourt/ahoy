"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { listingLabels, type ListingType, type ObjectListing } from "@/src/lib/mocks/objects";
import { badgeColors, badgeIcons } from "../utils/artifactDetails";


export default function ObjectCard({
  object,
  showDistance = true,
}: {
  object: ObjectListing;
  /** No perfil público a localização é só "bairro, cidade" (sem distância). */
  showDistance?: boolean;
}) {
  const [saved, setSaved] = useState(Boolean(object.saved));
  const { id, title, type, area, city, distance, pricePerDay, condition, photo } =
    object;

  return (
    <article className="relative flex flex-col overflow-hidden rounded-2xl border border-line bg-white">
      <div className="relative h-53 shrink-0">
        <Image
          src={photo}
          alt={title}
          fill
          sizes="(min-width: 1200px) 282px, 50vw"
          className="object-cover"
        />
        <button
          type="button"
          className="absolute right-3 top-3 z-10 flex size-11 cursor-pointer items-center justify-center rounded-full bg-white"
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
          <h3 className="truncate text-lg font-bold leading-6.5 text-on-teal">
            {/* Link esticado: o ::after cobre o cartão todo, menos o botão de favorito (z-10) */}
            <Link
              href={`/artefacto/${id}`}
              className="after:absolute after:inset-0 after:rounded-2xl focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-teal"
            >
              {title}
            </Link>
          </h3>
          <p className="flex items-center gap-1 whitespace-nowrap text-sm font-normal leading-5 text-muted">
            <Image
              src="/assets/map-pin-sm.svg"
              width={14}
              height={14}
              alt=""
              className="shrink-0"
            />
            {showDistance ? `${area} · ${distance}` : `${area}, ${city}`}
          </p>
        </div>

        <div className="flex w-full items-center justify-between border-t border-line pt-2.5">
          <div className="flex flex-col gap-0.5 whitespace-nowrap">
            {pricePerDay !== undefined ? (
              <p className="text-lg font-bold leading-6.5 text-navy">
                {pricePerDay} €
                <span className="text-sm font-normal text-muted"> /dia</span>
              </p>
            ) : (
              <p className="text-lg font-bold leading-6.5 text-navy">Grátis</p>
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