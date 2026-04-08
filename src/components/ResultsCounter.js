import React from "react";

const ResultsCounter = ({ total, showing, searchQuery }) => {
  if (total === 0) return null;

  return (
    <p className="text-center text-sm sm:text-base text-stone-500 mb-7 sm:mb-8">
      {searchQuery ? (
        <>
          Encontramos <span className="font-semibold text-stone-700">{total}</span>{" "}
          {total === 1 ? "peça" : "peças"} para{" "}
          <span className="italic text-stone-700">“{searchQuery}”</span>
        </>
      ) : (
        <>
          Exibindo <span className="font-semibold text-stone-700">{showing}</span> de{" "}
          <span className="font-semibold text-stone-700">{total}</span>{" "}
          {total === 1 ? "peça disponível" : "peças disponíveis"}
        </>
      )}
    </p>
  );
};

export default ResultsCounter;
