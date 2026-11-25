"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/explorar", label: "Explorar", icon: null },
  { href: "/pesquisar", label: "Pesquisar", icon: "/assets/search.svg" },
  { href: "/mensagens", label: "Mensagens", icon: "/assets/message-circle.svg" },
];

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <nav className="flex h-full items-center gap-8" aria-label="Principal">
      {links.map(({ href, label, icon }) => {
        // Ativo na própria rota e nas sub-rotas (ex.: /explorar/categoria)
        const active = pathname === href || pathname.startsWith(`${href}/`);

        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={`relative flex h-full items-center gap-2 text-sm ${
              active
                ? "font-bold text-navy after:absolute after:bottom-0 after:left-0 after:h-0.75 after:w-full after:rounded-sm after:bg-teal after:content-['']"
                : "font-medium text-muted hover:text-navy"
            }`}
          >
            {icon && <Image src={icon} width={20} height={20} alt="" />}
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}