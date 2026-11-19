"use client";

import Image from "next/image";
import { useRef, useState, type ChangeEvent } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { saveProfile } from "@/src/lib/account";
import type { User } from "@/src/lib/users";
import { profileSchema, type ProfileFormData } from "@/src/utils/profile";
import FormField from "./formField";
import {
  inputClassName,
  primaryButtonClassName,
  secondaryButtonClassName,
  textareaClassName,
} from "./formStyles";
import StatusBanner, { type Status } from "./statusBanner";

const MAX_PHOTO_SIZE = 5 * 1024 * 1024; // 5 MB
const PHOTO_TYPES = ["image/jpeg", "image/png"];

export default function PersonalInfoPanel({ user }: { user: User }) {
  const { name, username, email, location, bio, avatar } = user;

  const [status, setStatus] = useState<Status>(null);
  const [savedPhoto, setSavedPhoto] = useState<string>(avatar);
  const [photo, setPhoto] = useState<string>(avatar);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name, username, email, location, bio },
  });

  // Pré-visualizações (blob:) que não foram guardadas têm de ser libertadas
  function discardPhotoPreview() {
    if (photo !== savedPhoto) URL.revokeObjectURL(photo);
  }

  function onPhotoChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = ""; // permite voltar a escolher o mesmo ficheiro
    if (!file) return;

    if (!PHOTO_TYPES.includes(file.type) || file.size > MAX_PHOTO_SIZE) {
      setPhotoError("Escolhe uma imagem JPG ou PNG até 5 MB.");
      return;
    }

    setPhotoError(null);
    discardPhotoPreview();
    setPhoto(URL.createObjectURL(file));
    setPhotoFile(file);
  }

  async function onSubmit(data: ProfileFormData) {
    setStatus(null);

    try {
      await saveProfile(data, photoFile);
      reset(data); // os valores guardados passam a ser o ponto de partida do "Cancelar"
      setSavedPhoto(photo);
      setPhotoFile(null);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  function onCancel() {
    discardPhotoPreview();
    setPhoto(savedPhoto);
    setPhotoFile(null);
    setPhotoError(null);
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
          Informações pessoais
        </h2>
        <p className="text-sm font-normal leading-6 text-muted">
          Dá-te a conhecer à comunidade e mantém os teus dados atualizados.
        </p>
      </div>

      <div className="flex items-center gap-6 border-y border-line py-6">
        <Image
          src={photo}
          width={96}
          height={96}
          alt={`Fotografia de ${name}`}
          className="size-24 shrink-0 rounded-full object-cover"
        />
        <div className="flex min-w-0 flex-1 flex-col items-start gap-2.5">
          <button
            type="button"
            className={secondaryButtonClassName}
            onClick={() => fileInput.current?.click()}
          >
            Alterar fotografia
          </button>
          <input
            ref={fileInput}
            type="file"
            accept="image/jpeg,image/png"
            className="hidden"
            aria-label="Escolher fotografia de perfil"
            onChange={onPhotoChange}
          />
          <p
            role={photoError ? "alert" : undefined}
            className={`text-xs font-normal leading-5 ${
              photoError ? "text-danger" : "text-muted"
            }`}
          >
            {photoError ?? "JPG ou PNG, até 5 MB."}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-start">
          <FormField
            id="name"
            label="Nome"
            error={errors.name?.message}
            className="flex-1"
          >
            <input
              id="name"
              type="text"
              autoComplete="name"
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? "name-message" : undefined}
              className={inputClassName(Boolean(errors.name))}
              {...register("name")}
            />
          </FormField>

          <FormField
            id="username"
            label="Nome de utilizador"
            help={`O teu perfil: @${watch("username")}`}
            error={errors.username?.message}
            className="flex-1"
          >
            <input
              id="username"
              type="text"
              autoComplete="username"
              aria-invalid={Boolean(errors.username)}
              aria-describedby="username-message"
              className={inputClassName(Boolean(errors.username))}
              {...register("username")}
            />
          </FormField>
        </div>

        <FormField
          id="email"
          label="Email"
          help="O teu email não é apresentado no perfil público."
          error={errors.email?.message}
        >
          <input
            id="email"
            type="email"
            autoComplete="email"
            aria-invalid={Boolean(errors.email)}
            aria-describedby="email-message"
            className={inputClassName(Boolean(errors.email))}
            {...register("email")}
          />
        </FormField>

        <FormField
          id="location"
          label="Localização"
          help="Indica apenas a cidade ou zona, não a tua morada."
          error={errors.location?.message}
        >
          <input
            id="location"
            type="text"
            autoComplete="off"
            aria-invalid={Boolean(errors.location)}
            aria-describedby="location-message"
            className={inputClassName(Boolean(errors.location))}
            {...register("location")}
          />
        </FormField>

        <FormField
          id="bio"
          label="Biografia"
          help="Conta um pouco sobre ti. Máximo de 300 caracteres."
          error={errors.bio?.message}
        >
          <textarea
            id="bio"
            rows={4}
            aria-invalid={Boolean(errors.bio)}
            aria-describedby="bio-message"
            className={textareaClassName(Boolean(errors.bio))}
            {...register("bio")}
          />
        </FormField>
      </div>

      <div className="flex items-start gap-2.5 rounded-xl bg-cream p-4">
        <Image
          src="/assets/info.svg"
          width={18}
          height={18}
          alt=""
          className="shrink-0"
        />
        <p className="min-w-0 flex-1 text-xs font-normal leading-[21px] text-muted">
          O nome, a fotografia, a localização e a biografia são públicos. O email
          fica só na tua conta.
        </p>
      </div>

      <StatusBanner status={status} />

      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          className={secondaryButtonClassName}
          onClick={onCancel}
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className={primaryButtonClassName}
        >
          {isSubmitting ? "A guardar..." : "Guardar alterações"}
        </button>
      </div>
    </form>
  );
}
