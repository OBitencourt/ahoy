const STARS = [0, 1, 2, 3, 4];

/** 5 estrelas de 20px; a última pode ficar parcialmente preenchida (ex.: 4,8). */
export default function StarRating({ rating }: { rating: number }) {
  return (
    <div
      role="img"
      aria-label={`Avaliação de ${rating.toLocaleString("pt-PT")} em 5`}
      className="flex gap-[3px]"
    >
      {STARS.map((index) => {
        const fill = Math.min(Math.max(rating - index, 0), 1);

        return (
          <span
            key={index}
            aria-hidden="true"
            className="relative size-5 text-xl leading-5 text-line"
          >
            ★
            <span
              className="absolute inset-y-0 left-0 overflow-hidden text-star"
              style={{ width: `${fill * 100}%` }}
            >
              ★
            </span>
          </span>
        );
      })}
    </div>
  );
}