import Image from "next/image";

export type Status = "success" | "error" | null;

export default function StatusBanner({ status }: { status: Status }) {
  if (status === "success") {
    return (
      <div role="status" className="flex items-start gap-3 rounded-xl bg-mint p-5">
        <Image
          src="/assets/circle-check.svg"
          width={20}
          height={20}
          alt=""
          className="shrink-0"
        />
        <p className="min-w-0 flex-1 text-sm font-normal leading-[22px] text-navy">
          As tuas alterações foram guardadas.
        </p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div
        role="alert"
        className="flex items-start gap-3 rounded-xl bg-danger-soft p-5"
      >
        <Image
          src="/assets/circle-alert.svg"
          width={20}
          height={20}
          alt=""
          className="shrink-0"
        />
        <div className="flex min-w-0 flex-1 flex-col gap-1 text-sm">
          <p className="font-bold text-danger">
            Não foi possível guardar as alterações.
          </p>
          <p className="font-normal leading-[22px] text-ink">
            Os dados continuam aqui. Tenta novamente.
          </p>
        </div>
      </div>
    );
  }

  return null;
}
