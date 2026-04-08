// src/components/HighlightsCarousel.jsx
import React from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import {
  getMaterialVisuals,
  getValidImageUrls,
  getViewUrl,
} from "../utils/catalogHelpers";

const HighlightsCarousel = ({
  highlightedProducts,
  highlightIndex,
  onChangeHighlight,
  onImageClick,
  onSelectProduct,
  whatsappPhone,
}) => {
  const highlightCount = highlightedProducts.length;

  if (highlightCount === 0) return null;

  return (
    <section
      id="destaques"
      className="relative py-8 sm:py-10 px-3 xs:px-4 md:px-10 overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-[#fffdf6] via-[#fff] to-[#fef8eb] opacity-95 -z-10" />
      <div className="max-w-6xl mx-auto">
        <h2 className="section-title text-xl xs:text-2xl sm:text-3xl font-serif text-center mb-4 sm:mb-6 text-yellow-500">
          Destaques da Coleção
        </h2>
        <p className="text-xs xs:text-sm sm:text-base text-center text-stone-600 mb-5 sm:mb-7 max-w-2xl mx-auto">
          Uma curadoria especial com uma peça de cada categoria, escolhida pelo
          acabamento, brilho e presença única.
        </p>

        <div className="highlight-card relative bg-white/90 backdrop-blur-md border border-amber-100 rounded-3xl shadow-[0_14px_40px_rgba(0,0,0,0.05)] max-w-5xl mx-auto px-3 xs:px-4 sm:px-5 py-3 sm:py-5">
          {(() => {
            const product = highlightedProducts[highlightIndex] || {};
            const images = getValidImageUrls(product);
            const visuals = getMaterialVisuals(product.bath);
            const firstImage = images[0];
            const thumb = firstImage ? getViewUrl(firstImage) : null;

            return (
              <div className="flex flex-col md:flex-row items-center gap-3 sm:gap-5 md:gap-6">
                {/* Imagem do destaque */}
                <div className="relative w-full md:w-1/2 lg:w-5/12">
                  <div className="relative w-full aspect-[4/5] rounded-3xl overflow-hidden bg-stone-100 shadow-[0_16px_40px_rgba(0,0,0,0.12)]">
                    {thumb ? (
                      <img
                        src={thumb}
                        alt={product.name}
                        className="w-full h-full object-cover cursor-pointer"
                        onClick={() =>
                          firstImage &&
                          onImageClick(product, firstImage, 0)
                        }
                        onError={(e) => {
                          e.target.src = firstImage;
                          e.target.className =
                            "w-full h-full object-contain bg-stone-200 p-4";
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-stone-500">
                        Sem imagem disponível
                      </div>
                    )}

                    {/* Glows */}
                    <div className="pointer-events-none absolute -bottom-10 -left-10 w-20 h-20 rounded-full bg-gradient-to-tr from-amber-300/60 via-yellow-200/50 to-transparent blur-2xl" />
                    <div className="pointer-events-none absolute -top-7 -right-4 w-16 h-16 rounded-full bg-gradient-to-tr from-white/80 via-yellow-100/60 to-transparent blur-2xl" />
                  </div>
                </div>

                {/* Info */}
                <div className="w-full md:w-1/2 lg:w-7/12 space-y-3 sm:space-y-4">
                  <div className="flex flex-wrap items-center gap-2">
                    {product.category && (
                      <span className="text-yellow-800 bg-yellow-100/90 px-3 py-1 text-[10px] xs:text-xs rounded-full font-semibold tracking-wider shadow-sm inline-flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
                        {product.category}
                      </span>
                    )}
                    {product.bath && (
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 text-[10px] xs:text-xs rounded-full ${visuals.badgeClass}`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${visuals.dotClass}`}
                        />
                        {visuals.label}
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1 px-3 py-1 text-[9px] xs:text-[10px] rounded-full bg-amber-50/90 text-amber-700 border border-amber-100 uppercase tracking-[0.15em]">
                      Destaque da categoria
                    </span>
                  </div>

                  <h3 className="text-lg xs:text-xl sm:text-2xl md:text-3xl font-serif italic text-stone-900 leading-snug">
                    {product.name || "Peça em destaque"}
                  </h3>

                  <div className="flex items-center gap-3 flex-wrap">
                    <span
                      className={`text-lg xs:text-xl sm:text-2xl font-bold tracking-tight ${visuals.priceText}`}
                    >
                      {product.price
                        ? `R$ ${product.price.toFixed(2).replace(".", ",")}`
                        : "Sob consulta"}
                    </span>
                    {product.partCode && (
                      <span className="text-[11px] xs:text-xs sm:text-sm text-stone-500 bg-stone-100/80 px-2 py-0.5 rounded-full">
                        Código:{" "}
                        <strong className="text-stone-700">
                          {product.partCode}
                        </strong>
                      </span>
                    )}
                  </div>

                  {/* Descrição – AUMENTADA */}
                  {product.description && (
                    <p className="text-sm xs:text-base sm:text-lg text-stone-700 leading-relaxed font-serif italic">
                      {product.description}
                    </p>
                  )}

                  {/* Bloco de ações / estoque – textos levemente maiores */}
                  <div className="pt-1 sm:pt-2 flex flex-col xs:flex-row gap-2.5 xs:gap-3 items-start xs:items-center">
                    <a
                      href={`https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
                        `Olá, vi a peça em destaque no catálogo e gostaria de mais informações sobre: ${product.name} (Código: ${product.partCode}).`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-6 py-2.5 sm:px-7 sm:py-3 text-xs xs:text-sm sm:text-base font-serif italic text-white bg-gradient-to-br from-yellow-500 via-amber-400 to-yellow-600 rounded-full shadow-md hover:shadow-lg hover:brightness-110 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-yellow-300"
                    >
                      <FaWhatsapp className="text-base sm:text-lg" />
                      Quero essa peça
                    </a>
                    <button
                      type="button"
                      onClick={() => onSelectProduct(product)}
                      className="text-xs xs:text-sm sm:text-base text-yellow-700 underline underline-offset-2 decoration-yellow-400 hover:text-yellow-800"
                    >
                      Ver detalhes da peça
                    </button>
                    <span className="text-xs xs:text-sm text-stone-500">
                      Estoque{" "}
                      {product.stock > 0 ? (
                        <span className="text-green-700 font-medium">
                          disponível
                        </span>
                      ) : (
                        <span className="text-red-600 font-medium">
                          esgotado
                        </span>
                      )}
                    </span>
                  </div>
                </div>
              </div>
            );
          })()}

          {highlightCount > 1 && (
            <>
              <button
                onClick={() =>
                  onChangeHighlight(
                    highlightIndex === 0 ? highlightCount - 1 : highlightIndex - 1
                  )
                }
                className="absolute left-2 xs:left-3 top-1/2 -translate-y-1/2 bg-white/85 hover:bg-white text-yellow-700 p-1.5 xs:p-2 rounded-full shadow-sm border border-amber-100"
                aria-label="Destaque anterior"
              >
                <FiChevronLeft className="w-4 h-4 xs:w-5 xs:h-5" />
              </button>
              <button
                onClick={() =>
                  onChangeHighlight(
                    highlightIndex === highlightCount - 1
                      ? 0
                      : highlightIndex + 1
                  )
                }
                className="absolute right-2 xs:right-3 top-1/2 -translate-y-1/2 bg-white/85 hover:bg-white text-yellow-700 p-1.5 xs:p-2 rounded-full shadow-sm border border-amber-100"
                aria-label="Próximo destaque"
              >
                <FiChevronRight className="w-4 h-4 xs:w-5 xs:h-5" />
              </button>

              <div className="flex justify-center gap-1.5 xs:gap-2 mt-3">
                {highlightedProducts.map((p, idx) => (
                  <button
                    key={`${p.partCode || p.id || idx}-dot`}
                    onClick={() => onChangeHighlight(idx)}
                    className={`w-1.5 h-1.5 xs:w-2 xs:h-2 rounded-full transition-all ${
                      idx === highlightIndex
                        ? "bg-yellow-500 w-3 xs:w-4"
                        : "bg-stone-300"
                    }`}
                    aria-label={`Ir para destaque ${idx + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default HighlightsCarousel;
