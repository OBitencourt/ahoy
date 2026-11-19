import Image from "next/image";
import Link from "next/link";
import type { User } from "@/src/lib/users";
import ProfileActions from "./profileActions";
import StarRating from "./starRating";

const ratingFormat = new Intl.NumberFormat("pt-PT", { maximumFractionDigits: 1 });

function formatMemberSince(date: string) {
  return new Intl.DateTimeFormat("pt-PT", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(date));
}

export default function ProfileHeader({ user }: { user: User }) {
  const { name, username, location, bio, avatar, rating, reviewCount, memberSince } =
    user;

  return (
    <div className="flex flex-col gap-7">
      <Link
        href="/"
        className="flex w-fit items-center gap-2 text-sm font-normal text-muted hover:underline"
      >
        <Image
          src="/assets/arrow-left.svg"
          width={16}
          height={16}
          alt=""
          className="shrink-0"
        />
        Voltar a explorar
      </Link>

      <div className="flex flex-wrap items-start gap-8">
        <Image
          src={avatar}
          width={160}
          height={160}
          alt={`Fotografia de ${name}`}
          className="size-40 shrink-0 rounded-full object-cover"
        />

        <div className="flex min-w-[300px] flex-1 flex-col gap-3">
          <div className="flex flex-col gap-1">
            <h1 className="text-[32px] font-bold leading-10 text-on-teal">{name}</h1>
            <p className="text-base font-normal text-muted">@{username}</p>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm font-normal">
            <p className="flex items-center gap-1.5 text-ink">
              <Image
                src="/assets/map-pin.svg"
                width={16}
                height={16}
                alt=""
                className="shrink-0"
              />
              {location}
            </p>
            <p className="text-muted">
              Membro desde {formatMemberSince(memberSince)}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <StarRating rating={rating} />
            <p className="text-sm font-semibold text-navy">
              {ratingFormat.format(rating)}/5 · {reviewCount}{" "}
              {reviewCount === 1 ? "avaliação" : "avaliações"}
            </p>
          </div>

          <p className="text-base font-normal leading-[26px] text-ink">{bio}</p>
        </div>

        <ProfileActions name={name} />
      </div>
    </div>
  );
}