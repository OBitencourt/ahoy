"use client";

import Image from "next/image";
import { useState } from "react";

export default function FavoriteButton({ saved }: { saved?: boolean }) {
  const [isSaved, setIsSaved] = useState(Boolean(saved));

  return (
    <button
      type="button"
      className="flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-line bg-white"
      aria-label={isSaved ? "Remover dos favoritos" : "Guardar nos favoritos"}
      aria-pressed={isSaved}
      onClick={() => setIsSaved((value) => !value)}
    >
      <Image
        src={isSaved ? "/assets/saved.svg" : "/assets/heart.svg"}
        width={20}
        height={20}
        alt=""
      />
    </button>
  );
}
