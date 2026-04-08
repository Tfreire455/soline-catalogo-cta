import React from "react";

const MaterialFilter = ({ selectedMaterial, onSelectMaterial }) => {
  const options = [
    { value: null, label: "Todos", dot: null },
    { value: "ouro", label: "Banhado a Ouro", dot: "bg-amber-500" },
    { value: "prata", label: "Prata 925", dot: "bg-slate-500" },
  ];

  return (
    <div className="flex flex-wrap justify-center gap-2.5 mb-5">
      {options.map((opt) => {
        const isActive = selectedMaterial === opt.value;
        return (
          <button
            key={opt.value || "all"}
            onClick={() => onSelectMaterial(opt.value)}
            className={`
              inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm sm:text-base
              transition-all duration-200
              ${
                isActive
                  ? opt.value === "ouro"
                    ? "bg-amber-500 text-white font-semibold shadow-md"
                    : opt.value === "prata"
                    ? "bg-slate-500 text-white font-semibold shadow-md"
                    : "bg-yellow-500 text-white font-semibold shadow-md"
                  : "bg-stone-50 text-stone-700 border border-stone-200 hover:bg-stone-100"
              }
            `}
          >
            {opt.dot && (
              <span className={`w-2.5 h-2.5 rounded-full ${isActive ? "bg-white/80" : opt.dot}`} />
            )}
            {opt.label}
          </button>
        );
      })}
    </div>
  );
};

export default MaterialFilter;
