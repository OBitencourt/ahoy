import Image from "next/image";
import Link from "next/link";

/** Navegação: 1440 × 88 no Figma (não usada na página Explorar) */
export default function Navigation() {
  return (
    <header className="flex h-[88px] items-center justify-between border-b border-line bg-white px-6 xl:px-[120px]">
      <Link href="/" className="flex items-center gap-2.5" aria-label="Ahoy">
        <Image
          src="/assets/logo.svg"
          width={54}
          height={48}
          alt=""
          className="h-[47.83px] w-[53.85px] shrink-0"
        />
        <span className="font-brand text-[30px] font-extrabold text-navy">
          Ahoy
        </span>
      </Link>

      <nav className="flex h-full items-center gap-8" aria-label="Principal">
        <Link
          href="/explorar"
          aria-current="page"
          className="relative flex h-full items-center text-sm font-bold text-navy after:absolute after:bottom-0 after:left-0 after:h-[3px] after:w-[61px] after:rounded-sm after:bg-teal after:content-['']"
        >
          Explorar
        </Link>
        <Link
          href="/pesquisar"
          className="flex items-center gap-2 text-sm font-medium text-muted"
        >
          <Image src="/assets/search.svg" width={20} height={20} alt="" />
          <span>Pesquisar</span>
        </Link>
        <Link
          href="/mensagens"
          className="flex items-center gap-2 text-sm font-medium text-ink"
        >
          <Image src="/assets/message-circle.svg" width={20} height={20} alt="" />
          <span>Mensagens</span>
        </Link>
      </nav>

      <div className="flex items-center gap-6">
        <Link
          href="/publicar"
          className="flex h-11 items-center gap-2 whitespace-nowrap rounded-xl bg-teal px-5 text-sm font-bold text-on-teal"
        >
          <Image src="/assets/plus.svg" width={20} height={20} alt="" />
          <span>Publicar</span>
        </Link>
        <button
          type="button"
          className="flex cursor-pointer items-center gap-2"
          aria-label="Menu da conta"
          aria-haspopup="menu"
        >
          <Image
            src="/assets/profile.png"
            width={40}
            height={40}
            alt="Fotografia de perfil"
            className="size-10 rounded-full object-cover"
          />
          <Image src="/assets/chevron-down.svg" width={16} height={16} alt="" />
        </button>
      </div>
    </header>
  );
}
