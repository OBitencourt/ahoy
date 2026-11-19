import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";
import EditArtifact from "@/src/components/editArtifact/editArtifact";
import { auth } from "@/src/lib/auth";
import { getMyListings } from "@/src/lib/mocks/myListings";
import { getObjectById } from "@/src/lib/mocks/objects";

type PageProps = { params: Promise<{ id: string }> };

export const metadata: Metadata = {
  title: "Editar artefacto — Ahoy",
};

async function EditArtifactContent({ params }: PageProps) {
  const { id } = await params;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const object = getObjectById(id);

  if (!object) notFound();

  // MOCK: a disponibilidade vem dos anúncios de exemplo (myListings.ts).
  // Com base de dados, validar também que o artefacto pertence a este utilizador.
  const listing = getMyListings().find((item) => item.object.id === id);
  const available = listing ? listing.status === "ativo" : true;

  return <EditArtifact object={object} available={available} />;
}

export default function EditArtifactPage({ params }: PageProps) {
  return (
    <main className="flex flex-col gap-8 px-6 pb-12 pt-8 xl:px-[120px]">
      <nav aria-label="Percurso de navegação" className="text-xs font-normal leading-5 text-muted">
        <Link href="/meus-artefactos" className="hover:underline">
          Os meus artefactos
        </Link>{" "}
        &gt; Editar artefacto
      </nav>

      <Suspense fallback={<div className="h-96 animate-pulse rounded-2xl bg-sky" />}>
        <EditArtifactContent params={params} />
      </Suspense>
    </main>
  );
}