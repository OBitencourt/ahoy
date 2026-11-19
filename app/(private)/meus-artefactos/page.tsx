import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import MyObjects from "@/src/components/myObjects/myObjects";
import { auth } from "@/src/lib/auth";
import { getMyListings } from "@/src/lib/myListings";

export const metadata: Metadata = {
  title: "Os meus artefactos — Ahoy",
};

async function MyObjectsContent() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  // MOCK: anúncios de exemplo até haver base de dados
  return <MyObjects listings={getMyListings()} />;
}

export default function MyArtifactsPage() {
  return (
    <main className="flex flex-col gap-7 px-6 pb-12 pt-10 xl:px-[120px]">
      <div className="flex flex-wrap items-center gap-6">
        <div className="flex min-w-0 flex-1 basis-72 flex-col gap-2">
          <h1 className="text-[36px] font-bold leading-11 text-on-teal">
            Os meus artefactos
          </h1>
          <p className="text-base font-normal leading-6 text-muted">
            Gere os objetos que partilhas com a comunidade.
          </p>
        </div>

        <Link
          href="/publicar"
          className="flex h-12 items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-teal px-5 text-sm font-bold text-on-teal transition-opacity hover:opacity-90"
        >
          <Image src="/assets/plus.svg" width={20} height={20} alt="" />
          Publicar objeto
        </Link>
      </div>

      <Suspense fallback={<div className="h-96 animate-pulse rounded-2xl bg-sky" />}>
        <MyObjectsContent />
      </Suspense>
    </main>
  );
}