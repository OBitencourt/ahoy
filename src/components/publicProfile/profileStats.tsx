import Image from "next/image";
import type { User } from "@/src/lib/users";

const ratingFormat = new Intl.NumberFormat("pt-PT", { maximumFractionDigits: 1 });

export default function ProfileStats({
  user,
  publishedCount,
}: {
  user: User;
  publishedCount: number;
}) {
  const { completedShares, rating } = user;

  const stats = [
    {
      icon: "/assets/package.svg",
      value: String(publishedCount),
      label: publishedCount === 1 ? "objeto publicado" : "objetos publicados",
    },
    {
      icon: "/assets/repeat-2.svg",
      value: String(completedShares),
      label: completedShares === 1 ? "partilha concluída" : "partilhas concluídas",
    },
    {
      icon: "/assets/star.svg",
      value: `${ratingFormat.format(rating)}/5`,
      label: "avaliação média",
    },
  ];

  return (
    <dl className="m-0 flex flex-wrap items-center gap-x-10 gap-y-4 border-y border-line py-5">
      {stats.map(({ icon, value, label }) => (
        <div key={label} className="flex items-center gap-2">
          <Image src={icon} width={18} height={18} alt="" className="shrink-0" />
          <dt className="sr-only">{label}</dt>
          <dd className="m-0 text-base font-bold text-navy">{value}</dd>
          <span aria-hidden="true" className="text-sm font-normal text-muted">
            {label}
          </span>
        </div>
      ))}
    </dl>
  );
}