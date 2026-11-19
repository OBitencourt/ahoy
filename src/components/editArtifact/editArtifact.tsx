"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type DragEvent, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { listingLabels, type ListingType, type ObjectListing } from "@/src/lib/mocks/objects";
import { badgeColors, badgeIcons, categories, conditions, modalities, priceUnits } from "@/src/utils/artifactDetails";


const MAX_PHOTO_SIZE = 10 * 1024 * 1024; // 10 MB
const PHOTO_TYPES = ["image/jpeg", "image/png", "image/webp"];

const schema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "Indica o nome do artefacto.")
      .max(80, "O nome pode ter no máximo 80 caracteres."),
    description: z
      .string()
      .trim()
      .min(1, "Descreve o objeto.")
      .max(1000, "A descrição pode ter no máximo 1000 caracteres."),
    category: z.string().min(1, "Escolhe uma categoria."),
    condition: z.string().min(1, "Escolhe o estado do objeto."),
    type: z.enum(["doacao", "emprestimo", "aluguer"]),
    price: z.string(),
    priceUnit: z.enum(["dia", "semana", "mes"]),
    loanPeriod: z.string().max(60, "Usa no máximo 60 caracteres."),
    location: z.string().trim().min(1, "Indica a localização."),
    availability: z.enum(["disponivel", "indisponivel"]),
  })
  .superRefine((data, ctx) => {
    if (data.type !== "aluguer") return;

    const price = Number(data.price.replace(",", "."));

    if (!data.price.trim() || !Number.isFinite(price) || price <= 0) {
      ctx.addIssue({
        code: "custom",
        path: ["price"],
        message: "Introduz um preço superior a 0 € para o aluguer.",
      });
    }
  });

type FormData = z.infer<typeof schema>;

type Photo = { id: string; src: string };

type SaveStatus = "idle" | "saving" | "success" | "error";

// MOCK: simula o pedido ao servidor. Trocar pela chamada real; se lançar erro,
// aparece o aviso "Não foi possível guardar".
async function saveArtifact(data: FormData, photos: Photo[]): Promise<void> {
  void data;
  void photos;
  await new Promise<void>((resolve) => setTimeout(resolve, 800));
}

const secondaryButtonClassName =
  "flex min-h-12 cursor-pointer items-center justify-center whitespace-nowrap rounded-xl border border-line bg-white px-5 py-3 text-sm font-bold leading-6 text-on-teal transition-colors hover:bg-sky";

const primaryButtonClassName =
  "flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-teal px-5 py-3 text-sm font-bold leading-6 text-on-teal transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70";

function inputClassName(hasError: boolean) {
  return `min-h-12 w-full rounded-xl border bg-white px-3.5 py-3 text-sm leading-6 text-ink outline-none ${
    hasError
      ? "border-danger ring-1 ring-danger"
      : "border-line focus:border-navy focus:ring-1 focus:ring-navy"
  }`;
}

function Field({
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

function withCurrent(options: string[], current: string) {
  return current && !options.includes(current) ? [current, ...options] : options;
}

export default function EditArtifact({
  object,
  available,
}: {
  object: ObjectListing;
  available: boolean;
}) {
  const router = useRouter();

  const initialPhotos: Photo[] = [object.photo, ...object.extraPhotos].map((src, index) => ({
    id: `photo-${index}`,
    src,
  }));

  const [photos, setPhotos] = useState<Photo[]>(initialPhotos);
  const [savedPhotoIds, setSavedPhotoIds] = useState<string[]>(initialPhotos.map(({ id }) => id));
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [draggingFiles, setDraggingFiles] = useState<boolean>(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [status, setStatus] = useState<SaveStatus>("idle");
  const [confirmingExit, setConfirmingExit] = useState<boolean>(false);
  const photosRef = useRef<Photo[]>(photos);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isDirty },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: object.title,
      description: object.description,
      category: object.category,
      condition: object.state,
      type: object.type,
      price: object.pricePerDay !== undefined ? String(object.pricePerDay) : "",
      priceUnit: "dia",
      loanPeriod: object.type === "emprestimo" ? (object.condition.match(/\d+\s*dias?/)?.[0] ?? "") : "",
      location: `${object.city}, Portugal`,
      availability: available ? "disponivel" : "indisponivel",
    },
  });

  const values = watch();
  const photosChanged =
    photos.length !== savedPhotoIds.length || photos.some(({ id }, index) => id !== savedPhotoIds[index]);
  const hasChanges = isDirty || photosChanged;

  // Mantém uma referência atual das fotografias para libertar as pré-visualizações ao sair
  useEffect(() => {
    photosRef.current = photos;
  }, [photos]);

  useEffect(
    () => () => {
      photosRef.current.forEach(({ src }) => {
        if (src.startsWith("blob:")) URL.revokeObjectURL(src);
      });
    },
    [],
  );

  // Avisa o browser quando se tenta fechar o separador com alterações por guardar
  useEffect(() => {
    if (!hasChanges) return;

    function onBeforeUnload(event: BeforeUnloadEvent) {
      event.preventDefault();
    }

    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [hasChanges]);

  useEffect(() => {
    if (!confirmingExit) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setConfirmingExit(false);
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [confirmingExit]);

  // Depois de guardar, voltar a editar tira o aviso de sucesso
  useEffect(() => {
    if (hasChanges && status === "success") setStatus("idle");
  }, [hasChanges, status]);

  function addFiles(files: File[]) {
    const valid = files.filter(
      (file) => PHOTO_TYPES.includes(file.type) && file.size <= MAX_PHOTO_SIZE,
    );

    setPhotoError(
      valid.length < files.length
        ? "Alguns ficheiros foram ignorados. Usa JPG, PNG ou WEBP até 10 MB."
        : null,
    );

    if (valid.length === 0) return;

    setPhotos((current) => [
      ...current,
      ...valid.map((file, index) => ({
        id: `new-${Date.now()}-${index}`,
        src: URL.createObjectURL(file),
      })),
    ]);
  }

  function removePhoto(id: string) {
    setPhotos((current) => {
      const removed = current.find((photo) => photo.id === id);
      if (removed?.src.startsWith("blob:")) URL.revokeObjectURL(removed.src);
      return current.filter((photo) => photo.id !== id);
    });
  }

  function movePhoto(from: number, to: number) {
    if (to < 0 || to >= photos.length || from === to) return;

    setPhotos((current) => {
      const next = [...current];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
  }

  function onDropFiles(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    setDraggingFiles(false);
    addFiles(Array.from(event.dataTransfer.files));
  }

  async function onSubmit(data: FormData) {
    setStatus("saving");

    try {
      await saveArtifact(data, photos);
      reset(data); // os valores guardados passam a ser o ponto de partida
      setSavedPhotoIds(photos.map(({ id }) => id));
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  function onCancel() {
    if (hasChanges) {
      setConfirmingExit(true);
    } else {
      router.push("/meus-artefactos");
    }
  }

  // --- Pré-visualização ---
  const { type, priceUnit, availability } = values;
  const unit = priceUnits.find(({ id }) => id === priceUnit) ?? priceUnits[0];
  const previewPrice = values.price.trim();
  const previewCost =
    type === "aluguer"
      ? { price: `${previewPrice || "0"} €/${unit.short}`, text: `Preço ${unit.label.toLowerCase()}` }
      : {
          price: "Grátis",
          text:
            type === "emprestimo"
              ? values.loanPeriod.trim() || "Período a combinar"
              : "Pedir para receber",
        };
  const previewTitle = values.name.trim() || "Nome do artefacto";
  const previewSubtitle = [values.category, values.condition].filter(Boolean).join(" · ");
  const previewLocation = values.location.trim();

  const errorKeys = Object.keys(errors);
  const validationMessage =
    errorKeys.length === 1 && errorKeys[0] === "price"
      ? "Revê o preço antes de guardar as alterações."
      : "Revê os campos assinalados antes de guardar as alterações.";

  return (
    <>
      <div className="flex flex-wrap items-center gap-6">
        <div className="flex min-w-0 flex-1 basis-72 flex-col gap-2">
          <h1 className="text-[32px] font-bold leading-10 text-on-teal">Editar artefacto</h1>
          <p className="text-base font-normal leading-6 text-muted">
            Atualiza as informações do teu objeto.
          </p>
        </div>
        <button type="button" onClick={onCancel} className={secondaryButtonClassName}>
          Cancelar
        </button>
      </div>

      <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,1fr)_352px]">
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="flex min-w-0 flex-col gap-8 lg:max-w-[800px]"
        >
          {/* Fotografias */}
          <section className="flex flex-col gap-4" aria-labelledby="fotografias-titulo">
            <div className="flex flex-col gap-1.5">
              <h2 id="fotografias-titulo" className="text-[22px] font-bold leading-[30px] text-on-teal">
                Fotografias
              </h2>
              <p className="text-sm font-normal leading-[22px] text-muted">
                A primeira fotografia é a imagem principal do anúncio.
              </p>
            </div>

            {photos.length > 0 && (
              <ul className="m-0 grid list-none grid-cols-2 gap-3 p-0 sm:grid-cols-3">
                {photos.map(({ id, src }, index) => (
                  <li
                    key={id}
                    draggable
                    onDragStart={() => setDraggedIndex(index)}
                    onDragOver={(event) => {
                      if (draggedIndex !== null) event.preventDefault();
                    }}
                    onDrop={() => {
                      if (draggedIndex !== null) movePhoto(draggedIndex, index);
                      setDraggedIndex(null);
                    }}
                    onDragEnd={() => setDraggedIndex(null)}
                    className="relative h-43 overflow-hidden rounded-xl bg-sky"
                  >
                    <Image
                      src={src}
                      alt={`Fotografia ${index + 1} de ${object.title}`}
                      fill
                      sizes="(min-width: 1024px) 259px, 50vw"
                      unoptimized={src.startsWith("blob:")}
                      draggable={false}
                      className="object-cover"
                    />
                    <span
                      aria-hidden="true"
                      className={`pointer-events-none absolute inset-0 rounded-xl ${
                        index === 0 ? "border-2 border-teal" : "border border-line"
                      }`}
                    />
                    <button
                      type="button"
                      aria-label={`Remover fotografia ${index + 1}`}
                      onClick={() => removePhoto(id)}
                      className="absolute right-2 top-2 flex size-8 cursor-pointer items-center justify-center rounded-full bg-white"
                    >
                      <Image src="/assets/x.svg" width={16} height={16} alt="" />
                    </button>
                    <button
                      type="button"
                      aria-label={`Reordenar fotografia ${index + 1}. Usa as setas para a esquerda e para a direita.`}
                      onKeyDown={(event) => {
                        if (event.key === "ArrowLeft") {
                          event.preventDefault();
                          movePhoto(index, index - 1);
                        }
                        if (event.key === "ArrowRight") {
                          event.preventDefault();
                          movePhoto(index, index + 1);
                        }
                      }}
                      className="absolute bottom-2 left-2 flex size-7 cursor-grab items-center justify-center rounded-md bg-white"
                    >
                      <Image src="/assets/grip-vertical.svg" width={16} height={16} alt="" />
                    </button>
                    {index === 0 && (
                      <span className="absolute bottom-2 left-11 rounded-md bg-white px-2 py-[5px] text-[11px] font-bold leading-[18px] text-navy">
                        Principal
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            )}

            <p className="text-xs font-normal leading-5 text-muted">
              Usa a pega para reordenar as fotografias.
            </p>

            <label
              onDragOver={(event) => {
                if (draggedIndex === null) {
                  event.preventDefault();
                  setDraggingFiles(true);
                }
              }}
              onDragLeave={() => setDraggingFiles(false)}
              onDrop={onDropFiles}
              className={`flex min-h-28 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-dashed p-5 text-center has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-navy ${
                draggingFiles ? "border-2 border-teal bg-mint" : "border border-line bg-white"
              }`}
            >
              <input
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp"
                className="sr-only"
                onChange={(event) => {
                  addFiles(Array.from(event.target.files ?? []));
                  event.target.value = ""; // permite escolher o mesmo ficheiro outra vez
                }}
              />
              <span className="flex items-center gap-2 text-sm font-bold text-navy">
                <Image src="/assets/upload.svg" width={20} height={20} alt="" />
                {draggingFiles ? "Larga as fotografias aqui" : "Adicionar fotografias"}
              </span>
              <span className="text-xs font-normal leading-5 text-muted">
                JPG, PNG ou WEBP · até 10 MB por fotografia
              </span>
            </label>
            {photoError && (
              <p role="alert" className="text-xs leading-5 text-danger">
                {photoError}
              </p>
            )}
          </section>

          {/* Informações básicas */}
          <section
            className="flex flex-col gap-6 border-t border-line pt-8"
            aria-labelledby="informacoes-titulo"
          >
            <h2 id="informacoes-titulo" className="text-[22px] font-bold leading-[30px] text-on-teal">
              Informações básicas
            </h2>

            <Field id="name" label="Nome do artefacto" error={errors.name?.message}>
              <input
                id="name"
                type="text"
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? "name-message" : undefined}
                className={inputClassName(Boolean(errors.name))}
                {...register("name")}
              />
            </Field>

            <Field
              id="description"
              label="Descrição"
              help="Descreve o objeto e indica o que está incluído."
              error={errors.description?.message}
            >
              <textarea
                id="description"
                rows={5}
                aria-invalid={Boolean(errors.description)}
                aria-describedby="description-message"
                className={`${inputClassName(Boolean(errors.description))} min-h-32 resize-y`}
                {...register("description")}
              />
            </Field>

            <div className="flex flex-col gap-6 sm:flex-row">
              <Field id="category" label="Categoria" error={errors.category?.message} className="flex-1">
                <div className="relative">
                  <select
                    id="category"
                    aria-invalid={Boolean(errors.category)}
                    aria-describedby={errors.category ? "category-message" : undefined}
                    className={`${inputClassName(Boolean(errors.category))} cursor-pointer appearance-none pr-10`}
                    {...register("category")}
                  >
                    {withCurrent(categories, object.category).map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  <Image
                    src="/assets/chevron-down.svg"
                    width={16}
                    height={16}
                    alt=""
                    className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2"
                  />
                </div>
              </Field>

              <Field id="condition" label="Estado do objeto" error={errors.condition?.message} className="flex-1">
                <div className="relative">
                  <select
                    id="condition"
                    aria-invalid={Boolean(errors.condition)}
                    aria-describedby={errors.condition ? "condition-message" : undefined}
                    className={`${inputClassName(Boolean(errors.condition))} cursor-pointer appearance-none pr-10`}
                    {...register("condition")}
                  >
                    {withCurrent(conditions, object.state).map((condition) => (
                      <option key={condition} value={condition}>
                        {condition}
                      </option>
                    ))}
                  </select>
                  <Image
                    src="/assets/chevron-down.svg"
                    width={16}
                    height={16}
                    alt=""
                    className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2"
                  />
                </div>
              </Field>
            </div>
          </section>

          {/* Modalidade de partilha */}
          <section
            className="flex flex-col gap-6 border-t border-line pt-8"
            aria-labelledby="modalidade-titulo"
          >
            <div className="flex flex-col gap-1.5">
              <h2 id="modalidade-titulo" className="text-[22px] font-bold leading-[30px] text-on-teal">
                Modalidade de partilha
              </h2>
              <p className="text-sm font-normal leading-[22px] text-muted">
                Escolhe como queres partilhar o teu objeto.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row" role="radiogroup" aria-label="Modalidade de partilha">
              {modalities.map(({ id, icon, text }) => (
                <label
                  key={id}
                  className="group flex min-h-43 flex-1 cursor-pointer flex-col gap-3 rounded-xl border border-line bg-white p-4 has-checked:border-teal has-checked:bg-mint has-checked:ring-1 has-checked:ring-teal has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-navy"
                >
                  <input type="radio" value={id} className="sr-only" {...register("type")} />
                  <span className="flex items-center justify-between">
                    <Image src={icon} width={20} height={20} alt="" />
                    <span
                      aria-hidden="true"
                      className="flex size-[18px] items-center justify-center rounded-full border border-line after:size-2 after:rounded-full after:bg-white after:opacity-0 group-has-checked:border-teal group-has-checked:bg-teal group-has-checked:after:opacity-100"
                    />
                  </span>
                  <span className="flex flex-col gap-1.5 text-[12px] leading-5">
                    <span className="text-sm font-bold text-on-teal">{listingLabels[id]}</span>
                    <span className="font-normal text-muted">{text}</span>
                  </span>
                </label>
              ))}
            </div>

            {type === "aluguer" && (
              <>
                <div className="flex flex-col gap-4 sm:flex-row">
                  <Field id="price" label="Preço" error={errors.price?.message} className="flex-1">
                    <div className="relative">
                      <input
                        id="price"
                        type="text"
                        inputMode="decimal"
                        aria-invalid={Boolean(errors.price)}
                        aria-describedby={errors.price ? "price-message" : undefined}
                        className={`${inputClassName(Boolean(errors.price))} pr-10`}
                        {...register("price")}
                      />
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-sm text-muted"
                      >
                        €
                      </span>
                    </div>
                  </Field>

                  <Field id="priceUnit" label="Unidade de preço" className="flex-1">
                    <div className="relative">
                      <select
                        id="priceUnit"
                        className={`${inputClassName(false)} cursor-pointer appearance-none pr-10`}
                        {...register("priceUnit")}
                      >
                        {priceUnits.map(({ id, label }) => (
                          <option key={id} value={id}>
                            {label}
                          </option>
                        ))}
                      </select>
                      <Image
                        src="/assets/chevron-down.svg"
                        width={16}
                        height={16}
                        alt=""
                        className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2"
                      />
                    </div>
                  </Field>
                </div>
                <p className="-mt-2 text-xs font-normal leading-5 text-muted">
                  O preço aplica-se à unidade escolhida. Combina a duração por mensagem.
                </p>
              </>
            )}

            {type === "doacao" && (
              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-1.5">
                  <h3 className="text-[22px] font-bold leading-[30px] text-on-teal">Doação</h3>
                  <p className="text-sm font-normal leading-[22px] text-muted">
                    Oferece o teu objeto gratuitamente.
                  </p>
                </div>
                <div className="flex items-start gap-2.5 rounded-xl bg-cream p-4">
                  <Image src="/assets/gift.svg" width={18} height={18} alt="" className="shrink-0" />
                  <p className="min-w-0 flex-1 text-xs font-normal leading-[21px] text-muted">
                    Grátis · Vais oferecer este objeto à comunidade, sem qualquer custo. Combina a entrega por
                    mensagem.
                  </p>
                </div>
              </div>
            )}

            {type === "emprestimo" && (
              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-1.5">
                  <h3 className="text-[22px] font-bold leading-[30px] text-on-teal">Empréstimo</h3>
                  <p className="text-sm font-normal leading-[22px] text-muted">
                    Partilha o objeto durante um período e recebe-o de volta.
                  </p>
                </div>
                <Field
                  id="loanPeriod"
                  label="Período preferido (opcional)"
                  help="A duração final é combinada por mensagem."
                  error={errors.loanPeriod?.message}
                >
                  <input
                    id="loanPeriod"
                    type="text"
                    placeholder="Ex.: Até 5 dias"
                    aria-invalid={Boolean(errors.loanPeriod)}
                    aria-describedby="loanPeriod-message"
                    className={inputClassName(Boolean(errors.loanPeriod))}
                    {...register("loanPeriod")}
                  />
                </Field>
                <div className="flex items-start gap-2.5 rounded-xl bg-cream p-4">
                  <Image src="/assets/repeat-2.svg" width={18} height={18} alt="" className="shrink-0" />
                  <p className="min-w-0 flex-1 text-xs font-normal leading-[21px] text-muted">
                    Empréstimo gratuito. O objeto tem de ser devolvido na data combinada e nas mesmas
                    condições.
                  </p>
                </div>
              </div>
            )}
          </section>

          {/* Localização */}
          <section
            className="flex flex-col gap-5 border-t border-line pt-8"
            aria-labelledby="localizacao-titulo"
          >
            <h2 id="localizacao-titulo" className="text-[22px] font-bold leading-[30px] text-on-teal">
              Localização
            </h2>

            <Field id="location" label="Município ou localização" error={errors.location?.message}>
              <div className="relative">
                <Image
                  src="/assets/map-pin.svg"
                  width={18}
                  height={18}
                  alt=""
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2"
                />
                <input
                  id="location"
                  type="text"
                  autoComplete="off"
                  aria-invalid={Boolean(errors.location)}
                  aria-describedby={errors.location ? "location-message" : undefined}
                  className={`${inputClassName(Boolean(errors.location))} pl-11`}
                  {...register("location")}
                />
              </div>
            </Field>

            <div className="flex items-start gap-2.5 rounded-xl bg-cream p-4">
              <Image src="/assets/lock-keyhole.svg" width={18} height={18} alt="" className="shrink-0" />
              <p className="min-w-0 flex-1 text-xs font-normal leading-[21px] text-muted">
                A tua morada exata não é mostrada publicamente. Combina os detalhes da entrega em privado, por
                mensagem.
              </p>
            </div>
          </section>

          {/* Disponibilidade */}
          <section
            className="flex flex-col gap-5 border-t border-line pt-8"
            aria-labelledby="disponibilidade-titulo"
          >
            <h2 id="disponibilidade-titulo" className="text-[22px] font-bold leading-[30px] text-on-teal">
              Disponibilidade
            </h2>

            <fieldset className="m-0 flex min-w-0 flex-col gap-5 border-0 p-0">
              <legend className="mb-5 text-sm font-semibold leading-5 text-ink">
                Estado de disponibilidade
              </legend>
              <div className="flex flex-col gap-3 sm:flex-row">
                {(
                  [
                    { id: "disponivel", label: "Disponível" },
                    { id: "indisponivel", label: "Indisponível" },
                  ] as const
                ).map(({ id, label }) => (
                  <label
                    key={id}
                    className="group flex min-h-12 flex-1 cursor-pointer items-center gap-2 rounded-xl border border-line bg-white px-3.5 py-3 text-sm font-medium leading-6 text-ink has-checked:border-teal has-checked:bg-mint has-checked:font-bold has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-navy"
                  >
                    <input type="radio" value={id} className="sr-only" {...register("availability")} />
                    <span
                      aria-hidden="true"
                      className="size-[7px] shrink-0 rounded-full bg-muted group-has-checked:bg-teal"
                    />
                    {label}
                  </label>
                ))}
              </div>
              <p className="text-xs font-normal leading-5 text-muted">
                Os objetos indisponíveis não podem receber novos pedidos.
              </p>
            </fieldset>
          </section>

          {/* Avisos e ações */}
          <div className="flex flex-col gap-4 border-t border-line pt-6">
            {hasChanges && status === "idle" && errorKeys.length === 0 && (
              <div className="flex items-start gap-3 rounded-xl bg-cream p-4">
                <Image src="/assets/info.svg" width={20} height={20} alt="" className="shrink-0" />
                <p className="min-w-0 flex-1 text-sm font-normal leading-[22px] text-navy">
                  Tens alterações por guardar. Guarda antes de sair para não as perderes.
                </p>
              </div>
            )}

            {errorKeys.length > 0 && (
              <div role="alert" className="flex items-start gap-3 rounded-xl bg-danger-soft p-4">
                <Image src="/assets/circle-alert.svg" width={20} height={20} alt="" className="shrink-0" />
                <p className="min-w-0 flex-1 text-sm font-semibold leading-[22px] text-danger">
                  {validationMessage}
                </p>
              </div>
            )}

            {status === "success" && (
              <div role="status" className="flex flex-col gap-4 rounded-xl bg-mint p-6">
                <Image src="/assets/circle-check.svg" width={24} height={24} alt="" />
                <div className="flex flex-col gap-1.5">
                  <p className="text-[22px] font-bold leading-[30px] text-on-teal">Alterações guardadas</p>
                  <p className="text-sm font-normal leading-[22px] text-muted">
                    O teu artefacto foi atualizado. A comunidade já pode ver as novas informações.
                  </p>
                </div>
                <Link href="/meus-artefactos" className={`${primaryButtonClassName} no-underline`}>
                  Voltar aos meus artefactos
                </Link>
              </div>
            )}

            {status === "error" && (
              <div role="alert" className="flex flex-col gap-4 rounded-xl bg-danger-soft p-6">
                <Image src="/assets/circle-alert.svg" width={20} height={20} alt="" />
                <div className="flex flex-col gap-1.5">
                  <p className="text-[22px] font-bold leading-[30px] text-on-teal">Não foi possível guardar</p>
                  <p className="text-sm font-normal leading-[22px] text-muted">
                    As tuas alterações continuam aqui. Tenta novamente.
                  </p>
                </div>
                <button type="submit" className={primaryButtonClassName}>
                  Tentar novamente
                </button>
              </div>
            )}

            {status === "saving" && (
              <p role="status" className="text-sm font-normal leading-[22px] text-muted">
                A guardar as alterações do teu artefacto. Aguarda um momento.
              </p>
            )}

            {status !== "success" && status !== "error" && (
              <div className="flex justify-end gap-3">
                <button type="button" onClick={onCancel} className={secondaryButtonClassName}>
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={status === "saving"}
                  className={`${primaryButtonClassName} w-auto`}
                >
                  {status === "saving" ? (
                    <>
                      <Image
                        src="/assets/loader-circle.svg"
                        width={18}
                        height={18}
                        alt=""
                        className="animate-spin"
                      />
                      A guardar…
                    </>
                  ) : (
                    "Guardar alterações"
                  )}
                </button>
              </div>
            )}
          </div>
        </form>

        {/* Pré-visualização */}
        <aside className="flex flex-col gap-4 lg:sticky lg:top-6" aria-label="Pré-visualização">
          <h2 className="text-lg font-bold leading-[26px] text-on-teal">Pré-visualização</h2>

          <div className="overflow-hidden rounded-2xl border border-line bg-white">
            <div className="relative h-66 bg-sky">
              {photos[0] && (
                <Image
                  src={photos[0].src}
                  alt=""
                  fill
                  sizes="352px"
                  unoptimized={photos[0].src.startsWith("blob:")}
                  className="object-cover"
                />
              )}
              <span className="absolute right-3 top-3 flex size-11 items-center justify-center rounded-full bg-white">
                <Image src="/assets/heart.svg" width={20} height={20} alt="" />
              </span>
            </div>

            <div className="flex flex-col items-start gap-3 p-4">
              <span
                className={`inline-flex items-center gap-1 whitespace-nowrap rounded-md px-2 py-1 text-xs font-semibold leading-4 text-navy ${badgeColors[type]}`}
              >
                <Image src={badgeIcons[type]} width={14} height={14} alt="" className="shrink-0" />
                {listingLabels[type]}
              </span>

              <div className="flex w-full flex-col gap-1">
                <p className="break-words text-lg font-bold leading-[26px] text-on-teal">{previewTitle}</p>
                {previewSubtitle && (
                  <p className="text-xs font-normal leading-5 text-muted">{previewSubtitle}</p>
                )}
              </div>

              {previewLocation && (
                <p className="flex items-center gap-1 text-sm font-normal leading-5 text-muted">
                  <Image src="/assets/map-pin-sm.svg" width={14} height={14} alt="" className="shrink-0" />
                  {previewLocation}
                </p>
              )}

              <div className="flex w-full items-center justify-between border-t border-line pt-3">
                <div className="flex flex-col gap-1 whitespace-nowrap">
                  <p className="text-lg font-bold leading-[26px] text-navy">{previewCost.price}</p>
                  <p className="text-xs font-normal leading-[18px] text-muted">{previewCost.text}</p>
                </div>
                <Image src="/assets/arrow-up-right.svg" width={20} height={20} alt="" className="shrink-0" />
              </div>

              <p className="flex items-center gap-1.5 text-xs font-semibold leading-5 text-navy">
                <span
                  aria-hidden="true"
                  className={`size-[7px] rounded-full ${availability === "disponivel" ? "bg-teal" : "bg-muted"}`}
                />
                {availability === "disponivel" ? "Disponível" : "Indisponível"}
              </p>
            </div>
          </div>

          <p className="text-xs font-normal leading-5 text-muted">
            Exemplo de como o teu artefacto aparece à comunidade.
          </p>
        </aside>
      </div>

      {confirmingExit && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-on-teal/40 p-4 sm:p-20"
          onClick={() => setConfirmingExit(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="sair-titulo"
            aria-describedby="sair-descricao"
            onClick={(event) => event.stopPropagation()}
            className="flex w-full max-w-[440px] flex-col gap-5 rounded-2xl bg-white p-8"
          >
            <div className="flex items-center justify-between">
              <div className="flex size-11 items-center justify-center rounded-full bg-cream">
                <Image src="/assets/triangle-alert.svg" width={20} height={20} alt="" />
              </div>
              <button
                type="button"
                aria-label="Fechar"
                onClick={() => setConfirmingExit(false)}
                className="cursor-pointer"
              >
                <Image src="/assets/x.svg" width={20} height={20} alt="" />
              </button>
            </div>

            <div className="flex flex-col gap-1.5">
              <h2 id="sair-titulo" className="text-[22px] font-bold leading-[30px] text-on-teal">
                Sair sem guardar?
              </h2>
              <p id="sair-descricao" className="text-sm font-normal leading-[22px] text-muted">
                Tens alterações por guardar. Se saíres agora, as alterações feitas a este artefacto serão
                perdidas.
              </p>
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-line p-3">
              <Image
                src={object.photo}
                width={56}
                height={56}
                alt=""
                className="size-14 shrink-0 rounded-lg object-cover"
              />
              <p className="min-w-0 flex-1 text-sm font-bold leading-[22px] text-on-teal">{object.title}</p>
            </div>

            <div className="flex flex-col gap-3">
              <button
                type="button"
                autoFocus
                onClick={() => setConfirmingExit(false)}
                className="min-h-12 cursor-pointer rounded-xl border-2 border-navy bg-white px-5 py-3 text-sm font-bold leading-6 text-on-teal"
              >
                Continuar a editar
              </button>
              <button
                type="button"
                onClick={() => router.push("/meus-artefactos")}
                className="min-h-12 cursor-pointer rounded-xl bg-danger px-5 py-3 text-sm font-bold leading-6 text-white transition-opacity hover:opacity-90"
              >
                Descartar alterações
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}