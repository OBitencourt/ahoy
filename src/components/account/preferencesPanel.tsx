"use client";

import { useState } from "react";
import { savePreferences } from "@/src/lib/account";
import { primaryButtonClassName } from "./formStyles";
import StatusBanner, { type Status } from "./statusBanner";

const preferenceList = [
  { id: "requests", label: "Receber emails sobre novos pedidos" },
  { id: "messages", label: "Receber emails sobre novas mensagens" },
] as const;

type PreferenceId = (typeof preferenceList)[number]["id"];

export default function PreferencesPanel() {
  const [preferences, setPreferences] = useState<Record<PreferenceId, boolean>>({
    requests: true,
    messages: true,
  });
  const [status, setStatus] = useState<Status>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  function toggle(id: PreferenceId) {
    setStatus(null);
    setPreferences((current) => ({ ...current, [id]: !current[id] }));
  }

  async function onSave() {
    setStatus(null);
    setIsSaving(true);

    try {
      await savePreferences(preferences);
      setStatus("success");
    } catch {
      setStatus("error");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="flex flex-col gap-7">
      <h2 className="text-[22px] font-bold leading-[30px] text-on-teal">
        Preferências
      </h2>

      <div className="flex flex-col gap-6">
        {preferenceList.map(({ id, label }) => {
          const enabled = preferences[id];

          return (
            <div key={id} className="flex items-center gap-4">
              <p
                id={`preference-${id}`}
                className="min-w-0 flex-1 text-sm font-normal leading-[22px] text-ink"
              >
                {label}
              </p>
              <button
                type="button"
                role="switch"
                aria-checked={enabled}
                aria-labelledby={`preference-${id}`}
                onClick={() => toggle(id)}
                className={`flex h-[26px] w-11 shrink-0 cursor-pointer items-start rounded-full p-[3px] transition-colors ${
                  enabled ? "justify-end bg-teal" : "justify-start bg-line"
                }`}
              >
                <span className="size-5 rounded-full bg-white" />
              </button>
            </div>
          );
        })}
      </div>

      <StatusBanner status={status} />

      <button
        type="button"
        disabled={isSaving}
        onClick={onSave}
        className={`${primaryButtonClassName} self-start`}
      >
        {isSaving ? "A guardar..." : "Guardar preferências"}
      </button>
    </div>
  );
}
