import { SignOutButton } from "@/src/components/logoutButton";
import Results from "@/src/components/explore/results";
import SearchFilters from "@/src/components/explore/searchFilters";

export default function Home() {
  return (
    <>
      <main className="flex flex-col gap-8 px-6 py-10 xl:px-30">
        <SearchFilters />
        <Results />
        <SignOutButton />
      </main>
    </>

  );
}
