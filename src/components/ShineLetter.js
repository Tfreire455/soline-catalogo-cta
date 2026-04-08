// ShinyText.jsx
import React from "react";

const ShinyText = ({ text, speed = 5, className = "" }) => {
  const animationDuration = `${speed}s`;
  if (!text) return null;

  const tokens = text.split(/(\s+)/);

  return (
    <span
      className={`inline-block leading-tight tracking-wide ${className}`}
      style={{
        fontFamily: '"Cormorant", serif',
        position: "relative",
        display: "inline-block",
        perspective: "800px"
      }}
    >
      {tokens.map((token, index) => {
        if (/^\s+$/.test(token)) return <span key={index}>{token}</span>;

        return (
          <span
            key={index}
            className="relative inline-block whitespace-nowrap shiny-3d-word"
          >
            {/* Camada de profundidade 3D */}
            <span className="absolute inset-0 text-[#d1a64b] shiny-3d-depth">
              {token}
            </span>

            {/* Texto dourado principal */}
            <span className="relative text-[#f6d26b] text-gold-shadow-strong">
              {token}
            </span>

            {/* Brilho animado */}
            <span
              className="absolute inset-0 text-transparent bg-clip-text pointer-events-none shiny-layer"
              style={{ animationDuration }}
            >
              {token}
            </span>
          </span>
        );
      })}
    </span>
  );
};

export default ShinyText;
