"use client";

import Image from "next/image";
import { useState } from "react";
import type { UseFormRegisterReturn } from "react-hook-form";
import FormField from "./formField";
import { inputClassName } from "./formStyles";

export default function PasswordField({
  id,
  label,
  help,
  error,
  autoComplete,
  registration,
}: {
  id: string;
  label: string;
  help?: string;
  error?: string;
  autoComplete: "current-password" | "new-password";
  registration: UseFormRegisterReturn;
}) {
  const [visible, setVisible] = useState<boolean>(false);

  return (
    <FormField id={id} label={label} help={help} error={error}>
      <div className="relative">
        <input
          id={id}
          type={visible ? "text" : "password"}
          autoComplete={autoComplete}
          aria-invalid={Boolean(error)}
          aria-describedby={error || help ? `${id}-message` : undefined}
          className={`${inputClassName(Boolean(error))} pr-12`}
          {...registration}
        />
        <button
          type="button"
          className="absolute right-3.5 top-1/2 -translate-y-1/2 cursor-pointer"
          aria-label={visible ? "Ocultar palavra-passe" : "Mostrar palavra-passe"}
          aria-pressed={visible}
          onClick={() => setVisible((value) => !value)}
        >
          <Image src="/assets/eye.svg" width={18} height={18} alt="" />
        </button>
      </div>
    </FormField>
  );
}
