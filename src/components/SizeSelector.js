// src/components/SizeSelector.js
import React from "react";

const SizeSelector = ({ sizes, selectedSize, onSelectSize, compact = false }) => {
  if (!sizes || sizes.length === 0) return null;

  return (
    <div className={compact ? "space-y-2" : "space-y-3"}>
      <span className="text-[11px] sm:text-xs uppercase tracking-[0.22em] text-stone-400">
        Tamanho
      </span>
      <div className="flex flex-wrap gap-2 sm:gap-2.5">
        {sizes.map((size) => {
          const isAdjustable = String(size).trim().toLowerCase() === "ajustável" || String(size).trim().toLowerCase() === "ajustavel";
          return (
            <button
              key={size}
              type="button"
              onClick={() => onSelectSize(size === selectedSize ? null : size)}
              className={`
                relative inline-flex items-center justify-center text-center
                min-w-[3.35rem] sm:min-w-[3.6rem] ${compact ? "min-h-[2.45rem] px-3 text-sm" : "min-h-[3rem] sm:min-h-[3.15rem] px-3.5 sm:px-4 text-sm sm:text-base"}
                ${isAdjustable ? "min-w-[6.9rem] sm:min-w-[7.6rem]" : ""}
                rounded-full font-semibold tracking-[0.01em] whitespace-nowrap
                transition-all duration-200
                ${
                  size === selectedSize
                    ? "bg-yellow-500 text-white shadow-md ring-2 ring-yellow-300 ring-offset-1 scale-[1.03]"
                    : "bg-stone-50 text-stone-700 hover:bg-stone-100 border border-stone-200 hover:border-stone-300"
                }
              `}
              title={`Tamanho ${size}`}
            >
              <span className="leading-none">{size}</span>
            </button>
          );
        })}
      </div>
      {!selectedSize && sizes.length > 0 && (
        <p className="text-xs sm:text-sm text-amber-700/90 italic">
          Selecione um tamanho para seguir com o atendimento.
        </p>
      )}
    </div>
  );
};

export default SizeSelector;
