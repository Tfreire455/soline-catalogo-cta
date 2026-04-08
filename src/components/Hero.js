// src/components/Hero.jsx
import React, { useEffect, useRef } from "react";
import { FiPhone, FiArrowDown } from "react-icons/fi";
import { gsap } from "../utils/gsapConfig";
import ImageHero from "../assets/gifImage.gif";
import ShinyText from "./ShineLetter";

const Hero = ({ phoneNumber }) => {
  const heroRef = useRef(null);
  const heroGlowRef = useRef(null);
  const telHref = `tel:+${phoneNumber}`;

  useEffect(() => {
    if (heroRef.current) {
      gsap.from(heroRef.current.querySelectorAll("h2, p, a, .hero-kicker"), {
        opacity: 0,
        y: 36,
        duration: 1,
        stagger: 0.15,
        ease: "power3.out",
        delay: 0.2,
      });
    }

    if (heroGlowRef.current) {
      gsap.to(heroGlowRef.current, {
        scale: 1.08,
        duration: 6,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative min-h-[100svh] flex items-center justify-center overflow-hidden pt-24 sm:pt-28"
    >
      <div className="absolute inset-0 bg-gradient-to-t from-[#fff]/95 via-[#fff]/82 to-[#fff]/45 z-10" />
      <div
        style={{ backgroundImage: `url(${ImageHero})` }}
        className="absolute inset-0 bg-cover bg-no-repeat bg-center opacity-60"
      />
      <div
        ref={heroGlowRef}
        className="pointer-events-none absolute -bottom-20 right-[-40px] w-64 h-64 md:w-80 md:h-80 rounded-full bg-gradient-to-tr from-yellow-300 via-amber-400 to-orange-500 blur-3xl opacity-60"
      />
      <div className="relative z-20 text-center px-4 sm:px-6 max-w-4xl mx-auto">
        <span className="hero-kicker inline-flex items-center justify-center gap-3 luxury-kicker mb-5 sm:mb-6">
          <span className="h-px w-8 sm:w-10 bg-amber-400/70" />
          coleção que valoriza sua presença
          <span className="h-px w-8 sm:w-10 bg-amber-400/70" />
        </span>

        <h2 className="text-[3rem] sm:text-[4.4rem] lg:text-[5.8rem] font-semibold text-center text-[#DDAF17] leading-[0.95] tracking-tight">
          <ShinyText text="Joias que Inspiram" speed={6} />
        </h2>

        <p className="luxury-copy max-w-2xl lg:max-w-3xl mx-auto mt-6 mb-8 px-1">
          Descubra peças que elevam o visual, destacam sua personalidade e transformam o simples em memorável. Cada detalhe foi pensado para fazer você se sentir ainda mais elegante ao vestir.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 pt-2 justify-center items-center">
          <a
            href={telHref}
            className="w-full sm:w-auto relative inline-flex items-center justify-center gap-3 px-8 sm:px-10 py-4 text-base sm:text-lg font-semibold text-white bg-gradient-to-br from-yellow-500 via-amber-400 to-yellow-600 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400"
          >
            <FiPhone className="text-xl" />
            <span>Quero meu atendimento</span>
          </a>

          <a
            href="#colecoes"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 sm:px-10 py-4 text-base sm:text-lg font-medium text-yellow-700 border border-yellow-500/30 bg-white/75 backdrop-blur-sm rounded-full hover:bg-yellow-50 hover:border-yellow-500 transition-all duration-300 hover:-translate-y-1 shadow-sm hover:shadow-md"
          >
            <span>Explorar coleções</span>
            <FiArrowDown className="text-lg animate-bounce" style={{ animationDuration: "2s" }} />
          </a>
        </div>

        <p className="mt-5 text-sm sm:text-base text-stone-500">
          Atendimento próximo, peças selecionadas e ajuda para escolher o modelo ideal.
        </p>
      </div>
    </section>
  );
};

export default Hero;
