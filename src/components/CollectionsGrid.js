import React, { useEffect, useRef } from "react";
import { FiArrowRight } from "react-icons/fi";
import { getValidImageUrls, getViewUrl } from "../utils/catalogHelpers";
import { gsap } from "../utils/gsapConfig";

const CollectionsGrid = ({ collections, products, onSelectCollection }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (collections && collections.length > 0) {
      const ctx = gsap.context(() => {
        // Animação do Título (Fade Up suave)
        gsap.from(".collection-header-element", {
          scrollTrigger: {
            trigger: "#colecoes",
            start: "top 80%",
          },
          y: 60,
          opacity: 0,
          duration: 1.2,
          stagger: 0.2,
          ease: "power3.out",
        });

        // Animação dos Cards (Cascata elegante)
        gsap.from(".collection-card", {
          scrollTrigger: {
            trigger: ".collection-grid",
            start: "top 85%",
          },
          y: 100,
          opacity: 0,
          duration: 1.4,
          stagger: 0.15,
          ease: "power4.out",
        });
      }, containerRef);

      return () => ctx.revert();
    }
  }, [collections]);

  if (!collections || collections.length === 0) return null;

  return (
    <section
      id="colecoes"
      ref={containerRef}
      className="relative py-24 px-4 md:px-10 bg-[#fff] overflow-hidden"
    >
      {/* Background Decorativo Minimalista */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-stone-200 to-transparent opacity-60" />
      
      {/* Glows de fundo muito sutis */}
      <div className="absolute -left-40 top-20 w-[500px] h-[500px] bg-amber-50/50 rounded-full blur-[120px] pointer-events-none mix-blend-multiply" />
      <div className="absolute -right-40 bottom-20 w-[600px] h-[600px] bg-stone-50/80 rounded-full blur-[120px] pointer-events-none mix-blend-multiply" />

      <div className="max-w-[1400px] mx-auto relative z-10">
        
        {/* Cabeçalho Editorial */}
        <div className="text-center mb-20">
          <div className="collection-header-element inline-flex items-center gap-4 mb-6">
            <span className="h-px w-8 bg-amber-400"></span>
            <span className="text-amber-600 text-xs font-bold uppercase tracking-[0.3em]">
              Curadoria Exclusiva
            </span>
            <span className="h-px w-8 bg-amber-400"></span>
          </div>
          
          <h2 className="collection-header-element text-5xl md:text-6xl lg:text-7xl font-serif text-stone-900 mb-6 leading-[1.1]">
            Nossas <span className="italic font-light text-stone-400">Coleções</span>
          </h2>
          
          <p className="collection-header-element text-stone-500 text-base md:text-lg max-w-xl mx-auto font-light leading-relaxed">
            Cada coleção é um capítulo de elegância. Descubra peças desenhadas para eternizar momentos e expressar sua essência única.
          </p>
        </div>

        {/* Grid de Cards */}
        <div className="collection-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {collections.map((collectionName) => {
            // Lógica para encontrar imagem de capa ou fallback
            const coverProduct = products.find(
              (p) =>
                p.collection === collectionName &&
                (p.imageUrl || (p.imageUrls && p.imageUrls.length > 0))
            );

            const fallbackProduct = products.find(
              (p) => p.collection === collectionName
            );
            const productToUse = coverProduct || fallbackProduct;

            const images = productToUse ? getValidImageUrls(productToUse) : [];
            const coverImage = images.length > 0 ? getViewUrl(images[0]) : null;

            // Contagem de itens
            const itemCount = products.filter(
              (p) => p.collection === collectionName
            ).length;

            return (
              <div
                key={collectionName}
                onClick={() => onSelectCollection(collectionName)}
                className="collection-card group relative h-[500px] md:h-[550px] w-full rounded-[20px] overflow-hidden cursor-pointer isolate"
              >
                {/* Imagem de Fundo com Zoom Lento */}
                <div className="absolute inset-0 bg-stone-200 overflow-hidden">
                  {coverImage ? (
                    <img
                      src={coverImage}
                      alt={`Coleção ${collectionName}`}
                      className="w-full h-full object-cover transition-transform duration-[1.8s] ease-in-out group-hover:scale-110 will-change-transform"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-stone-100 text-stone-300 gap-4">
                      <span className="text-6xl opacity-30 font-serif italic">S</span>
                      <span className="text-[10px] uppercase tracking-widest opacity-60">
                        Imagem Indisponível
                      </span>
                    </div>
                  )}
                </div>

                {/* Overlay Gradiente Profissional */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-70 transition-opacity duration-700" />
                
                {/* Overlay de Cor no Hover (Sutil Tint Dourado) */}
                <div className="absolute inset-0 bg-amber-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 mix-blend-overlay" />

                {/* Badge Superior */}
                <div className="absolute top-6 left-6 z-20 overflow-hidden">
                  <div className="bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] font-medium uppercase tracking-wider px-3 py-1.5 rounded-full transform -translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out delay-100">
                    {itemCount} {itemCount === 1 ? "Item" : "Itens"} Exclusivos
                  </div>
                </div>

                {/* Conteúdo Inferior */}
                <div className="absolute bottom-0 left-0 w-full p-8 z-20 flex flex-col items-start">
                  
                  {/* Linha Decorativa */}
                  <div className="w-12 h-0.5 bg-amber-400 mb-4 transform scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-700 ease-out delay-100" />

                  <h3 className="text-3xl md:text-4xl font-serif text-white italic mb-2 drop-shadow-sm transform translate-y-2 group-hover:translate-y-0 transition-transform duration-700">
                    {collectionName}
                  </h3>
                  
                  {/* Botão "Explorar" Animado */}
                  <div className="h-0 opacity-0 group-hover:h-auto group-hover:opacity-100 overflow-hidden transition-all duration-700 delay-150">
                    <button className="flex items-center gap-3 text-white/90 text-xs uppercase tracking-widest font-semibold mt-4 group/btn">
                      Explorar
                      <span className="bg-white/20 rounded-full p-2 text-white transition-all duration-300 group-hover/btn:bg-amber-500 group-hover/btn:text-white group-hover/btn:translate-x-1">
                        <FiArrowRight size={14} />
                      </span>
                    </button>
                  </div>
                </div>

                {/* Borda Interna (Frame) */}
                <div className="absolute inset-4 border border-white/10 rounded-2xl pointer-events-none transition-colors duration-700 group-hover:border-white/30" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CollectionsGrid;