import ObjectCard from "@/src/components/objectCard";
import type { ObjectListing } from "@/src/lib/mocks/objects";

export default function SimilarObjects({
  objects,
}: {
  objects: ObjectListing[];
}) {
  if (objects.length === 0) return null;

  return (
    <section
      className="flex flex-col gap-6 border-t border-line pt-8"
      aria-labelledby="semelhantes-titulo"
    >
      <div className="flex flex-col gap-1.5">
        <h2
          id="semelhantes-titulo"
          className="text-[22px] font-bold text-on-teal"
        >
          Objetos semelhantes
        </h2>
        <p className="text-sm font-normal leading-[22px] text-muted">
          Mais ideias para os teus próximos projetos.
        </p>
      </div>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-6">
        {objects.map((object) => (
          <ObjectCard key={object.id} object={object} />
        ))}
      </div>
    </section>
  );
}
