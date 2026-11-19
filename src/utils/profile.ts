import { z } from "zod";

export const BIO_MAX_LENGTH = 300;

export const profileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Indica o teu nome.")
    .max(80, "O nome pode ter no máximo 80 caracteres."),
  username: z
    .string()
    .trim()
    .min(3, "O nome de utilizador deve ter pelo menos 3 caracteres.")
    .max(30, "O nome de utilizador pode ter no máximo 30 caracteres.")
    .regex(
      /^[a-z0-9._]+$/,
      "Usa apenas letras minúsculas, números, pontos e underscores.",
    ),
  email: z.string().trim().email("Introduz um endereço de email válido."),
  location: z.string().trim().min(1, "Indica a tua localização."),
  bio: z
    .string()
    .max(
      BIO_MAX_LENGTH,
      `A biografia pode ter no máximo ${BIO_MAX_LENGTH} caracteres.`,
    ),
});

export type ProfileFormData = z.infer<typeof profileSchema>;

export const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Indica a tua palavra-passe atual."),
    newPassword: z
      .string()
      .min(8, "Usa pelo menos 8 caracteres.")
      .regex(/[A-Za-z]/, "Inclui pelo menos uma letra.")
      .regex(/\d/, "Inclui pelo menos um número."),
    confirmPassword: z.string().min(1, "Confirma a nova palavra-passe."),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "As palavras-passe não coincidem.",
  });

export type PasswordFormData = z.infer<typeof passwordSchema>;
