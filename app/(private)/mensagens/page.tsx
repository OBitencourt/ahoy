import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import MessagesInbox from "@/src/components/messages/messagesInbox";
import { auth } from "@/src/lib/auth";
import { getConversations } from "@/src/lib/mocks/messages";

type PageProps = {
  /** `?conversa=<id>` abre diretamente uma conversa (ex.: a partir da página do artefacto). */
  searchParams: Promise<{ conversa?: string }>;
};

export const metadata: Metadata = {
  title: "Mensagens — Ahoy",
};

async function MessagesContent({ searchParams }: PageProps) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const { conversa } = await searchParams;

  return <MessagesInbox conversations={getConversations()} initialId={conversa} />;
}

export default function MessagesPage({ searchParams }: PageProps) {
  return (
    <main className="flex flex-col gap-7 px-6 pb-10 pt-10 xl:px-[120px]">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-bold leading-11 text-on-teal">Mensagens</h1>
        <p className="text-base font-normal leading-6 text-muted">
          Combina os detalhes de cada partilha.
        </p>
      </div>

      <Suspense fallback={<div className="h-205.75 animate-pulse rounded-2xl bg-sky" />}>
        <MessagesContent searchParams={searchParams} />
      </Suspense>
    </main>
  );
}