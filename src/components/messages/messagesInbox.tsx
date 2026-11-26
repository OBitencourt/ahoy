"use client";

import Image from "next/image";
import { useState } from "react";
import ConversationList from "@/src/components/messages/conversationList";
import ConversationThread from "@/src/components/messages/conversationThread";
import type { Conversation } from "@/src/lib/mocks/messages";

export default function MessagesInbox({
  conversations: initialConversations,
  initialId,
}: {
  conversations: Conversation[];
  initialId?: string;
}) {
  const startId = initialConversations.some(({ id }) => id === initialId)
    ? initialId
    : initialConversations[0]?.id;

  const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
  const [selectedId, setSelectedId] = useState<string | undefined>(startId);
  // Em ecrãs pequenos mostra-se a lista OU a conversa; no desktop aparecem lado a lado
  const [showThread, setShowThread] = useState<boolean>(Boolean(initialId && startId === initialId));

  const selected = conversations.find(({ id }) => id === selectedId);

  function selectConversation(id: string) {
    setSelectedId(id);
    setShowThread(true);
    // MOCK: marcar como lida no servidor quando houver base de dados
    setConversations((current) =>
      current.map((conversation) =>
        conversation.id === id ? { ...conversation, unread: false } : conversation,
      ),
    );
  }

  function sendMessage(text: string) {
    if (!selected) return;

    // MOCK: enviar para o servidor quando houver base de dados
    const time = new Date().toLocaleTimeString("pt-PT", { hour: "2-digit", minute: "2-digit" });
    const message = { id: `m-${Date.now()}`, from: "me" as const, text, time };

    setConversations((current) =>
      current.map((conversation) => {
        if (conversation.id !== selected.id) return conversation;

        const lastDay = conversation.days.at(-1);
        const days =
          lastDay && lastDay.label.startsWith("Hoje")
            ? [...conversation.days.slice(0, -1), { ...lastDay, messages: [...lastDay.messages, message] }]
            : [...conversation.days, { label: "Hoje", messages: [message] }];

        return { ...conversation, days, updatedAt: time };
      }),
    );
  }

  return (
    <div className="flex h-[80dvh] min-h-140 overflow-hidden rounded-2xl border border-line bg-white lg:h-205.75">
      <div
        className={`${showThread ? "hidden" : "flex"} w-full min-w-0 flex-col lg:flex lg:w-90 lg:shrink-0 lg:border-r lg:border-line`}
      >
        <ConversationList
          conversations={conversations}
          selectedId={selectedId}
          onSelect={selectConversation}
        />
      </div>

      <div className={`${showThread ? "flex" : "hidden"} min-w-0 flex-1 flex-col lg:flex`}>
        {selected ? (
          <ConversationThread
            key={selected.id}
            conversation={selected}
            onSend={sendMessage}
            onBack={() => setShowThread(false)}
          />
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
            <Image src="/assets/message-circle.svg" width={28} height={28} alt="" />
            <p className="text-lg font-bold leading-[26px] text-on-teal">Ainda não tens conversas</p>
            <p className="max-w-80 text-sm font-normal leading-[22px] text-muted">
              Quando pedires um artefacto ou alguém pedir o teu, a conversa aparece aqui.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}