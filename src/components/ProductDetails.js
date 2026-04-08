// src/components/ProductDetails.jsx
import React, { useMemo, useState } from "react";
import { FiChevronLeft, FiChevronRight, FiX, FiPlay } from "react-icons/fi";
import { TfiRuler } from "react-icons/tfi";
import { FaWhatsapp } from "react-icons/fa";
import {
  getMaterialVisuals,
  getMaterialDescription,
  getValidImageUrls,
  getViewUrl,
  getDriveVideoEmbedUrl,
} from "../utils/catalogHelpers";
import SizeSelector from "./SizeSelector";
import SizeGuideModal from "./SizeGuideModal";
import ShareButton from "./ShareButton";

const ProductDetails = ({ product, onClose, whatsappPhone }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);

  const mediaEntries = getValidImageUrls(product);
  const dedicatedVideoEmbed = product.videoUrl
    ? getDriveVideoEmbedUrl(product.videoUrl)
    : null;

  const slides = useMemo(
    () => [
      ...mediaEntries.map((entry) => ({
        type: entry.isVideo ? "video" : "image",
        src: entry.isVideo
          ? getDriveVideoEmbedUrl(entry.url)
          : getViewUrl(entry.url),
      })),
      ...(dedicatedVideoEmbed ? [{ type: "video", src: dedicatedVideoEmbed }] : []),
    ],
    [mediaEntries, dedicatedVideoEmbed]
  );

  const totalSlides = slides.length;
  const currentSlide = slides[currentIndex] || null;
  const visuals = getMaterialVisuals(product.bath);
  const bathText = getMaterialDescription(product.bath);
  const hasSizes = product.sizes && product.sizes.length > 0;
  const isOutOfStock = Number(product.stock) <= 0;

  const next = () => {
    if (totalSlides <= 1) return;
    setCurrentIndex((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
  };

  const prev = () => {
    if (totalSlides <= 1) return;
    setCurrentIndex((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
  };

  const buildWhatsAppMsg = () => {
    let msg = `Olá, gostaria de mais informações sobre o produto: ${product.name} (Código: ${product.partCode}).`;
    if (selectedSize) msg += ` Tamanho: ${selectedSize}`;
    return msg;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-3 py-4 backdrop-blur-sm xs:px-4">
      <div className="relative flex max-h-[95vh] w-full max-w-6xl flex-col overflow-hidden rounded-3xl border border-amber-100 bg-white/95 shadow-[0_24px_80px_rgba(0,0,0,0.4)]">
        <div className="flex items-center justify-between border-b border-stone-200 bg-white/90 px-4 py-3 sm:px-6">
          <div className="min-w-0">
            <span className="block text-[11px] uppercase tracking-[0.24em] text-stone-400 sm:text-xs">
              Detalhes da peça
            </span>
            <span className="mt-1 block truncate font-serif text-lg italic text-stone-900 sm:text-xl">
              {product.name}
            </span>
          </div>

          <button
            onClick={onClose}
            className="shrink-0 rounded-full border border-stone-200 bg-white p-2 text-stone-700 shadow-sm transition hover:bg-stone-50"
            aria-label="Fechar detalhes"
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-7">
          <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1.02fr)_minmax(0,0.98fr)] lg:gap-8">
            <div className="space-y-3">
              <div
                className={`relative mx-auto w-full max-w-[620px] overflow-hidden rounded-[2rem] shadow-[0_18px_45px_rgba(0,0,0,0.18)] ${
                  isOutOfStock ? "bg-stone-200" : "bg-stone-100"
                } aspect-[4/4.45] sm:aspect-[4/4.6]`}
              >
                {currentSlide ? (
                  currentSlide.type === "video" ? (
                    <iframe
                      key={currentSlide.src}
                      src={currentSlide.src}
                      title={`${product.name} - vídeo`}
                      allow="autoplay"
                      allowFullScreen
                      className="h-full w-full border-0"
                    />
                  ) : (
                    <img
                      key={currentSlide.src}
                      src={currentSlide.src}
                      alt={product.name}
                      className={`h-full w-full object-cover ${
                        isOutOfStock ? "grayscale brightness-[0.88] saturate-0" : ""
                      }`}
                      onError={(e) => {
                        e.target.className =
                          "h-full w-full object-contain bg-stone-200 p-4";
                      }}
                    />
                  )
                ) : (
                  <div className="flex h-full w-full items-center justify-center px-6 text-center text-sm text-stone-500">
                    Sem imagem disponível
                  </div>
                )}

                {totalSlides > 1 && (
                  <>
                    <button
                      onClick={prev}
                      className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 text-yellow-700 shadow-sm transition hover:bg-white"
                      aria-label="Imagem anterior"
                    >
                      <FiChevronLeft className="h-4 w-4" />
                    </button>

                    <button
                      onClick={next}
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 text-yellow-700 shadow-sm transition hover:bg-white"
                      aria-label="Próxima imagem"
                    >
                      <FiChevronRight className="h-4 w-4" />
                    </button>

                    <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
                      {slides.map((slide, idx) => (
                        <button
                          key={`detail-dot-${idx}`}
                          onClick={() => setCurrentIndex(idx)}
                          title={
                            slide.type === "video"
                              ? "Ver vídeo"
                              : `Imagem ${idx + 1}`
                          }
                          className={`h-1.5 rounded-full transition-all ${
                            idx === currentIndex
                              ? "w-5 bg-yellow-400"
                              : "w-1.5 bg-white/50"
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>

              {totalSlides > 1 && (
                <div className="mx-auto grid w-full max-w-[620px] grid-cols-4 gap-2 sm:gap-2.5">
                  {slides.map((slide, idx) => (
                    <button
                      key={`thumb-${idx}`}
                      onClick={() => setCurrentIndex(idx)}
                      className={`relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-2xl border ${
                        idx === currentIndex
                          ? "border-yellow-500 shadow-md"
                          : "border-stone-200"
                      } ${slide.type === "video" ? "bg-stone-900" : ""}`}
                      title={
                        slide.type === "video"
                          ? "Ver vídeo"
                          : `Imagem ${idx + 1}`
                      }
                    >
                      {slide.type === "video" ? (
                        <FiPlay className="h-5 w-5 text-white" />
                      ) : (
                        <img
                          src={slide.src}
                          alt={`${product.name} - ${idx + 1}`}
                          className={`h-full w-full object-cover ${
                            isOutOfStock
                              ? "grayscale brightness-[0.9] saturate-0"
                              : ""
                          }`}
                          onError={(e) => {
                            e.target.className =
                              "h-full w-full object-contain bg-stone-200 p-2";
                          }}
                        />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-5 lg:space-y-6">
              <div className="flex flex-wrap items-center gap-2">
                {product.category && (
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold tracking-wide shadow-sm sm:text-sm ${
                      isOutOfStock
                        ? "bg-stone-200 text-stone-700"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        isOutOfStock ? "bg-stone-500" : "bg-yellow-500"
                      }`}
                    />
                    {product.category}
                  </span>
                )}

                {product.bath && (
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs sm:text-sm ${
                      isOutOfStock
                        ? "border border-stone-300 bg-stone-200 text-stone-700"
                        : visuals.badgeClass
                    }`}
                  >
                    <span
                      className={`h-2 w-2 rounded-full ${
                        isOutOfStock ? "bg-stone-500" : visuals.dotClass
                      }`}
                    />
                    {visuals.label}
                  </span>
                )}
              </div>

              <div className="space-y-3">
                <h1
                  className={`font-serif text-[2rem] italic leading-[1.04] tracking-tight sm:text-[2.35rem] xl:text-[2.75rem] ${
                    isOutOfStock ? "text-stone-700" : "text-stone-900"
                  }`}
                >
                  {product.name}
                </h1>

                <div className="flex flex-wrap items-center gap-3">
                  <span
                    className={`text-[2rem] font-bold tracking-tight sm:text-[2.3rem] ${
                      isOutOfStock ? "text-stone-500" : visuals.priceText
                    }`}
                  >
                    R$ {product.price.toFixed(2).replace(".", ",")}
                  </span>

                  {product.partCode && (
                    <span className="rounded-full bg-stone-100/90 px-3 py-1.5 text-xs text-stone-600 sm:text-sm">
                      Código:{" "}
                      <strong className="font-semibold text-stone-800">
                        {product.partCode}
                      </strong>
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-3">
                <div className="rounded-2xl border border-stone-200 bg-stone-50/70 p-4">
                  <span className="text-[11px] uppercase tracking-[0.2em] text-stone-400 sm:text-xs">
                    Acabamento / Metal
                  </span>
                  <p
                    className={`mt-2 font-serif text-base italic leading-relaxed sm:text-[1.03rem] ${
                      isOutOfStock ? "text-stone-600" : "text-stone-800"
                    }`}
                  >
                    {bathText}
                  </p>
                </div>

                <div className="rounded-2xl border border-stone-200 bg-stone-50/70 p-4">
                  <span className="text-[11px] uppercase tracking-[0.2em] text-stone-400 sm:text-xs">
                    Estoque
                  </span>
                  <div className="mt-2">
                    {product.stock > 0 ? (
                      <span className="inline-flex rounded-full border border-green-200 bg-green-50 px-3 py-1.5 text-sm font-medium text-green-700">
                        Disponível em estoque
                      </span>
                    ) : (
                      <span className="inline-flex rounded-full border border-stone-300 bg-stone-200 px-3 py-1.5 text-sm font-medium text-stone-700">
                        Indisponível
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {product.description && (
                <div className="rounded-2xl border border-stone-200 bg-white p-4 sm:p-5">
                  <span className="text-[11px] uppercase tracking-[0.2em] text-stone-400 sm:text-xs">
                    Descrição
                  </span>
                  <p
                    className={`mt-2 text-sm leading-7 sm:text-[1rem] ${
                      isOutOfStock ? "text-stone-500" : "text-stone-700"
                    }`}
                  >
                    {product.description}
                  </p>
                </div>
              )}

              {hasSizes && (
                <div className="rounded-2xl border border-stone-200 bg-stone-50/60 p-4 sm:p-5">
                  <SizeSelector
                    sizes={product.sizes}
                    selectedSize={selectedSize}
                    onSelectSize={setSelectedSize}
                  />

                  <button
                    type="button"
                    onClick={() => setSizeGuideOpen(true)}
                    className="mt-3 inline-flex items-center gap-1.5 text-sm text-stone-500 transition-colors hover:text-yellow-700"
                  >
                    <TfiRuler className="h-3.5 w-3.5" />
                    Guia de medidas
                  </button>
                </div>
              )}

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <a
                  href={`https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
                    buildWhatsAppMsg()
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex min-h-[52px] items-center justify-center gap-2 rounded-full px-7 py-3 text-sm font-semibold text-white transition-all duration-300 focus:outline-none focus:ring-2 sm:px-9 sm:py-3.5 sm:text-base ${
                    isOutOfStock
                      ? "pointer-events-none cursor-not-allowed bg-stone-400 shadow-none focus:ring-stone-300"
                      : "bg-gradient-to-br from-yellow-500 via-amber-400 to-yellow-600 shadow-md hover:brightness-110 hover:shadow-lg focus:ring-yellow-300"
                  } ${hasSizes && !selectedSize ? "pointer-events-none opacity-50" : ""}`}
                  title={
                    isOutOfStock
                      ? "Produto indisponível"
                      : hasSizes && !selectedSize
                        ? "Selecione um tamanho antes de pedir"
                        : ""
                  }
                >
                  <FaWhatsapp className="text-base sm:text-lg" />
                  {isOutOfStock ? "Indisponível" : "Quero atendimento desta peça"}
                </a>

                <button
                  type="button"
                  onClick={onClose}
                  className="text-xs text-stone-600 underline decoration-stone-300 underline-offset-2 hover:text-stone-800 sm:text-sm"
                >
                  Voltar ao catálogo
                </button>

                <ShareButton product={product} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <SizeGuideModal
        isOpen={sizeGuideOpen}
        onClose={() => setSizeGuideOpen(false)}
      />
    </div>
  );
};

export default ProductDetails;