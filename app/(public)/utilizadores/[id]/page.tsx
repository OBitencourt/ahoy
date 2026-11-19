import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import ProfileHeader from "@/src/components/publicProfile/profileHeader";
import ProfileObjects from "@/src/components/publicProfile/profileObjects";
import ProfileStats from "@/src/components/publicProfile/profileStats";
import { objects } from "@/src/lib/objects";
import { getUserById, users } from "@/src/lib/users";

type PageProps = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return Object.keys(users).map((id) => ({ id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const user = getUserById(id);

  return { title: user ? `${user.name} — Ahoy` : "Perfil não encontrado — Ahoy" };
}

function ProfileSkeleton() {
  return (
    <div className="flex animate-pulse flex-col gap-10" aria-hidden="true">
      <div className="flex gap-8">
        <div className="size-40 rounded-full bg-sky" />
        <div className="flex flex-1 flex-col gap-3">
          <div className="h-10 w-72 rounded-xl bg-sky" />
          <div className="h-6 w-40 rounded-xl bg-sky" />
          <div className="h-13 w-full max-w-[728px] rounded-xl bg-sky" />
        </div>
      </div>
      <div className="h-16 rounded-xl bg-sky" />
    </div>
  );
}

async function ProfileContent({ params }: PageProps) {
  const { id } = await params;
  const user = getUserById(id);

  if (!user) notFound();

  // Objetos publicados por este utilizador (ObjectListing.ownerId → User.id)
  const userObjects = objects.filter(({ ownerId }) => ownerId === user.id);
  const firstName = user.name.split(" ")[0];

  return (
    <>
      <div className="flex flex-col gap-7">
        <ProfileHeader user={user} />
        <ProfileStats user={user} publishedCount={userObjects.length} />
      </div>

      <ProfileObjects firstName={firstName} objects={userObjects} />
    </>
  );
}

export default function PublicProfilePage({ params }: PageProps) {
  return (
    <main className="flex flex-col gap-10 px-6 pb-10 pt-8 xl:px-[120px]">
      <Suspense fallback={<ProfileSkeleton />}>
        <ProfileContent params={params} />
      </Suspense>
    </main>
  );
}