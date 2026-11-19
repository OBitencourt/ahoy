import type { ReactNode } from "react";

/**
 * Etiqueta + campo + texto de ajuda (ou erro).
 * O campo deve ter `id` igual ao recebido aqui e `aria-describedby={`${id}-message`}`.
 */
export default function FormField({
  id,
  label,
  help,
  error,
  className = "",
  children,
}: {
  id: string;
  label: string;
  help?: string;
  error?: string;
  className?: string;
  children: ReactNode;
}) {
  const message = error ?? help;

  return (
    <div className={`flex min-w-0 flex-col gap-2 ${className}`}>
      <label htmlFor={id} className="text-sm font-semibold leading-5 text-ink">
        {label}
      </label>
      {children}
      {message && (
        <p
          id={`${id}-message`}
          className={`text-xs leading-5 ${error ? "text-danger" : "text-muted"}`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
