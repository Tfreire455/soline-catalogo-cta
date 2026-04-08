// src/components/ProductItem.js
import React, { useState, useRef, useEffect } from "react";
import { FiChevronLeft, FiChevronRight, FiPlay } from "react-icons/fi";
import { TfiRuler } from "react-icons/tfi";
import { FaWhatsapp } from "react-icons/fa";
import {
  getMaterialVisuals,
  getMaterialDescription,
  getDriveFileId,
  getDriveVideoEmbedUrl,
} from "../utils/catalogHelpers";
import { gsap, ScrollTrigger } from "../utils/gsapConfig";
import SizeSelector from "./SizeSelector";
import ShareButton from "./ShareButton";
import ImageSkeleton from "./ImageSkeleton";

const ProductItem = ({
  product,
  index,
  mediaEntries, // [{ url: string, isVideo: boolean }]
  onImageClick,
  onDetailsClick,
  onOpenSizeGuide,
  whatsappPhone,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);
  const [imageLoaded, setImageLoaded] = useState({});
  const itemRef = useRef(null);
  const visuals = getMaterialVisuals(product.bath);

  // Vídeo dedicado da coluna videoUrl (sempre como último slide, se existir)
  const dedicatedVideoEmbed = product.videoUrl
    ? getDriveVideoEmbedUrl(product.videoUrl)
    : null;

  // Monta lista de slides: entradas da coluna imageUrl + vídeo dedicado
  const slides = [
    ...mediaEntries,
    ...(dedicatedVideoEmbed
      ? [{ url: dedicatedVideoEmbed, isVideo: true, isDedicated: true }]
      : []),
  ];

  const totalSlides = slides.length;

  useEffect(() => {
    const el = itemRef.current?.querySelector(".product-info");
    if (!el) return;

    const anim = gsap.fromTo(
      el,
      { opacity: 0, y: 50 },
      {
        scrollTrigger: {
          trigger: itemRef.current,
          start: "top 90%",
          toggleActions: "play none none none",
          once: true,
        },
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
      }
    );

    ScrollTrigger.refresh();

    return () => {
      anim.scrollTrigger?.kill();
    };
  }, []);

  const next = () =>
    setCurrentIndex((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));

  const prev = () =>
    setCurrentIndex((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));

  // Converte URL de imagem para thumbnail do Drive (800x800)
  const getThumbnailUrl = (url) => {
    const id = getDriveFileId(url);
    if (id) return `https://drive.google.com/thumbnail?id=${id}&sz=w800-h800`;
    return url;
  };

  // Monta mensagem do WhatsApp com tamanho selecionado
  const buildWhatsAppMsg = () => {
    let msg = `Olá, gostaria de mais informações sobre o produto: ${product.name} (Código: ${product.partCode})`;
    if (selectedSize) {
      msg += ` — Tamanho: ${selectedSize}`;
    }
    return msg;
  };

  const hasSizes = product.sizes && product.sizes.length > 0;
  const isOutOfStock = Number(product.stock) <= 0;

  return (
    <div
      ref={itemRef}
      className={`product-item relative flex flex-col ${
        index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
      } items-center gap-6 md:gap-10 lg:gap-12 py-6 ${isOutOfStock ? "opacity-95" : ""}`}
      itemScope
      itemType="https://schema.org/Product"
    >
      {/* Mídia (imagem ou vídeo) */}
      <div className={`product-image-container relative w-full md:w-1/2 lg:w-1/3 aspect-square rounded-3xl overflow-hidden shadow-xl ${isOutOfStock ? "bg-stone-200" : "bg-stone-100"}`}>
        {totalSlides > 0 ? (
          <>
            {slides.map((slide, idx) => {
              const embedUrl = slide.isVideo
                ? slide.isDedicated
                  ? slide.url
                  : getDriveVideoEmbedUrl(slide.url)
                : null;
              const thumbUrl = slide.isVideo
                ? null
                : getThumbnailUrl(slide.url);

              return slide.isVideo ? (
                <div
                  key={`slide-${idx}`}
                  className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                    idx === currentIndex ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <iframe
                    src={embedUrl}
                    title={`${product.name} - vídeo ${idx + 1}`}
                    allow="autoplay"
                    allowFullScreen
                    className="w-full h-full border-0"
                  />
                </div>
              ) : (
                <div
                  key={`slide-${idx}`}
                  className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                    idx === currentIndex ? "opacity-100" : "opacity-0"
                  }`}
                >
                  {!imageLoaded[idx] && idx === currentIndex && <ImageSkeleton />}
                  <img
                    src={thumbUrl}
                    alt={`${product.name} - ${idx + 1}`}
                    loading="lazy"
                    onClick={() => onImageClick(product, slide.url, idx)}
                    className={`absolute inset-0 object-cover w-full h-full cursor-pointer transition-all duration-300 ${
                      imageLoaded[idx] ? "opacity-100" : "opacity-0"
                    } ${isOutOfStock ? "grayscale brightness-[0.88] saturate-0" : ""}`}
                    onLoad={() =>
                      setImageLoaded((prev) => ({ ...prev, [idx]: true }))
                    }
                    onError={(e) => {
                      e.target.src = slide.url;
                      e.target.className =
                        "w-full h-full object-contain bg-stone-200 p-4";
                      setImageLoaded((prev) => ({ ...prev, [idx]: true }));
                    }}
                    itemProp="image"
                  />
                </div>
              );
            })}

            {/* Controles de navegação */}
            {totalSlides > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    prev();
                  }}
                  className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-yellow-600 p-2 rounded-full shadow-sm"
                >
                  <FiChevronLeft size={18} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    next();
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-yellow-600 p-2 rounded-full shadow-sm"
                >
                  <FiChevronRight size={18} />
                </button>

                <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
                  {slides.map((slide, idx) => (
                    <button
                      key={`dot-${idx}`}
                      onClick={() => setCurrentIndex(idx)}
                      title={slide.isVideo ? "Ver vídeo" : `Imagem ${idx + 1}`}
                      className={`w-2 h-2 rounded-full transition-all ${
                        idx === currentIndex
                          ? "bg-yellow-500 scale-125"
                          : "bg-stone-300"
                      }`}
                    >
                      {slide.isVideo && idx === currentIndex && (
                        <FiPlay className="w-1.5 h-1.5 text-white mx-auto" />
                      )}
                    </button>
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-stone-200 text-stone-500 text-xs">
            Sem imagem
          </div>
        )}
      </div>

      {/* Info */}
      <div
        className={`product-info w-full md:w-1/2 p-6 sm:p-8 lg:p-10 rounded-3xl border backdrop-blur-md shadow-[0_18px_48px_rgba(0,0,0,0.08)] ${
          isOutOfStock
            ? "border-stone-300 bg-stone-100/90 shadow-[0_12px_32px_rgba(0,0,0,0.06)]"
            : `${visuals.cardBorder} ${visuals.cardBg} ${visuals.glow}`
        }`}
      >
        <div className="space-y-4 sm:space-y-5">
          <div className="flex flex-wrap items-center gap-2">
            {product.category && (
              <span className={`${isOutOfStock ? "text-stone-700 bg-stone-200" : "text-yellow-800 bg-yellow-100"} px-3.5 py-1.5 text-xs sm:text-sm rounded-full font-semibold tracking-wide shadow-sm inline-block`}>
                {product.category}
              </span>
            )}
            {product.collection && (
              <span className={`${isOutOfStock ? "text-stone-600 bg-stone-200/90 border-stone-300" : "text-stone-700 bg-stone-100 border-stone-200"} px-3.5 py-1.5 text-xs sm:text-sm rounded-full font-semibold tracking-wide border inline-block`}>
                {product.collection}
              </span>
            )}
            {product.bath && (
              <span
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs sm:text-sm rounded-full ${isOutOfStock ? "bg-stone-200 text-stone-700 border border-stone-300" : visuals.badgeClass}`}
              >
                <span className={`w-2 h-2 rounded-full ${isOutOfStock ? "bg-stone-500" : visuals.dotClass}`} />
                {visuals.label}
              </span>
            )}
          </div>

          <h3
            className={`text-[1.85rem] sm:text-[2.4rem] lg:text-[2.8rem] font-serif italic leading-[1.05] tracking-tight ${isOutOfStock ? "text-stone-700" : "text-stone-900"}`}
            itemProp="name"
          >
            {product.name}
          </h3>

          <div className="flex items-center gap-3 flex-wrap">
            <span
              className={`text-2xl sm:text-3xl lg:text-[2rem] font-bold tracking-tight ${isOutOfStock ? "text-stone-500" : visuals.priceText}`}
            >
              R$ {product.price.toFixed(2).replace(".", ",")}
            </span>
            {product.stock > 0 ? (
              <span className="text-green-700 text-xs sm:text-sm font-medium bg-green-100 px-3 py-1 rounded-full shadow-sm">
                Disponível em estoque
              </span>
            ) : (
              <span className="text-stone-700 text-xs sm:text-sm font-medium bg-stone-200 px-3 py-1 rounded-full shadow-sm border border-stone-300">
                Indisponível
              </span>
            )}
          </div>

          {product.description && (
            <p
              className={`text-xs xs:text-sm sm:text-base leading-relaxed font-serif italic ${isOutOfStock ? "text-stone-500" : "text-stone-700"}`}
              itemProp="description"
            >
              {product.description}
            </p>
          )}

          <div className={`text-[11px] xs:text-xs flex flex-wrap gap-3 ${isOutOfStock ? "text-stone-500" : "text-stone-500"}`}>
            {product.partCode && (
              <span>
                Código:{" "}
                <strong className="text-stone-700">{product.partCode}</strong>
              </span>
            )}
            {product.bath && (
              <span className="italic">{getMaterialDescription(product.bath)}</span>
            )}
          </div>

          {/* Seletor de Tamanho */}
          {hasSizes && (
            <div className="pt-1">
              <SizeSelector
                sizes={product.sizes}
                selectedSize={selectedSize}
                onSelectSize={setSelectedSize}
                compact
              />
              <button
                type="button"
                onClick={onOpenSizeGuide}
                className="mt-1.5 inline-flex items-center gap-1 text-[10px] xs:text-xs text-stone-400 hover:text-yellow-600 transition-colors"
              >
                <TfiRuler className="w-3 h-3" />
                Guia de medidas
              </button>
            </div>
          )}

          <meta itemProp="sku" content={product.partCode} />
          <meta itemProp="priceCurrency" content="BRL" />
          <meta
            itemProp="price"
            content={product.price.toFixed(2).replace(",", ".")}
          />
          <meta
            itemProp="availability"
            content={
              product.stock > 0
                ? "https://schema.org/InStock"
                : "https://schema.org/OutOfStock"
            }
          />

          <div className="pt-3 flex flex-wrap items-center gap-2">
            <a
              href={`https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
                buildWhatsAppMsg()
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center justify-center gap-2 px-6 py-2.5 sm:px-8 sm:py-3 text-xs xs:text-sm sm:text-base font-serif italic text-white rounded-full transition-all duration-300 focus:outline-none focus:ring-2 ${
                isOutOfStock
                  ? "bg-stone-400 shadow-none pointer-events-none cursor-not-allowed focus:ring-stone-300"
                  : "bg-gradient-to-br from-yellow-500 via-amber-400 to-yellow-600 shadow-md hover:shadow-lg hover:brightness-110 focus:ring-yellow-300"
              } ${hasSizes && !selectedSize ? "opacity-50 pointer-events-none" : ""}`}
              title={
                isOutOfStock
                  ? "Produto indisponível"
                  : hasSizes && !selectedSize
                    ? "Selecione um tamanho antes de pedir"
                    : ""
              }
            >
              <FaWhatsapp className="text-base sm:text-lg" />
              {isOutOfStock ? "Indisponível" : "Realizar pedido"}
            </a>

            {onDetailsClick && (
              <button
                type="button"
                onClick={() => onDetailsClick(product)}
                className="text-[11px] xs:text-xs sm:text-sm text-yellow-700 underline underline-offset-2 decoration-yellow-400 hover:text-yellow-800"
              >
                Ver detalhes do produto
              </button>
            )}

            <ShareButton product={product} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductItem;
