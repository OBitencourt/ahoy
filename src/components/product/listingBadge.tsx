import Image from "next/image";
import { listingLabels, type ListingType } from "@/src/lib/mocks/objects";
import { badgeColors, badgeIcons } from "@/src/utils/artifactDetails";

export default function ListingBadge({ type }: { type: ListingType }) {
  return (
    <span
      className={`inline-flex items-center gap-1 whitespace-nowrap rounded-md px-2 py-1 text-xs font-semibold leading-4 text-navy ${badgeColors[type]}`}
    >
      <Image
        src={badgeIcons[type]}
        width={14}
        height={14}
        alt=""
        className="shrink-0"
      />
      {listingLabels[type]}
    </span>
  );
}
