import React, { useState } from "react";
import { FiChevronLeft, FiChevronRight, FiX } from "react-icons/fi";
import { getValidImageUrls } from "../utils/catalogHelpers";
import MaterialFilter from "./MaterialFilter";
import ResultsCounter from "./ResultsCounter";
import ProductItem from "./ProductItem";
import SizeGuideModal from "./SizeGuideModal";

const Catalog = ({
  categories,
  selectedCategory,
  onSelectCategory,
  selectedCollection,
  onClearCollection,
  selectedMaterial,
  onSelectMaterial,
  searchQuery,
  onSearchChange,
  paginatedProducts,
  filteredTotal,
  totalPages,
  currentPage,
  onPageChange,
  onImageClick,
  onDetailsClick,
  whatsappPhone,
}) => {
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);

  const handlePageChange = (page) => {
    onPageChange(page);
    setTimeout(() => {
      const el = document.getElementById("catalogo");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }, 50);
  };

  const renderProducts = (items) =>
    items.map((product, index) => {
      const mediaEntries = getValidImageUrls(product);
      return (
        <ProductItem
          key={`${product.partCode}-${index}`}
          product={product}
          index={index}
          mediaEntries={mediaEntries}
          onImageClick={onImageClick}
          onDetailsClick={onDetailsClick}
          onOpenSizeGuide={() => setSizeGuideOpen(true)}
          whatsappPhone={whatsappPhone}
        />
      );
    });

  return (
    <section id="catalogo" className="py-14 sm:py-16 lg:py-20 px-4 sm:px-6 md:px-10 bg-[#fff]">
      <div className="section-shell">
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
          <span className="luxury-kicker inline-block mb-4">catálogo completo</span>
          <h2 className="section-title text-3xl sm:text-4xl lg:text-5xl font-serif text-center mb-4 text-stone-900 leading-tight">
            Escolha a peça que combina com o seu momento
          </h2>
          <p className="luxury-copy px-1">
            Navegue com calma, compare estilos e encontre a joia certa para presentear ou realçar sua presença com mais sofisticação.
          </p>
        </div>

        {selectedCollection && (
          <div className="mb-8 flex justify-center">
            <div className="inline-flex items-center gap-3 bg-stone-900 text-white px-5 py-3 rounded-full shadow-lg animate-fade-in-up max-w-full">
              <span className="text-sm sm:text-base font-medium text-center">
                Exibindo a coleção <span className="text-yellow-400 font-semibold">{selectedCollection}</span>
              </span>
              <button
                onClick={onClearCollection}
                className="bg-white/20 hover:bg-white/30 rounded-full p-1.5 transition-colors shrink-0"
                title="Limpar filtro de coleção"
              >
                <FiX className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        <MaterialFilter selectedMaterial={selectedMaterial} onSelectMaterial={onSelectMaterial} />


        <div className="mb-8 sm:mb-12 px-1">
          <div className="mb-4 w-full max-w-xl mx-auto">
            <input
              type="text"
              placeholder="Busque por nome, estilo ou código da peça"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full px-5 py-3.5 rounded-full border border-stone-300 text-sm sm:text-base lg:text-[1.05rem] focus:ring-2 focus:ring-yellow-500 focus:outline-none transition placeholder:text-stone-400 bg-white/95 shadow-sm"
            />
          </div>

          <div className="flex flex-wrap justify-center gap-2.5 sm:gap-3.5 md:gap-4.5 max-w-5xl mx-auto">
            <button
              onClick={() => onSelectCategory(null)}
              className={`category-btn px-4 py-2.5 sm:px-5 sm:py-3 rounded-full text-sm sm:text-base transition whitespace-nowrap ${
                !selectedCategory
                  ? "bg-yellow-500 text-white font-semibold shadow"
                  : "bg-stone-100 text-stone-800 hover:bg-stone-200"
              }`}
            >
              Todos
            </button>

            {categories.map((catName) => (
              <button
                key={catName}
                onClick={() => onSelectCategory(catName)}
                className={`category-btn px-4 py-2.5 sm:px-5 sm:py-3 rounded-full text-sm sm:text-base transition whitespace-nowrap ${
                  selectedCategory === catName
                    ? "bg-yellow-500 text-white font-semibold shadow"
                    : "bg-stone-100 text-stone-800 hover:bg-stone-200"
                }`}
              >
                {catName}
              </button>
            ))}
          </div>
        </div>

        <ResultsCounter total={filteredTotal} showing={paginatedProducts.length} searchQuery={searchQuery} />

        <div className="space-y-12 sm:space-y-16 lg:space-y-20">
          {paginatedProducts.length > 0 ? (
            <>
              {renderProducts(paginatedProducts)}
            </>
          ) : (
            <div className="text-center py-20 text-stone-500">
              <p className="text-xl sm:text-2xl font-serif italic text-stone-700">
                Nenhuma peça apareceu com os filtros atuais.
              </p>
              <p className="mt-3 text-sm sm:text-base text-stone-500">
                Limpe os filtros e explore novamente para descobrir outras opções.
              </p>
              {(selectedCollection || selectedCategory || selectedMaterial) && (
                <button
                  onClick={() => {
                    onClearCollection();
                    onSelectCategory(null);
                    onSelectMaterial(null);
                    onSearchChange("");
                  }}
                  className="mt-5 text-yellow-700 text-sm sm:text-base underline underline-offset-4"
                >
                  Limpar todos os filtros
                </button>
              )}
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-10 sm:mt-14 gap-2 sm:gap-4 flex-wrap px-2">
            <button
              onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 sm:p-2.5 rounded-full bg-stone-200 text-stone-800 hover:bg-stone-300 disabled:opacity-50 transition-all"
              aria-label="Página anterior"
            >
              <FiChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => {
              const page = i + 1;
              if (page >= currentPage - 2 && page <= currentPage + 2) {
                return (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3.5 py-2 sm:px-4.5 sm:py-2.5 rounded-full text-sm sm:text-base font-medium transition-all ${
                      currentPage === page
                        ? "bg-yellow-500 text-white shadow-md"
                        : "bg-stone-100 text-stone-800 hover:bg-stone-200"
                    }`}
                  >
                    {page}
                  </button>
                );
              }
              return null;
            })}

            <button
              onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2 sm:p-2.5 rounded-full bg-stone-200 text-stone-800 hover:bg-stone-300 disabled:opacity-50 transition-all"
              aria-label="Próxima página"
            >
              <FiChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        )}
      </div>

      <SizeGuideModal isOpen={sizeGuideOpen} onClose={() => setSizeGuideOpen(false)} />
    </section>
  );
};

export default Catalog;
