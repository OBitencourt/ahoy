import { SignOutButton } from "@/src/components/logoutButton";
import Results from "@/src/components/results";
import SearchFilters from "@/src/components/searchFilters";

export default function Home() {
  return (
    <>
      <main className="flex flex-col gap-8 px-6 py-10 xl:px-[120px]">
        <SearchFilters />
        <Results />
        <SignOutButton />
      </main>
    </>

  );
}
