import Image from "next/image";
import { objects } from "@/src/lib/objects";
import Chip from "./chip";
import ObjectCard from "./objectCard";
import Pagination from "./pagination";

const TOTAL_OBJECTS = 48;

export default function Results() {
  return (
    <section
      className="flex flex-col gap-6"
      aria-labelledby="resultados-titulo"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-baseline gap-3 whitespace-nowrap">
          <h2
            id="resultados-titulo"
            className="text-[22px] font-bold leading-[30px] text-on-teal"
          >
            À tua volta
          </h2>
          <p className="text-sm font-normal text-muted">
            {TOTAL_OBJECTS} objetos em Lisboa
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="whitespace-nowrap text-sm font-normal text-muted">
            Ordenar por
          </span>
          <Chip>
            Relevância
            <Image src="/assets/chevron-down.svg" width={16} height={16} alt="" />
          </Chip>
        </div>
      </div>

      {/* 4 colunas aos 1200px do Figma */}
      <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-6">
        {objects.map((object) => (
          <ObjectCard key={object.id} object={object} />
        ))}
      </div>

      <Pagination shown={objects.length} total={TOTAL_OBJECTS} />
    </section>
  );
}
