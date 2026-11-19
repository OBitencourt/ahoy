import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import AccountSettings from "@/src/components/account/accountSettings";
import { auth } from "@/src/lib/auth";
import { getCurrentUser } from "@/src/lib/users";

export const metadata: Metadata = {
  title: "A minha conta — Ahoy",
};

async function AccountContent() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  // MOCK: completa o perfil com os dados da sessão até haver base de dados
  const mock = getCurrentUser();
  const user = {
    ...mock,
    name: session.user.name || mock.name,
    email: session.user.email || mock.email,
    avatar: session.user.image || mock.avatar,
  };

  return <AccountSettings user={user} />;
}

export default function AccountPage() {
  return (
    <main className="flex flex-col gap-9 px-6 pb-12 pt-10 xl:px-30">
      <div className="flex flex-col gap-2">
        <h1 className="text-[36px] font-bold leading-11 text-on-teal">
          A minha conta
        </h1>
        <p className="text-base font-normal leading-6 text-muted">
          O teu perfil, os teus dados e as tuas preferências.
        </p>
      </div>

      <Suspense fallback={<div className="h-96 animate-pulse rounded-xl bg-sky" />}>
        <AccountContent />
      </Suspense>
    </main>
  );
}