"use client";

import Image from "next/image";
import { useState } from "react";
import type { Conversation } from "@/src/lib/mocks/messages";
import type { User } from "@/src/lib/mocks/users";

/** Fotografia do participante ou, sem fotografia, as iniciais. */
export function ParticipantAvatar({ user }: { user: User }) {
  if (user.avatar) {
    return (
      <Image
        src={user.avatar}
        width={44}
        height={44}
        alt=""
        className="size-11 shrink-0 rounded-full object-cover"
      />
    );
  }

  const initials = user.name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <span
      aria-hidden="true"
      className="flex size-11 shrink-0 items-center justify-center rounded-full bg-sky text-sm font-bold text-navy"
    >
      {initials}
    </span>
  );
}

function lastMessageOf(conversation: Conversation) {
  return conversation.days.at(-1)?.messages.at(-1);
}

function previewOf(conversation: Conversation) {
  const last = lastMessageOf(conversation);

  if (!last) return "Sem mensagens";
  return last.from === "me" ? `Eu: ${last.text}` : last.text;
}

export default function ConversationList({
  conversations,
  selectedId,
  onSelect,
}: {
  conversations: Conversation[];
  selectedId?: string;
  onSelect: (id: string) => void;
}) {
  const [query, setQuery] = useState<string>("");

  const unreadCount = conversations.filter(({ unread }) => unread).length;
  const normalizedQuery = query.trim().toLowerCase();
  const visible = normalizedQuery
    ? conversations.filter((conversation) =>
        [conversation.participant.name, conversation.object.title, previewOf(conversation)].some((text) =>
          text.toLowerCase().includes(normalizedQuery),
        ),
      )
    : conversations;

  return (
    <>
      <div className="flex shrink-0 flex-col gap-4 p-5">
        <div className="flex items-start justify-between">
          <h2 className="text-lg font-bold text-on-teal">Conversas</h2>
          <p aria-live="polite" className="text-xs font-normal text-muted">
            {unreadCount > 0 ? `${unreadCount} por ler` : "Tudo lido"}
          </p>
        </div>

        <div className="relative">
          <Image
            src="/assets/search.svg"
            width={20}
            height={20}
            alt=""
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2"
          />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Pesquisar conversas"
            aria-label="Pesquisar conversas"
            className="h-12 w-full rounded-xl border border-line bg-white pl-11 pr-3.5 text-sm text-ink outline-none placeholder:text-muted focus:border-navy focus:ring-1 focus:ring-navy"
          />
        </div>
      </div>

      {visible.length === 0 ? (
        <p className="p-5 text-sm font-normal leading-[22px] text-muted">
          {conversations.length === 0
            ? "Ainda não tens conversas."
            : `Nenhuma conversa encontrada para “${query.trim()}”.`}
        </p>
      ) : (
        <ul className="m-0 min-h-0 flex-1 list-none overflow-y-auto p-0">
          {visible.map((conversation) => {
            const { id, participant, object, updatedAt, unread } = conversation;
            const selected = id === selectedId;

            return (
              <li key={id}>
                <button
                  type="button"
                  onClick={() => onSelect(id)}
                  aria-current={selected ? "true" : undefined}
                  className={`flex w-full cursor-pointer items-start gap-3 border-b border-line p-5 text-left ${
                    selected ? "border-l-3 bg-mint" : "bg-white hover:bg-sky"
                  }`}
                >
                  <ParticipantAvatar user={participant} />

                  <span className="flex min-w-0 flex-1 flex-col gap-1.5">
                    <span className="flex items-center justify-between gap-2">
                      <span className="truncate text-sm font-bold text-on-teal">{participant.name}</span>
                      <span className="shrink-0 text-[11px] font-normal text-muted">{updatedAt}</span>
                    </span>

                    <span className="flex items-center gap-2">
                      <span
                        className={`min-w-0 flex-1 truncate text-[13px] font-normal leading-5 ${
                          unread ? "text-ink" : "text-muted"
                        }`}
                      >
                        {previewOf(conversation)}
                      </span>
                      {unread && (
                        <>
                          <span aria-hidden="true" className="size-[7px] shrink-0 rounded-full bg-teal" />
                          <span className="sr-only">Não lida</span>
                        </>
                      )}
                    </span>

                    <span className="truncate text-[11px] font-normal text-muted">{object.title}</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}