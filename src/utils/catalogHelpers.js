// src/utils/catalogHelpers.js

// Normaliza texto (para buscas, etc)
export const normalize = (str) =>
  (str || "")
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

// Converte preço de string ("R$ 123,45") para número
export const parsePrice = (value) => {
  if (value == null) return 0;
  if (typeof value === "number") return value;
  const str = String(value)
    .replace("R$", "")
    .replace(/\./g, "")
    .replace(",", ".")
    .trim();
  const n = parseFloat(str);
  return Number.isNaN(n) ? 0 : n;
};

// Parseia tamanhos da célula da planilha ("14, 16, 18" => ["14","16","18"])
export const parseSizes = (value) => {
  const text = String(value ?? "").trim();
  if (!text) return [];

  return text
    .split(/[,;|]/)
    .map((s) => s.trim())
    .filter(Boolean);
};

// Formata preço para exibição
export const formatPrice = (price) => {
  if (!price && price !== 0) return "Sob consulta";
  return `R$ ${price.toFixed(2).replace(".", ",")}`;
};

// ─── Material / Acabamento ──────────────────────────────────────────────────

// Detecta tipo de material a partir do campo "banho"/"material"
export const getMaterialType = (bath) => {
  const b = normalize(bath || "");
  if (b.includes("ouro")) return "ouro";
  if (b.includes("prata")) return "prata";
  return "outro";
};

// Diferencia visualmente Banhado a Ouro x Prata 925
export const getMaterialVisuals = (bath) => {
  const type = getMaterialType(bath);

  if (type === "ouro") {
    return {
      label: "Banhado a Ouro",
      badgeClass:
        "bg-amber-100/90 text-amber-800 border border-amber-300 shadow-xs",
      cardBorder: "border-amber-200",
      cardBg: "bg-amber-50/40",
      priceText: "text-amber-600",
      glow: "shadow-[0_18px_45px_rgba(245,158,11,0.35)]",
      dotClass: "bg-amber-500",
    };
  }

  if (type === "prata") {
    return {
      label: "Prata 925",
      badgeClass:
        "bg-slate-100/90 text-slate-800 border border-slate-300 shadow-xs",
      cardBorder: "border-slate-200",
      cardBg: "bg-slate-50/60",
      priceText: "text-slate-700",
      glow: "shadow-[0_18px_45px_rgba(148,163,184,0.35)]",
      dotClass: "bg-slate-500",
    };
  }

  return {
    label: bath || "Joia",
    badgeClass:
      "bg-stone-100/90 text-stone-800 border border-stone-300 shadow-xs",
    cardBorder: "border-stone-200",
    cardBg: "bg-white/70",
    priceText: "text-stone-900",
    glow: "shadow-md",
    dotClass: "bg-stone-500",
  };
};

// Descrição textual do acabamento
export const getMaterialDescription = (bath) => {
  const type = getMaterialType(bath);

  if (!bath) return "Acabamento especial em semijoia de alta qualidade.";

  if (type === "ouro") {
    return "Banhado a ouro, com acabamento de alto brilho e durabilidade.";
  }

  if (type === "prata") {
    return "Prata 925 pura — brilho intenso, elegante e durável.";
  }

  return bath;
};

// ─── Utils de vídeo ─────────────────────────────────────────────────────────

// Detecta se uma entrada bruta da planilha representa um vídeo.
// Convenção: a célula contém a palavra "video" (ex: "video: https://...")
export const isVideoEntry = (rawEntry) => /\bvideo\b/i.test(rawEntry);

// Remove prefixo de marcação ("video:", "video|", "video ") e retorna a URL limpa
export const cleanEntryUrl = (rawEntry) =>
  rawEntry.replace(/^video\s*[:|]\s*/i, "").trim();

// ─── Utils do Google Drive ────────────────────────────────────────────────────

// Extrai o file ID de qualquer formato de link do Google Drive
export const getDriveFileId = (url) => {
  // Guard: garante que url seja sempre uma string válida
  if (!url || typeof url !== "string") return null;

  const patterns = [
    /[/]file[/]d[/]([^/?#]+)/,
    /[/]d[/]([^/?#]+)/,
    /id=([^&]+)/,
    /[/]uc[?]id=([^&]+)/,
    /[/]download[?]id=([^&]+)/,
    /[/]open[?]id=([^&]+)/,
    /[/]thumbnail[?]id=([^&]+)/,
    /drive\.google\.com[/]([^/?#]{25,})/,
    /drive\.usercontent\.google\.com[/]download[?]id=([^&]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) return match[1];
  }
  return null;
};

// Converte link do Drive para URL de thumbnail (imagem)
export const getViewUrl = (url) => {
  // Aceita string direta ou objeto { url, isVideo } vindo de getValidImageUrls
  const rawUrl = url && typeof url === "object" ? url.url : url;
  if (!rawUrl || typeof rawUrl !== "string") return "";
  const id = getDriveFileId(rawUrl);
  if (!id) return rawUrl;
  return `https://drive.google.com/thumbnail?id=${id}&sz=w1080-h1080`;
};

// Converte link do Drive para URL de embed de vídeo (iframe)
export const getDriveVideoEmbedUrl = (url) => {
  const rawUrl = url && typeof url === "object" ? url.url : url;
  if (!rawUrl || typeof rawUrl !== "string") return "";
  const id = getDriveFileId(rawUrl);
  if (!id) return rawUrl;
  return `https://drive.google.com/file/d/${id}/preview`;
};

// ─── getValidImageUrls ────────────────────────────────────────────────────────
// Retorna array de objetos { url: string, isVideo: boolean }
// Detecta vídeos pela palavra "video" na entrada bruta da célula da planilha.
export const getValidImageUrls = (product) => {
  try {
    const entries = [];

    const collect = (value) => {
      if (!value) return;
      const str = typeof value === "string" ? value : String(value);
      str
        .split(/[,;\n]/)
        .map((u) => u.trim())
        .filter(Boolean)
        .forEach((raw) => {
          const isVideo = isVideoEntry(raw);
          const cleanUrl = cleanEntryUrl(raw);
          if (cleanUrl) entries.push({ url: cleanUrl, isVideo });
        });
    };

    collect(product.imageUrl);

    if (product.imageUrls) {
      if (typeof product.imageUrls === "string") {
        collect(product.imageUrls);
      } else if (Array.isArray(product.imageUrls)) {
        product.imageUrls.forEach((u) => collect(String(u || "")));
      }
    }

    return entries;
  } catch (e) {
    console.error("Erro processando imagens:", e);
    return [];
  }
};
