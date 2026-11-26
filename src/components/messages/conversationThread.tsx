"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { ParticipantAvatar } from "@/src/components/messages/conversationList";
import { listingLabels } from "@/src/lib/mocks/objects";
import type { Conversation } from "@/src/lib/mocks/messages";
import { badgeColors, badgeIcons } from "@/src/utils/artifactDetails";

export default function ConversationThread({
  conversation,
  onSend,
  onBack,
}: {
  conversation: Conversation;
  onSend: (text: string) => void;
  onBack: () => void;
}) {
  const { participant, object, request, days } = conversation;
  const [draft, setDraft] = useState<string>("");
  const messagesRef = useRef<HTMLDivElement>(null);
  const messageCount = days.reduce((total, day) => total + day.messages.length, 0);

  // Mostra sempre a mensagem mais recente
  useEffect(() => {
    const element = messagesRef.current;
    if (element) element.scrollTo({ top: element.scrollHeight });
  }, [messageCount]);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const text = draft.trim();
    if (!text) return;

    onSend(text);
    setDraft("");
  }

  return (
    <>
      {/* Cabeçalho */}
      <div className="flex shrink-0 items-center gap-3 border-b border-line px-6 py-4.5">
        <button
          type="button"
          onClick={onBack}
          aria-label="Voltar às conversas"
          className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full hover:bg-sky lg:hidden"
        >
          <Image src="/assets/arrow-left.svg" width={16} height={16} alt="" />
        </button>
        <ParticipantAvatar user={participant} />
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <p className="truncate text-base font-bold text-on-teal">{participant.name}</p>
          <Link href={`/utilizadores/${participant.id}`} className="text-xs font-normal text-navy underline">
            Ver perfil
          </Link>
        </div>
      </div>

      {/* Objeto e estado do pedido */}
      <div className="flex shrink-0 flex-col gap-3 px-6 pb-4 pt-5">
        <Link
          href={`/artefacto/${object.id}`}
          className="flex items-center gap-3 rounded-xl border border-line p-3 transition-colors hover:bg-sky"
        >
          <Image
            src={object.photo}
            width={72}
            height={64}
            alt=""
            className="h-16 w-18 shrink-0 rounded-lg object-cover"
          />
          <span className="flex min-w-0 flex-1 flex-col gap-1.5">
            <span className="truncate text-sm font-bold text-on-teal">{object.title}</span>
            <span className="flex items-center gap-2.5">
              <span
                className={`flex items-center gap-1 whitespace-nowrap rounded-md px-2 py-1 text-xs font-semibold leading-4 text-navy ${badgeColors[object.type]}`}
              >
                <Image src={badgeIcons[object.type]} width={14} height={14} alt="" className="shrink-0" />
                {listingLabels[object.type]}
              </span>
              <span className="whitespace-nowrap text-sm font-bold text-navy">
                {object.pricePerDay !== undefined ? `${object.pricePerDay} €/dia` : "Grátis"}
              </span>
            </span>
          </span>
          <Image src="/assets/arrow-up-right.svg" width={20} height={20} alt="" className="shrink-0" />
        </Link>

        {request && (
          <div className="flex items-start gap-2.5 rounded-xl bg-cream p-3">
            <Image src="/assets/clock-3.svg" width={18} height={18} alt="" className="shrink-0" />
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <p className="text-[13px] font-bold text-navy">Pedido pendente</p>
              <p className="text-xs font-normal leading-5 text-muted">
                {request.period} · {request.explanation}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Mensagens */}
      <div
        ref={messagesRef}
        role="log"
        aria-label={`Mensagens com ${participant.name}`}
        className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-6 pb-6 pt-3"
      >
        {days.map(({ label, messages }) => (
          <div key={label} className="flex flex-col gap-4">
            <p className="text-center text-[11px] font-normal text-muted">{label}</p>

            {messages.map(({ id, from, text, time }) => {
              const sent = from === "me";

              return (
                <div key={id} className={`flex ${sent ? "justify-end" : ""}`}>
                  <div
                    className={`flex w-fit max-w-[85%] flex-col gap-1.5 rounded-2xl px-4 py-3 sm:max-w-130 ${
                      sent ? "rounded-br-sm bg-mint" : "rounded-bl-sm bg-sky"
                    }`}
                  >
                    <p className="whitespace-pre-wrap wrap-break-word text-sm font-normal leading-[23px] text-ink">
                      {text}
                    </p>
                    <p className="text-right text-[10px] font-normal text-muted">
                      {sent ? `${time} · Enviada` : time}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Compor mensagem */}
      <form onSubmit={onSubmit} className="flex shrink-0 items-center gap-3 border-t border-line p-6">
        <input
          type="text"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Escreve uma mensagem..."
          aria-label="Escrever mensagem"
          autoComplete="off"
          className="min-h-12 min-w-0 flex-1 rounded-xl border border-line bg-white px-3.5 py-3 text-sm leading-[22px] text-ink outline-none placeholder:text-muted focus:border-navy focus:ring-1 focus:ring-navy"
        />
        <button
          type="submit"
          disabled={!draft.trim()}
          aria-label="Enviar mensagem"
          className="flex size-12 shrink-0 cursor-pointer items-center justify-center rounded-xl bg-teal transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Image src="/assets/send.svg" width={20} height={20} alt="" />
        </button>
      </form>
    </>
  );
}