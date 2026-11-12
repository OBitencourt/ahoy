import Image from "next/image";
import type { ObjectListing } from "@/src/lib/objects";
import type { User } from "@/src/lib/users";
import FavoriteButton from "./favoriteButton";
import ListingBadge from "./listingBadge";
import OwnerCard from "./ownerCard";
import { getListingCopy } from "./listing-copy";

export default function ProductSummary({
  object,
  owner,
}: {
  object: ObjectListing;
  owner: User;
}) {
  const { type, title, category, state, city, pricePerDay, condition, saved } =
    object;
  const [ownerFirstName] = owner.name.split(" ");
  const { requestLabel, availability, requestNote } = getListingCopy(
    object,
    ownerFirstName,
  );

  return (
    <div className="flex min-w-0 flex-1 flex-col gap-6">
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <ListingBadge type={type} />
          <FavoriteButton saved={saved} />
        </div>
        <h1 className="text-[36px] font-bold leading-[44px] text-on-teal">
          {title}
        </h1>
        <p className="text-sm font-normal leading-[22px] text-muted">
          {category} · {state}
        </p>
        <p className="flex items-center gap-1.5 text-sm font-normal text-ink">
          <Image
            src="/assets/map-pin.svg"
            width={18}
            height={18}
            alt=""
            className="shrink-0"
          />
          {city}, Portugal
        </p>
      </div>

      <div className="flex flex-col gap-3.5">
        {pricePerDay !== undefined ? (
          <p className="flex items-baseline gap-1.5">
            <span className="text-[32px] font-bold text-navy">
              {pricePerDay} €
            </span>
            <span className="text-base font-normal text-muted">/ dia</span>
          </p>
        ) : (
          <p className="flex items-baseline gap-1.5">
            <span className="text-[32px] font-bold text-navy">Grátis</span>
            <span className="text-base font-normal text-muted">{condition}</span>
          </p>
        )}

        <div className="flex flex-col gap-1.5 rounded-xl bg-mint p-4">
          <p className="flex items-center gap-2 text-sm font-bold text-navy">
            <span
              className="size-[7px] shrink-0 rounded-full bg-teal"
              aria-hidden="true"
            />
            Disponível para pedidos
          </p>
          <p className="text-sm font-normal leading-[22px] text-muted">
            {availability}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <button
          type="button"
          className="flex h-12 w-full cursor-pointer items-center justify-center rounded-xl bg-teal px-5 text-sm font-bold text-on-teal transition-opacity hover:opacity-90"
        >
          {requestLabel}
        </button>
        <button
          type="button"
          className="flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-line bg-white px-5 text-sm font-bold text-on-teal transition-colors hover:bg-sky"
        >
          <Image
            src="/assets/message-circle.svg"
            width={20}
            height={20}
            alt=""
            className="shrink-0"
          />
          Enviar mensagem
        </button>
        <p className="text-center text-xs font-normal leading-5 text-muted">
          {requestNote}
        </p>
      </div>

      <OwnerCard owner={owner} />
    </div>
  );
}
