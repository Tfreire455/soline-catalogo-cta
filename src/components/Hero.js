// src/components/Hero.jsx
import React, { useEffect, useRef } from "react";
import { FiArrowDown } from "react-icons/fi";
import { gsap } from "../utils/gsapConfig";
import ImageHero from "../assets/gifImage.gif";
import ShinyText from "./ShineLetter";

const Hero = ({ phoneNumber }) => {
  const heroRef = useRef(null);
  const heroGlowRef = useRef(null);

  useEffect(() => {
    if (heroRef.current) {
      gsap.from(heroRef.current.querySelectorAll("h2, p, a, .hero-kicker"), {
        opacity: 100,
        y: 36,
        duration: 1,
        stagger: 0.15,
        ease: "power3.out",
        delay: 0.2,
      });
    }

    if (heroGlowRef.current) {
      gsap.to(heroGlowRef.current, {
        scale: 1.01,
        duration: 3,
        repeat: -1,
        yoyo: false,
        ease: "sine.inOut",
      });
    }
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative flex min-h-[100vh] items-center justify-center overflow-hidden pt-14 sm:pt-20 lg:pt-24"
    >
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#fff]/95 via-[#fff]/82 to-[#fff]/45" />

      <div
        style={{ backgroundImage: `url(${ImageHero})` }}
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-60"
      />

      <div
        ref={heroGlowRef}
        className="pointer-events-none absolute -bottom-20 right-[-40px] h-64 w-64 rounded-full bg-gradient-to-tr from-yellow-300 via-amber-400 to-orange-500 blur-3xl opacity-60 md:h-80 md:w-80"
      />

      <div className="relative z-20 mx-auto flex min-h-[100vh] w-full max-w-4xl flex-col items-center justify-center px-4 text-center sm:px-6">
        <span className="hero-kicker mb-5 inline-flex flex-wrap items-center justify-center gap-3 luxury-kicker sm:mb-6">
          <span className="h-px w-8 bg-amber-400/70 sm:w-10" />
          <span className="text-center">coleção que valoriza sua presença</span>
          <span className="h-px w-8 bg-amber-400/70 sm:w-10" />
        </span>

        <h2 className="mb-8 text-center text-[3rem] font-semibold italic leading-[0.95] tracking-tight text-[#DDAF17] sm:text-[4.4rem] lg:text-[5.8rem]">
          <span className="flex justify-center text-center">
            <ShinyText text="Joias que Inspiram" speed={6} />
          </span>
        </h2>

        <div className="flex w-full flex-col items-center justify-center pt-1">
          <a
            href="#colecoes"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-yellow-500/30 bg-white/75 px-8 py-4 text-base font-medium text-yellow-700 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-yellow-500 hover:bg-yellow-50 hover:shadow-md sm:w-auto sm:px-10 sm:text-lg"
          >
            <span>Explorar coleções</span>
            <FiArrowDown
              className="animate-bounce text-lg"
              style={{ animationDuration: "2s" }}
            />
          </a>

          <p className="mt-10 max-w-2xl text-center text-sm text-stone-500 sm:mt-6 sm:text-base">
            Atendimento próximo, peças selecionadas e ajuda para escolher o
            modelo ideal.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Hero;