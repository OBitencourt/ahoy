import Image from "next/image";
import type { ObjectListing } from "@/src/lib/mocks/objects";
import type { User } from "@/src/lib/mocks/users";
import { getListingCopy } from "./listing-copy";

export default function ProductDescription({
  object,
  owner,
}: {
  object: ObjectListing;
  owner: User;
}) {
  const { headline, description, includes } = object;
  const [ownerFirstName] = owner.name.split(" ");
  const { conditionsTitle, conditions } = getListingCopy(object, ownerFirstName);

  return (
    <div className="flex flex-col gap-7">
      <div className="flex flex-col gap-3">
        <h2 className="text-[22px] font-bold leading-[30px] text-on-teal">
          {headline}
        </h2>
        <p className="text-base font-normal leading-[26px] text-ink">
          {description}
        </p>
        <p className="text-sm font-normal leading-6 text-muted">{includes}</p>
      </div>

      <section
        className="flex flex-col gap-4 rounded-2xl bg-cream p-6"
        aria-labelledby="condicoes-titulo"
      >
        <h3 id="condicoes-titulo" className="text-lg font-bold text-on-teal">
          {conditionsTitle}
        </h3>

        <ul className="flex flex-col gap-4">
          {conditions.map(({ icon, title, description: text }) => (
            <li key={title} className="flex items-start gap-3">
              <Image
                src={icon}
                width={20}
                height={20}
                alt=""
                className="shrink-0"
              />
              <div className="flex min-w-0 flex-1 flex-col gap-1 text-sm leading-[22px]">
                <p className="font-bold text-ink">{title}</p>
                <p className="font-normal text-muted">{text}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
