const fieldBase =
  "w-full rounded-xl border bg-white px-3.5 py-3 text-sm leading-6 text-ink outline-none placeholder:text-muted";

function fieldState(hasError: boolean) {
  // O foco e o erro desenham 2px (borda + anel) sem mexer no tamanho do campo
  return hasError
    ? "border-danger ring-1 ring-danger"
    : "border-line focus:border-navy focus:ring-1 focus:ring-navy";
}

/** Campo de uma linha: 48px de altura, raio 12px. */
export function inputClassName(hasError: boolean) {
  return `${fieldBase} h-12 ${fieldState(hasError)}`;
}

/** Área de texto: mínimo de 120px. */
export function textareaClassName(hasError: boolean) {
  return `${fieldBase} min-h-30 resize-y ${fieldState(hasError)}`;
}

const buttonBase =
  "flex h-12 cursor-pointer items-center justify-center whitespace-nowrap rounded-xl px-5 text-sm font-bold text-on-teal";

export const primaryButtonClassName = `${buttonBase} bg-teal transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50`;

export const secondaryButtonClassName = `${buttonBase} border border-line bg-white transition-colors hover:bg-sky`;
