"use client";

import Image from "next/image";
import { useState } from "react";

const pages: (number | "…")[] = [1, 2, 3, "…", 6];

const pageBase =
  "flex size-11 items-center justify-center rounded-xl border text-sm text-navy";

export default function Pagination({
  shown,
  total,
}: {
  shown: number;
  total: number;
}) {
  const [current, setCurrent] = useState(1);

  return (
    <div className="flex items-center justify-between py-2">
      <p className="text-sm font-normal text-muted">
        A mostrar {shown} de {total} objetos
      </p>

      <nav className="flex items-center gap-2" aria-label="Paginação">
        {pages.map((page, index) =>
          page === "…" ? (
            <span
              key={`gap-${index}`}
              className={`${pageBase} border-transparent bg-white font-medium`}
            >
              …
            </span>
          ) : (
            <button
              key={page}
              type="button"
              className={`${pageBase} cursor-pointer ${
                current === page
                  ? "border-teal bg-mint font-bold"
                  : "border-transparent bg-white font-medium"
              }`}
              aria-current={current === page ? "page" : undefined}
              onClick={() => setCurrent(page)}
            >
              {page}
            </button>
          ),
        )}
        <button
          type="button"
          className="flex h-11 cursor-pointer items-center gap-2 pl-3 text-sm font-semibold text-navy"
        >
          Seguinte
          <Image
            src="/assets/arrow-right.svg"
            width={18}
            height={18}
            alt=""
            className="shrink-0"
          />
        </button>
      </nav>
    </div>
  );
}
