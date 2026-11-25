import type { ButtonHTMLAttributes } from "react";

type ChipProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  selected?: boolean;
};

/** Filtro: 44px de altura, raio 12px */
export default function Chip({
  selected = false,
  className = "",
  type = "button",
  ...props
}: ChipProps) {
  const state = selected
    ? "border-teal bg-mint font-semibold"
    : "border-line bg-white font-medium";

  return (
    <button
      type={type}
      className={`inline-flex h-11 shrink-0 cursor-pointer items-center gap-2 whitespace-nowrap rounded-xl border px-4 text-sm text-ink [&_img]:shrink-0 ${state} ${className}`}
      {...props}
    />
  );
}
