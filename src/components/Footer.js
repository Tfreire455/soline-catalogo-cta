// src/components/Footer.jsx
import React from "react";

const Footer = () => {
  return (
    <footer className="py-7 sm:py-9 px-4 sm:px-6 md:px-10 text-center text-sm sm:text-base text-stone-500 bg-[#fff] border-t border-stone-200">
      <p className="text-stone-600">© {new Date().getFullYear()} Soline Semijoias. Todos os direitos reservados.</p>
      <p className="mt-2 text-xs sm:text-sm text-stone-400">
        Catálogo online com seleção pensada para encantar em cada detalhe.
      </p>
    </footer>
  );
};

export default Footer;
