import Image from "next/image";
import Link from "next/link";
import { headers } from "next/headers";
import { Suspense } from "react";
import { auth } from "@/src/lib/auth";
import NavLinks from "@/src/components/header/navLinks";

// Lê a sessão no servidor: foto de perfil (ex.: Google) ou "Entrar" se não houver sessão
async function AccountArea() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    return (
      <Link
        href="/login"
        className="flex h-11 items-center whitespace-nowrap rounded-xl border border-line bg-white px-5 text-sm font-bold text-on-teal transition-colors hover:bg-sky"
      >
        Entrar
      </Link>
    );
  }

  const { name, image } = session.user;
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <Link
      href="/perfil"
      className="flex cursor-pointer items-center gap-2"
      aria-label="Menu da conta"
    >
      {image ? (
        <Image
          src={image}
          width={40}
          height={40}
          alt={`Fotografia de perfil de ${name}`}
          className="size-10 rounded-full object-cover"
        />
      ) : (
        <span
          aria-hidden="true"
          className="flex size-10 items-center justify-center rounded-full bg-sky text-sm font-bold text-navy"
        >
          {initials}
        </span>
      )}
      <Image src="/assets/chevron-down.svg" width={16} height={16} alt="" />
    </Link>
  );
}

export default function Navigation() {
  return (
    <header className="flex h-22 items-center justify-between border-b border-line bg-white px-6 xl:px-30">
      <Link href="/" className="flex items-center gap-2.5" aria-label="Ahoy">
        <Image
          src="/assets/logo.svg"
          width={54}
          height={48}
          alt=""
          className="h-[47.83px] w-[53.85px] shrink-0"
        />
        <span className="font-brand text-[30px] font-extrabold text-navy">Ahoy</span>
      </Link>

      <NavLinks />

      <div className="flex items-center gap-6">
        <Link
          href="/publicar"
          className="flex h-11 items-center gap-2 whitespace-nowrap rounded-xl bg-teal px-5 text-sm font-bold text-on-teal"
        >
          <Image src="/assets/plus.svg" width={20} height={20} alt="" />
          <span>Publicar</span>
        </Link>

        <Suspense fallback={<div className="size-10 animate-pulse rounded-full bg-sky" />}>
          <AccountArea />
        </Suspense>
      </div>
    </header>
  );
}