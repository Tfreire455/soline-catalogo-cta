// src/components/Header.jsx
import React, { useState } from "react";
import { FiInstagram, FiPhone } from "react-icons/fi";

const Header = ({ phoneNumber }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const telHref = `tel:+${phoneNumber}`;

  return (
    <header className="py-3 px-4 sm:px-5 md:px-10 border-b border-amber-500/15 bg-white/95 backdrop-blur-md fixed w-full z-50 shadow-[0_8px_24px_rgba(0,0,0,0.06)]">
      <div className="flex justify-between items-center max-w-7xl mx-auto gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <img
            className="w-9 sm:w-10 md:w-11 shrink-0"
            src="/logo-soline.png"
            alt="logo"
          />
          <div className="flex flex-col leading-tight min-w-0">
            <span className="text-lg sm:text-xl md:text-[1.9rem] font-serif tracking-[0.02em] text-stone-900 truncate">
              Soline Semijoias
            </span>
            <span className="text-[10px] sm:text-[11px] text-stone-500 uppercase tracking-[0.28em]">
              elegância para todos os momentos
            </span>
          </div>
        </div>

        <button
          className="md:hidden text-stone-800 focus:outline-none rounded-full p-2 border border-stone-200 bg-white/80 shadow-sm"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          aria-label="Abrir menu"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {mobileMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>

        <nav className="hidden md:flex items-center space-x-8 text-[15px] lg:text-base text-stone-700">
          <a href="#destaques" className="relative pb-1 hover:text-yellow-600 transition">
            Destaques
          </a>
          <a href="#catalogo" className="relative pb-1 hover:text-yellow-600 transition">
            Catálogo
          </a>
          <a
            href="https://www.instagram.com/solinesemijoias/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-yellow-600 transition flex items-center gap-2"
          >
            <FiInstagram className="text-lg" />
            Instagram
          </a>
          <a
            href={telHref}
            className="bg-gradient-to-r italic from-yellow-500 via-amber-400 to-yellow-600 hover:brightness-110 px-5 py-2.5 rounded-full transition text-white font-semibold flex items-center gap-2 shadow-sm"
          >
            <FiPhone /> Falar com a Soline
          </a>
        </nav>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-white/97 backdrop-blur-md absolute top-full left-0 right-0 py-4 px-4 shadow-[0_16px_30px_rgba(0,0,0,0.12)] border-b border-stone-200">
          <div className="flex flex-col space-y-3 text-[15px] text-stone-700">
            <a
              href="#destaques"
              className="py-2.5 border-b border-stone-100 flex justify-between items-center"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span>Destaques</span>
              <span className="text-[11px] text-stone-500">peças em evidência</span>
            </a>
            <a
              href="#catalogo"
              className="py-2.5 border-b border-stone-100 flex justify-between items-center"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span>Catálogo</span>
              <span className="text-[11px] text-stone-500">veja toda a coleção</span>
            </a>
            <a
              href="https://www.instagram.com/solinesemijoias/"
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 border-b border-stone-100 flex items-center justify-between"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span>Instagram</span>
              <FiInstagram className="text-lg text-yellow-600" />
            </a>
            <a
              href={telHref}
              className="bg-gradient-to-r from-yellow-500 via-amber-400 to-yellow-600 px-4 py-3 rounded-full transition text-white font-semibold flex items-center justify-center gap-2 shadow-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              <FiPhone /> Receber atendimento
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
