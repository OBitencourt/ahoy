"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { User } from "@/src/lib/mocks/users";
import PersonalInfoPanel from "./personalInfoPanel";
import PreferencesPanel from "./preferencesPanel";
import SecurityPanel from "./securityPanel";

const sections = [
  { id: "personal", label: "Informações pessoais", icon: "/assets/user-round.svg" },
  { id: "security", label: "Segurança", icon: "/assets/lock-keyhole.svg" },
  {
    id: "preferences",
    label: "Preferências",
    icon: "/assets/sliders-horizontal.svg",
  },
] as const;

type SettingsSection = (typeof sections)[number]["id"];

export default function AccountSettings({ user }: { user: User }) {
  const { id: userId, name, username, avatar } = user;
  const [section, setSection] = useState<SettingsSection>("personal");

  return (
    <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-16">
      <aside className="flex w-full flex-col gap-2 lg:w-62 lg:shrink-0">
        <div className="flex items-center gap-3 px-3 py-4">
          <Image
            src={avatar}
            width={44}
            height={44}
            alt={`Fotografia de ${name}`}
            className="size-11 shrink-0 rounded-full object-cover"
          />
          <div className="flex min-w-0 flex-col gap-1">
            <p className="truncate text-sm font-bold text-on-teal">{name}</p>
            <p className="truncate text-xs font-normal text-muted">@{username}</p>
          </div>
        </div>

        <nav aria-label="Definições da conta" className="flex flex-col gap-2">
          {sections.map(({ id, label, icon }) => {
            const selected = section === id;

            return (
              <button
                key={id}
                type="button"
                aria-current={selected ? "page" : undefined}
                onClick={() => setSection(id)}
                className={`flex h-12 w-full cursor-pointer items-center gap-2.5 rounded-xl border px-3.5 text-sm text-navy ${
                  selected
                    ? "border-teal bg-mint font-bold"
                    : "border-transparent bg-white font-medium"
                }`}
              >
                <Image
                  src={icon}
                  width={18}
                  height={18}
                  alt=""
                  className="shrink-0"
                />
                {label}
              </button>
            );
          })}
        </nav>

        <div className="flex flex-col gap-2 px-3.5 pt-6">
          <p className="text-xs font-normal leading-5 text-muted">
            Queres ver o que a comunidade vê?
          </p>
          <Link
            href={`/utilizadores/${userId}`}
            className="w-fit text-[13px] font-semibold text-navy underline"
          >
            Ver o meu perfil público
          </Link>
        </div>
      </aside>

      <div className="min-w-0 flex-1 lg:max-w-200">
        {section === "personal" && <PersonalInfoPanel user={user} />}
        {section === "security" && <SecurityPanel />}
        {section === "preferences" && <PreferencesPanel />}
      </div>
    </div>
  );
}
