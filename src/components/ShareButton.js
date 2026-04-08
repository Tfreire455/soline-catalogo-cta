// src/components/ShareButton.js
import React, { useState } from "react";
import { FiShare2, FiCheck } from "react-icons/fi";
import { formatPrice } from "../utils/catalogHelpers";

const ShareButton = ({ product, className = "" }) => {
  const [copied, setCopied] = useState(false);

  const shareText = `Confira essa peça: ${product.name} — ${formatPrice(product.price)} | Soline Semijoias`;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: shareText,
          url: window.location.href,
        });
      } catch {
        // usuário cancelou
      }
    } else {
      try {
        await navigator.clipboard.writeText(`${shareText}\n${window.location.href}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        // fallback
      }
    }
  };

  return (
    <button
      type="button"
      onClick={handleShare}
      className={`inline-flex items-center gap-1.5 text-stone-500 hover:text-yellow-600 transition-colors ${className}`}
      title="Compartilhar"
    >
      {copied ? (
        <>
          <FiCheck className="w-3.5 h-3.5 text-green-600" />
          <span className="text-[10px] xs:text-xs text-green-600">Copiado!</span>
        </>
      ) : (
        <>
          <FiShare2 className="w-3.5 h-3.5" />
          <span className="text-[10px] xs:text-xs">Compartilhar</span>
        </>
      )}
    </button>
  );
};

export default ShareButton;
