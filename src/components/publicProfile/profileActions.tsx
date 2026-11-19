"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export default function ProfileActions({ name }: { name: string }) {
  const [open, setOpen] = useState<boolean>(false);
  const container = useRef<HTMLDivElement>(null);

  // Fecha o menu com Esc ou ao clicar fora
  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    function onPointerDown(event: PointerEvent) {
      if (!container.current?.contains(event.target as Node)) setOpen(false);
    }

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  return (
    <div ref={container} className="relative flex w-full gap-2 lg:w-[248px] lg:justify-end">
      {/* TODO: ligar à página de mensagens quando existir */}
      <button
        type="button"
        className="flex h-12 cursor-pointer items-center gap-2 whitespace-nowrap rounded-xl bg-teal px-4 text-sm font-bold text-on-teal transition-opacity hover:opacity-90"
      >
        <Image
          src="/assets/message-circle.svg"
          width={18}
          height={18}
          alt=""
          className="shrink-0"
        />
        Enviar mensagem
      </button>

      <button
        type="button"
        aria-label={`Mais opções sobre ${name}`}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="flex h-12 w-11 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-line bg-white transition-colors hover:bg-sky"
      >
        <Image src="/assets/ellipsis.svg" width={20} height={20} alt="" />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-14 z-20 w-51 rounded-xl border border-line bg-white shadow-[0_4px_16px_rgba(8,43,58,0.05)]"
        >
          {/* TODO: abrir o fluxo de denúncia */}
          <button
            type="button"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="flex h-12 w-full cursor-pointer items-center gap-2.5 rounded-xl px-3.5 text-sm font-normal text-ink hover:bg-sky"
          >
            <Image
              src="/assets/flag.svg"
              width={16}
              height={16}
              alt=""
              className="shrink-0"
            />
            Denunciar perfil
          </button>
        </div>
      )}
    </div>
  );
}