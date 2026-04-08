// src/components/CTASection.jsx
import React from "react";
import { FiPhone, FiInstagram } from "react-icons/fi";
import ImgBg from "../assets/Ativo2.png";

const CTASection = ({ phoneNumber }) => {
  const normalizedPhone = String(phoneNumber || "").replace(/\D/g, "");
  const telHref = normalizedPhone ? `https://wa.me/${normalizedPhone}` : "#";

  return (
    <section className="cta-section relative overflow-hidden px-4 py-16 sm:px-6 md:px-10 lg:px-12">
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${ImgBg})` }}
      />

      <div className="absolute inset-0 z-0 bg-white/70 md:bg-white/68" />

      <div className="relative z-10 mx-auto max-w-4xl">
        <div className="rounded-[2rem] border border-[#e7d7a8] bg-white/78 px-5 py-10 shadow-[0_18px_50px_rgba(0,0,0,0.10)] backdrop-blur-sm sm:px-8 sm:py-12 md:px-12 md:py-14">
          <div className="mx-auto max-w-2xl text-center">
            <span className="mb-4 inline-block rounded-full border border-yellow-200 bg-yellow-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-yellow-700 sm:text-sm">
              Atendimento personalizado
            </span>

            <h2 className="mb-5 font-serif text-3xl italic leading-tight text-stone-900 sm:text-4xl md:text-5xl">
              Encontre a joia ideal para valorizar seu estilo
            </h2>

            <p className="mx-auto mb-8 italic max-w-2xl text-base leading-7 text-stone-700 sm:text-lg md:text-ml">
              Fale com a Soline Semijoias e receba atendimento direto para tirar
              dúvidas, escolher sua peça e finalizar seu pedido com mais
              praticidade.
            </p>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a
                href={telHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[56px] w-full items-center justify-center gap-3 rounded-full bg-gradient-to-r from-yellow-500 via-amber-400 to-yellow-600 px-7 py-4 text-base font-semibold text-white shadow-[0_10px_30px_rgba(217,119,6,0.28)] transition-all duration-300 hover:-translate-y-0.5 hover:brightness-105 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 sm:w-auto sm:px-9 sm:text-lg"
              >
                <FiPhone className="text-xl sm:text-2xl" />
                <span>Falar no WhatsApp</span>
              </a>

              <a
                href="https://www.instagram.com/solinesemijoias/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[56px] w-full items-center justify-center gap-3 rounded-full border border-yellow-300 bg-white px-7 py-4 text-base font-medium text-stone-800 shadow-sm transition-all duration-300 hover:border-yellow-500 hover:text-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 sm:w-auto sm:px-8 sm:text-lg"
              >
                <FiInstagram className="text-xl sm:text-2xl" />
                <span className="font-serif italic">Siga no Instagram</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;