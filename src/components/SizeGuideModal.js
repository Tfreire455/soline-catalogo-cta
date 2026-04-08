// src/components/SizeGuideModal.js
import React from "react";
import { FiX } from "react-icons/fi";

const sizeData = [
  { num: "12", circ: "52 mm", diam: "16.5 mm" },
  { num: "13", circ: "53 mm", diam: "16.9 mm" },
  { num: "14", circ: "54 mm", diam: "17.2 mm" },
  { num: "15", circ: "56 mm", diam: "17.8 mm" },
  { num: "16", circ: "57 mm", diam: "18.2 mm" },
  { num: "17", circ: "58 mm", diam: "18.5 mm" },
  { num: "18", circ: "59 mm", diam: "18.8 mm" },
  { num: "19", circ: "60 mm", diam: "19.1 mm" },
  { num: "20", circ: "61 mm", diam: "19.4 mm" },
  { num: "21", circ: "63 mm", diam: "20.0 mm" },
  { num: "22", circ: "64 mm", diam: "20.4 mm" },
  { num: "23", circ: "65 mm", diam: "20.7 mm" },
  { num: "24", circ: "66 mm", diam: "21.0 mm" },
  { num: "25", circ: "67 mm", diam: "21.3 mm" },
  { num: "26", circ: "68 mm", diam: "21.6 mm" },
  { num: "27", circ: "69 mm", diam: "22.0 mm" },
  { num: "28", circ: "71 mm", diam: "22.6 mm" },
  { num: "30", circ: "73 mm", diam: "23.2 mm" },
];

const SizeGuideModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div
        className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[85vh] overflow-hidden border border-amber-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100 bg-stone-50/50">
          <div>
            <h3 className="text-base sm:text-lg font-serif italic text-stone-900">
              Guia de Medidas
            </h3>
            <p className="text-[10px] xs:text-xs text-stone-500">
              Tabela de referência para anéis
            </p>
          </div>
          <button
            onClick={onClose}
            className="bg-white hover:bg-stone-50 border border-stone-200 text-stone-600 rounded-full p-1.5 shadow-sm transition"
          >
            <FiX className="w-4 h-4" />
          </button>
        </div>

        {/* Dica */}
        <div className="px-5 py-3 bg-amber-50/80 border-b border-amber-100">
          <p className="text-[11px] xs:text-xs text-amber-800 leading-relaxed">
            <strong>Dica:</strong> Enrole um fio ou tira de papel no dedo,
            marque onde se encontra e meça o comprimento. Compare com a
            circunferência abaixo.
          </p>
        </div>

        {/* Tabela */}
        <div className="overflow-y-auto max-h-[55vh] px-5 py-3">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[10px] xs:text-xs uppercase tracking-wider text-stone-400 border-b border-stone-100">
                <th className="py-2 text-left font-medium">Número</th>
                <th className="py-2 text-center font-medium">Circunferência</th>
                <th className="py-2 text-right font-medium">Diâmetro</th>
              </tr>
            </thead>
            <tbody>
              {sizeData.map((row) => (
                <tr
                  key={row.num}
                  className="border-b border-stone-50 last:border-0 hover:bg-amber-50/50 transition-colors"
                >
                  <td className="py-2.5 text-stone-900 font-semibold">
                    {row.num}
                  </td>
                  <td className="py-2.5 text-center text-stone-600">
                    {row.circ}
                  </td>
                  <td className="py-2.5 text-right text-stone-600">
                    {row.diam}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-stone-100 bg-stone-50/30">
          <button
            onClick={onClose}
            className="w-full py-2.5 text-xs xs:text-sm font-medium text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-full transition"
          >
            Entendi
          </button>
        </div>
      </div>
    </div>
  );
};

export default SizeGuideModal;
