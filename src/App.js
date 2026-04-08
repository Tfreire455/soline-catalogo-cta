/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-useless-escape */
import React, { useState, useEffect, useRef } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import HighlightsCarousel from "./components/HighlightsCarousel";
import CollectionsGrid from "./components/CollectionsGrid"; // NOVO COMPONENTE
import Catalog from "./components/Catalog";
import CTASection from "./components/CTASection";
import Footer from "./components/Footer";
import ImageModal from "./components/ImageModal";
import ProductDetails from "./components/ProductDetails";
import { gsap } from "./utils/gsapConfig";
import {
  normalize,
  parsePrice,
  parseSizes,
  getValidImageUrls,
  getViewUrl,
  getMaterialType,
} from "./utils/catalogHelpers";
import VipModal from "./components/VipModal";

// Variáveis de ambiente (CRA)
const API_KEY = process.env.REACT_APP_API_KEY;
const SPREADSHEET_ID = process.env.REACT_APP_SPREADSHEET_ID;
const SHEET_RANGE = process.env.REACT_APP_SHEET_RANGE;
const WHATSAPP_PHONE = process.env.REACT_APP_WHATSAPP_PHONE;

const App = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estados de Filtros
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedCollection, setSelectedCollection] = useState(null); // NOVO
  const [selectedMaterial, setSelectedMaterial] = useState(null); // NOVO - filtro material
  const [categories, setCategories] = useState([]);
  const [collections, setCollections] = useState([]); // NOVO

  // Estados de Imagem/Modal
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentProductImages, setCurrentProductImages] = useState([]);

  // Paginação e Busca
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [highlightIndex, setHighlightIndex] = useState(0);

  const bgBlob1Ref = useRef(null);
  const bgBlob2Ref = useRef(null);

  const itemsPerPage = 8; // Aumentei um pouco para ficar melhor na grade

  const targetUrl = process.env.REACT_APP_URL_BOT;

  // ---------------------------------------
  // Buscar produtos do Google Sheets
  // ---------------------------------------
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        if (!API_KEY || !SPREADSHEET_ID || !SHEET_RANGE) {
          console.error("Variáveis de ambiente do Sheets não configuradas.");
          setProducts([]);
          setCategories([]);
          setLoading(false);
          return;
        }

        const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${encodeURIComponent(
          SHEET_RANGE
        )}?key=${API_KEY}`;

        const res = await fetch(url);
        const data = await res.json();

        if (!data.values || data.values.length === 0) {
          setProducts([]);
          setCategories([]);
          setLoading(false);
          return;
        }

        const [headerRow, ...rows] = data.values;

        const lowerHeader = headerRow.map((h) =>
          normalize(h || "").trim().toLowerCase()
        );

        const findIndex = (...names) => {
          for (const name of names) {
            const idx = lowerHeader.indexOf(normalize(name));
            if (idx !== -1) return idx;
          }
          return -1;
        };

        const idxName = findIndex("name", "nome");
        const idxBath = findIndex("banho", "bath", "metal", "material", "acabamento");
        const idxSku = findIndex("sku", "codigo", "código", "partcode", "cod");
        const idxPrice = findIndex("price", "valor", "preço", "preco");
        const idxCategory = findIndex("category", "categoria");
        const idxCollection = findIndex("colecao", "coleção", "collection"); // NOVO
        const idxStock = findIndex("stock", "estoque", "qtd", "quantidade");
        const idxSize = findIndex("tamanho", "sizes", "tam", "medida"); // NOVO - tamanhos
        const idxImage = findIndex(
          "imageurl",
          "imagem",
          "image_url",
          "foto",
          "foto_url",
          "image"
        );
        const idxVideo = findIndex(
          "video",
          "videourl",
          "video_url",
          "link_video",
          "url_video"
        );
        const idxDesc = findIndex("description", "descrição", "descricao");

        const getValue = (row, idx) =>
          idx >= 0 && idx < row.length ? row[idx] || "" : "";

        const mapped = rows
          .map((row, i) => {
            const name = getValue(row, idxName);
            const bath = getValue(row, idxBath);
            const sku = getValue(row, idxSku);
            const price = parsePrice(getValue(row, idxPrice));
            const category = getValue(row, idxCategory);
            const collection = getValue(row, idxCollection); // NOVO
            const stock = Number(getValue(row, idxStock) || 0);
            const sizes = parseSizes(getValue(row, idxSize)); // NOVO - parseia tamanhos
            const img = getValue(row, idxImage);
            const video = getValue(row, idxVideo);
            const description = getValue(row, idxDesc);

            if (!name && !sku) return null;

            return {
              id: i + 1,
              name,
              bath,
              partCode: sku,
              price,
              category,
              collection, // NOVO
              stock,
              sizes, // NOVO - array de tamanhos
              description,
              imageUrl: img || "",
              videoUrl: video || "",
            };
          })
          .filter(Boolean);

        // Extrair Categorias Únicas
        const uniqueCategories = Array.from(
          new Set(mapped.map((p) => p.category).filter(Boolean))
        );

        // Extrair Coleções Únicas (NOVO)
        const uniqueCollections = Array.from(
          new Set(mapped.map((p) => p.collection).filter(Boolean))
        );

        setProducts(mapped);
        setCategories(uniqueCategories);
        setCollections(uniqueCollections); // NOVO
      } catch (err) {
        console.error("Erro ao carregar produtos do Sheets:", err);
        setProducts([]);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // ---------------------------------------
  // Destaques
  // ---------------------------------------
  const highlightedProducts = (() => {
    const byCategory = {};
    products.forEach((p) => {
      if (!p.category) return;
      const cat = p.category;
      if (!byCategory[cat]) {
        byCategory[cat] = p;
      } else {
        const current = byCategory[cat];
        const currentInStock = Number(current.stock) > 0;
        const nextInStock = Number(p.stock) > 0;

        if (
          (nextInStock && !currentInStock) ||
          (nextInStock === currentInStock &&
            (p.price > current.price ||
              (p.price === current.price && p.id > current.id)))
        ) {
          byCategory[cat] = p;
        }
      }
    });
    return Object.values(byCategory);
  })();

  const highlightCount = highlightedProducts.length;

  useEffect(() => {
    if (highlightCount <= 1) return;
    const interval = setInterval(() => {
      setHighlightIndex((prev) => (prev + 1) % highlightCount);
    }, 7000);
    return () => clearInterval(interval);
  }, [highlightCount]);

  // ---------------------------------------
  // GSAP (global)
  // ---------------------------------------
  useEffect(() => {
    if (loading) return;

    gsap.utils.toArray(".section-title").forEach((title) => {
      gsap.from(title, {
        scrollTrigger: {
          trigger: title,
          start: "top 80%",
          toggleActions: "play none none none",
        },
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: "back.out",
      });
    });

    if (bgBlob1Ref.current && bgBlob2Ref.current) {
      gsap.to(bgBlob1Ref.current, {
        x: 50,
        y: 40,
        duration: 18,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
      gsap.to(bgBlob2Ref.current, {
        x: -40,
        y: -30,
        duration: 20,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }

    gsap.from(".cta-section", {
      scrollTrigger: {
        trigger: ".cta-section",
        start: "top 80%",
        toggleActions: "play none none none",
      },
      opacity: 0,
      y: 150,
      duration: 1,
      ease: "power3.out",
    });
  }, [loading]);

  // ---------------------------------------
  // Imagens modal
  // ---------------------------------------
  const handleImageClick = (product, imageUrl, index) => {
    const images = getValidImageUrls(product);
    setCurrentProductImages(images);
    const viewUrl = getViewUrl(imageUrl);
    setSelectedImage(viewUrl);
    setCurrentImageIndex(index);
  };

  const closeModal = () => setSelectedImage(null);

  const nextImageModal = () => {
    const newIndex =
      currentImageIndex === currentProductImages.length - 1
        ? 0
        : currentImageIndex + 1;
    setCurrentImageIndex(newIndex);
    setSelectedImage(getViewUrl(currentProductImages[newIndex]));
  };

  const prevImageModal = () => {
    const newIndex =
      currentImageIndex === 0
        ? currentProductImages.length - 1
        : currentImageIndex - 1;
    setCurrentImageIndex(newIndex);
    setSelectedImage(getViewUrl(currentProductImages[newIndex]));
  };

  // ---------------------------------------
  // Lógica de Filtros (Cadeia de filtros)
  // ---------------------------------------
  
  // 1. Filtrar por Coleção (Se houver)
  const collectionFiltered = selectedCollection
    ? products.filter((p) => p.collection === selectedCollection)
    : products;

  // 2. Filtrar por Material (NOVO)
  const materialFiltered = selectedMaterial
    ? collectionFiltered.filter(
        (p) => getMaterialType(p.bath) === selectedMaterial
      )
    : collectionFiltered;

  // 3. Filtrar por Categoria (Sobre o resultado anterior)
  const categoryFiltered = selectedCategory
    ? materialFiltered.filter((p) => p.category === selectedCategory)
    : materialFiltered;

  // 4. Filtrar por Busca (Sobre o resultado anterior)
  const searchFilteredProducts = categoryFiltered.filter(
    (product) =>
      normalize(product.name).includes(normalize(searchQuery)) ||
      normalize(product.partCode).includes(normalize(searchQuery))
  );

  // 5. Priorizar peças disponíveis e enviar indisponíveis para o fim
  const filteredProducts = [...searchFilteredProducts].sort((a, b) => {
    const aInStock = Number(a.stock) > 0;
    const bInStock = Number(b.stock) > 0;

    if (aInStock !== bInStock) {
      return aInStock ? -1 : 1;
    }

    return a.id - b.id;
  });

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Scroll suave para o catálogo quando selecionar coleção
  const handleCollectionSelect = (collectionName) => {
    setSelectedCollection(collectionName);
    setSelectedCategory(null); // Reseta categoria para mostrar toda a coleção
    setSelectedMaterial(null); // Reseta material
    setCurrentPage(1);
    setSearchQuery("");
    
    // Pequeno delay para garantir que o state atualizou
    setTimeout(() => {
        const catalogSection = document.getElementById("catalogo");
        if (catalogSection) {
            catalogSection.scrollIntoView({ behavior: "smooth" });
        }
    }, 100);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#fff]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-amber-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fff] text-stone-800 relative overflow-hidden">
      <div className="pointer-events-none fixed inset-0 -z-10 opacity-70">
        <div
          ref={bgBlob1Ref}
          className="absolute -top-24 -left-16 w-56 h-56 xs:w-64 xs:h-64 md:w-80 md:h-80 bg-gradient-to-br from-yellow-200 via-amber-300 to-orange-400 blur-3xl rounded-full mix-blend-screen"
        />
        <div
          ref={bgBlob2Ref}
          className="absolute bottom-[-80px] right-[-40px] w-64 h-64 xs:w-72 xs:h-72 md:w-96 md:h-96 bg-gradient-to-tr from-amber-200 via-yellow-300 to-white blur-3xl rounded-full mix-blend-screen"
        />
      </div>

      <Header phoneNumber={WHATSAPP_PHONE} />
      <VipModal 
        botApiUrl={targetUrl} 
      />
      <Hero phoneNumber={WHATSAPP_PHONE} />

      <HighlightsCarousel
        highlightedProducts={highlightedProducts}
        highlightIndex={highlightIndex}
        onChangeHighlight={setHighlightIndex}
        onImageClick={handleImageClick}
        onSelectProduct={setSelectedProduct}
        whatsappPhone={WHATSAPP_PHONE}
      />

      {/* NOVA SEÇÃO DE COLEÇÕES */}
      <CollectionsGrid 
        collections={collections}
        products={products}
        onSelectCollection={handleCollectionSelect}
      />

      <Catalog
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          setCurrentPage(1);
        }}
        // Props de Coleção
        selectedCollection={selectedCollection}
        onClearCollection={() => setSelectedCollection(null)}
        // Props de Material (NOVO)
        selectedMaterial={selectedMaterial}
        onSelectMaterial={(mat) => {
          setSelectedMaterial(mat);
          setCurrentPage(1);
        }}
        
        searchQuery={searchQuery}
        onSearchChange={(value) => {
          setSearchQuery(value);
          setCurrentPage(1);
        }}
        paginatedProducts={paginatedProducts}
        filteredTotal={filteredProducts.length}
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        onImageClick={handleImageClick}
        onDetailsClick={setSelectedProduct}
        whatsappPhone={WHATSAPP_PHONE}
      />

      <CTASection phoneNumber={WHATSAPP_PHONE} />

      <Footer />

      <ImageModal
        selectedImage={selectedImage}
        onClose={closeModal}
        currentProductImages={currentProductImages}
        currentImageIndex={currentImageIndex}
        onPrev={prevImageModal}
        onNext={nextImageModal}
      />

      {selectedProduct && (
        <ProductDetails
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          whatsappPhone={WHATSAPP_PHONE}
        />
      )}
    </div>
  );
};

export default App;
