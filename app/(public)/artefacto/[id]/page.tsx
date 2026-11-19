import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import ProductDescription from "@/src/components/product/productDescription";
import ProductGallery from "@/src/components/product/productGallery";
import ProductSummary from "@/src/components/product/productSummary";
import SimilarObjects from "@/src/components/product/similarObject";
import { getObjectById, getSimilarObjects, objects } from "@/src/lib/mocks/objects";
import { getUserById } from "@/src/lib/mocks/users";

type ProductPageProps = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  return objects.map(({ id }) => ({ id }));
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const object = getObjectById(id);

  return {
    title: object ? `${object.title} — Ahoy` : "Objeto não encontrado — Ahoy",
  };
}

// A página não faz `await params`: passa a promise a um componente dentro de <Suspense>.
export default function ProductPage({ params }: ProductPageProps) {
  return (
    <main className="flex flex-col gap-8 px-6 pb-12 pt-8 xl:px-30">
      <Suspense fallback={<ProductSkeleton />}>
        <ProductContent params={params} />
      </Suspense>
    </main>
  );
}

async function ProductContent({ params }: ProductPageProps) {
  const { id } = await params;

  const object = getObjectById(id);
  if (!object) notFound();

  // Dono do objeto, por mapeamento ownerId → users
  const owner = getUserById(object.ownerId);
  if (!owner) notFound();

  const similar = getSimilarObjects(id);

  return (
    <>
      <nav aria-label="Percurso" className="text-xs leading-5 text-muted">
        <Link href="/" className="hover:underline">
          Explorar
        </Link>
        <span aria-hidden="true"> &gt; </span>
        {object.category}
        <span aria-hidden="true"> &gt; </span>
        <span aria-current="page">{object.title}</span>
      </nav>

      <div className="flex flex-col gap-12 lg:flex-row lg:items-start">
        <div className="flex w-full flex-col gap-8 lg:w-155 lg:shrink-0">
          <ProductGallery
            title={object.title}
            photos={[object.photo, ...object.extraPhotos]}
          />
          <ProductDescription object={object} owner={owner} />
        </div>

        <ProductSummary object={object} owner={owner} />
      </div>

      <SimilarObjects objects={similar} />
    </>
  );
}

// Fallback enquanto os dados do pedido (params) não estão disponíveis
function ProductSkeleton() {
  return (
    <div
      className="flex animate-pulse flex-col gap-12 lg:flex-row lg:items-start"
      aria-hidden="true"
    >
      <div className="aspect-620/465 w-full rounded-2xl bg-line lg:w-155 lg:shrink-0" />
      <div className="flex w-full flex-1 flex-col gap-4">
        <div className="h-6 w-24 rounded-md bg-line" />
        <div className="h-11 w-3/4 rounded-lg bg-line" />
        <div className="h-24 w-full rounded-xl bg-line" />
      </div>
    </div>
  );
}