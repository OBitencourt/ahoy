import type { PasswordFormData, ProfileFormData } from "@/src/utils/profile";

/**
 * MOCK — simulam o pedido ao servidor enquanto não há base de dados.
 * Trocar o corpo de cada função pela chamada real; se lançarem erro,
 * o painel mostra o aviso "Não foi possível guardar as alterações.".
 */
const delay = (ms = 600) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

export async function saveProfile(
  data: ProfileFormData,
  photo: File | null,
): Promise<void> {
  void data;
  void photo;
  await delay();
}

export async function savePassword(data: PasswordFormData): Promise<void> {
  void data;
  await delay();
}

export async function savePreferences(
  preferences: Record<string, boolean>,
): Promise<void> {
  void preferences;
  await delay();
}
