import Image from "next/image";
import Link from "next/link";
import type { User } from "@/src/lib/mocks/users";

const STARS = 5;

export default function OwnerCard({ owner }: { owner: User }) {
  const { id, name, avatar, rating, reviewCount } = owner;
  const [firstName] = name.split(" ");

  return (
    <section
      className="flex flex-col gap-4 border-y border-line py-6"
      aria-labelledby="partilhado-por"
    >
      <p
        id="partilhado-por"
        className="text-xs font-normal uppercase text-muted"
      >
        Partilhado por
      </p>

      <div className="flex items-center gap-3">
        <Image
          src={avatar}
          width={56}
          height={56}
          alt={`Fotografia de ${name}`}
          className="size-14 shrink-0 rounded-full object-cover"
        />
        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <p className="truncate text-base font-bold text-on-teal">{name}</p>
          <div className="flex items-center gap-1.5">
            <span className="flex text-lg leading-none" aria-hidden="true">
              {Array.from({ length: STARS }, (_, index) => (
                <span
                  key={index}
                  className={index < Math.round(rating) ? "text-star" : "text-line"}
                >
                  ★
                </span>
              ))}
            </span>
            <span className="text-xs font-semibold text-navy">
              {rating.toFixed(1).replace(".", ",")}/5 · {reviewCount}{" "}
              {reviewCount === 1 ? "avaliação" : "avaliações"}
            </span>
          </div>
        </div>
      </div>

      <Link
        href={`/utilizadores/${id}`}
        className="flex w-fit items-center gap-2 text-sm font-semibold text-navy"
      >
        <span className="underline">Ver perfil de {firstName}</span>
        <Image
          src="/assets/arrow-up-right.svg"
          width={16}
          height={16}
          alt=""
          className="shrink-0"
        />
      </Link>
    </section>
  );
}
