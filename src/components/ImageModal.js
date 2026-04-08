// src/components/ImageModal.jsx
import React from "react";
import { FiChevronLeft, FiChevronRight, FiX } from "react-icons/fi";

// Detecta se a URL selecionada já é um embed de vídeo do Drive
const isEmbedVideo = (url) =>
  typeof url === "string" &&
  url.includes("drive.google.com/file/d/") &&
  url.includes("/preview");

const ImageModal = ({
  selectedImage,
  onClose,
  currentProductImages,
  currentImageIndex,
  onPrev,
  onNext,
}) => {
  if (!selectedImage) return null;

  const isVideo = isEmbedVideo(selectedImage);

  return (
    <div
      className="fixed inset-0 bg-black/90 flex justify-center items-center z-50 p-3 xs:p-4"
      onClick={onClose}
    >
      <div
        className="relative max-w-full max-h-full"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute -top-9 xs:-top-10 right-0 bg-white hover:bg-gray-100 text-black rounded-full p-1.5 xs:p-2 shadow-lg transition"
          aria-label="Fechar visualização"
        >
          <FiX size={18} className="xs:w-5 xs:h-5" />
        </button>

        <div className="relative">
          {isVideo ? (
            <iframe
              key={selectedImage}
              src={selectedImage}
              title="Vídeo do produto"
              allow="autoplay"
              allowFullScreen
              className="w-[92vw] max-w-2xl h-[56vw] max-h-[80vh] min-h-[220px] rounded-lg border-0 bg-black"
            />
          ) : (
            <img
              key={selectedImage}
              src={selectedImage}
              alt="Visualização ampliada do produto"
              className="max-w-[92vw] max-h-[80vh] object-contain rounded-lg"
            />
          )}

          {currentProductImages.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onPrev();
                }}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/55 text-white rounded-full p-1.5 xs:p-2 hover:bg-black/70 transition z-20"
              >
                <FiChevronLeft size={18} className="xs:w-5 xs:h-5" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onNext();
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/55 text-white rounded-full p-1.5 xs:p-2 hover:bg-black/70 transition z-20"
              >
                <FiChevronRight size={18} className="xs:w-5 xs:h-5" />
              </button>
              <div className="absolute bottom-2 xs:bottom-4 left-0 right-0 flex justify-center gap-1 xs:gap-2 z-20">
                {currentProductImages.map((_, idx) => (
                  <div
                    key={`modal-dot-${idx}`}
                    className={`w-1.5 h-1.5 xs:w-2.5 xs:h-2.5 rounded-full transition-all ${
                      idx === currentImageIndex ? "bg-white" : "bg-white/40"
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageModal;