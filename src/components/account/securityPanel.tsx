"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { savePassword } from "@/src/lib/account";
import { passwordSchema, type PasswordFormData } from "@/src/utils/profile";
import {
  primaryButtonClassName,
  secondaryButtonClassName,
} from "./formStyles";
import PasswordField from "./passwordField";
import StatusBanner, { type Status } from "./statusBanner";

export default function SecurityPanel() {
  const [status, setStatus] = useState<Status>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
  });

  async function onSubmit(data: PasswordFormData) {
    setStatus(null);

    try {
      await savePassword(data);
      reset();
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  function onCancel() {
    setStatus(null);
    reset();
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="flex flex-col gap-7"
    >
      <div className="flex flex-col gap-2">
        <h2 className="text-[22px] font-bold leading-[30px] text-on-teal">
          Segurança
        </h2>
        <p className="text-sm font-normal leading-6 text-muted">
          Escolhe uma palavra-passe que só uses na Ahoy.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        <PasswordField
          id="currentPassword"
          label="Palavra-passe atual"
          autoComplete="current-password"
          error={errors.currentPassword?.message}
          registration={register("currentPassword")}
        />

        <Link
          href="/forgot-password"
          className="w-fit text-[13px] font-normal text-navy underline"
        >
          Esqueceste-te da palavra-passe?
        </Link>

        <PasswordField
          id="newPassword"
          label="Nova palavra-passe"
          help="Usa pelo menos 8 caracteres, com letras e números."
          autoComplete="new-password"
          error={errors.newPassword?.message}
          registration={register("newPassword")}
        />

        <PasswordField
          id="confirmPassword"
          label="Confirmar nova palavra-passe"
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
          registration={register("confirmPassword")}
        />
      </div>

      <StatusBanner status={status} />

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className={primaryButtonClassName}
        >
          {isSubmitting ? "A guardar..." : "Alterar palavra-passe"}
        </button>
        <button
          type="button"
          className={secondaryButtonClassName}
          onClick={onCancel}
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
