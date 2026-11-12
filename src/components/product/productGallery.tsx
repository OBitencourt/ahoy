"use client";

import Image from "next/image";
import { useState } from "react";

export default function ProductGallery({
  title,
  photos,
}: {
  title: string;
  photos: string[];
}) {
  const [selected, setSelected] = useState(0);

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-[620/465] w-full overflow-hidden rounded-2xl">
        <Image
          src={photos[selected]}
          alt={`${title} — fotografia ${selected + 1}`}
          fill
          priority
          sizes="(min-width: 1024px) 620px, 100vw"
          className="object-cover"
        />
        <span className="absolute bottom-4 right-4 rounded-xl bg-white px-3 py-2 text-xs font-semibold text-navy">
          {selected + 1} / {photos.length}
        </span>
      </div>

      <div className="flex gap-3">
        {photos.map((photo, index) => {
          const isSelected = index === selected;

          return (
            <button
              key={photo}
              type="button"
              className={`h-21 w-28 shrink-0 cursor-pointer overflow-hidden rounded-xl ${
                isSelected ? "border-2 border-navy p-[3px]" : "border border-line"
              }`}
              aria-label={`Ver fotografia ${index + 1}`}
              aria-pressed={isSelected}
              onClick={() => setSelected(index)}
            >
              <span className="relative block size-full overflow-hidden rounded-lg">
                <Image
                  src={photo}
                  alt=""
                  fill
                  sizes="112px"
                  className="object-cover"
                />
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
