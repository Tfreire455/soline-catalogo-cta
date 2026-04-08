import React, { useState, useEffect } from "react";
import { X, Gift, Sparkles, CheckCircle, Loader2, CalendarHeart } from "lucide-react";

const customStyles = `
  .apple-glass {
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(20px) saturate(150%);
    -webkit-backdrop-filter: blur(20px) saturate(150%);
    border: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow: 
      0 30px 60px rgba(0, 0, 0, 0.15),
      inset 0 1px 0 rgba(255, 255, 255, 0.3),
      inset 0 0 20px rgba(255, 255, 255, 0.05);
  }

  .apple-input {
    width: 100%;
    min-width: 0;
    appearance: none;
    -webkit-appearance: none;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    color: #fff;
    box-shadow: inset 0 2px 4px rgba(0,0,0,0.05);
  }

  .apple-input:focus {
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(250, 178, 24, 0.6);
    box-shadow: 
      inset 0 2px 4px rgba(0,0,0,0.05),
      0 0 15px rgba(250, 178, 24, 0.2);
  }

  .apple-input::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }

  .apple-input[type="date"] {
    padding-right: 0.875rem;
    min-height: 56px;
    line-height: 1.2;
  }

  .apple-input[type="date"]::-webkit-datetime-edit {
    color: #fff;
    padding: 0;
  }

  .apple-input[type="date"]::-webkit-calendar-picker-indicator {
    filter: invert(1);
    opacity: 0.9;
    cursor: pointer;
    margin-left: 8px;
  }

  .shadow__btn {
    width: 100%;
    margin-top: 1rem;
    padding: 16px 20px;
    border: none;
    font-size: 16px;
    color: #fff;
    border-radius: 14px;
    letter-spacing: 2px;
    font-weight: 600;
    text-transform: uppercase;
    transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
    background: linear-gradient(135deg, #fab218, #fcf6ba, #fab218);
    background-size: 200% 200%;
    box-shadow: 
      0 10px 20px rgba(250, 178, 24, 0.3),
      inset 0 1px 0 rgba(255, 255, 255, 0.5);
    cursor: pointer;
    font-family: 'Outfit', sans-serif;
    position: relative;
    overflow: hidden;
    animation: gradientShift 4s ease infinite;
  }

  .shadow__btn:hover {
    box-shadow: 
      0 15px 25px rgba(250, 178, 24, 0.4),
      0 0 40px rgba(250, 178, 24, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.6);
    transform: translateY(-2px) scale(1.02);
  }

  .shadow__btn:active {
    transform: translateY(1px) scale(0.98);
    box-shadow: 0 5px 10px rgba(250, 178, 24, 0.3);
  }

  @keyframes gradientShift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }

  @keyframes popIn {
    0% { opacity: 0; transform: scale(0.9) translateY(20px); }
    100% { opacity: 1; transform: scale(1) translateY(0); }
  }

  .animate-popIn {
    animation: popIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }

  @keyframes liquidBlob {
    0%, 100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
    50% { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
  }

  .liquid-bg {
    animation: liquidBlob 8s ease-in-out infinite;
  }

  @media (max-width: 480px) {
    .shadow__btn {
      font-size: 14px;
      letter-spacing: 1.2px;
      padding: 15px 16px;
    }

    .apple-input[type="date"] {
      font-size: 14px;
    }
  }
`;

const VipModal = ({ botApiUrl }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [step, setStep] = useState("form");

  const [formData, setFormData] = useState({
    nome: "",
    whatsapp: "",
    nascimento: "",
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "whatsapp") {
      let v = value.replace(/\D/g, "");
      if (v.length > 11) v = v.slice(0, 11);
      setFormData({ ...formData, [name]: v });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStep("sending");

    try {
      const targetUrl =
        botApiUrl || process.env.REACT_APP_URL_BOT || "http://localhost:3000";

      const response = await fetch(`${targetUrl}/api/vip/cadastro`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setStep("success");
        setTimeout(() => {
          handleClose();
        }, 6000);
      } else {
        alert("Erro ao cadastrar. Tente novamente.");
        setStep("form");
      }
    } catch (error) {
      console.error(error);
      alert("Erro de conexão. Verifique sua internet.");
      setStep("form");
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setIsMinimized(true);
  };

  if (!isOpen) {
    if (!isMinimized) return null;

    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#222] apple-glass transition-transform duration-300 hover:scale-110 sm:h-16 sm:w-16 group"
        title="Ganhe um presente"
      >
        <Gift className="h-6 w-6 text-[#fab218] drop-shadow-lg transition-transform group-hover:rotate-12 sm:h-8 sm:w-8" />
        <span className="absolute -right-1 -top-1 flex h-4 w-4">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75"></span>
          <span className="relative inline-flex h-4 w-4 rounded-full border border-white/50 bg-amber-500 shadow-sm"></span>
        </span>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden p-3 sm:p-6">
      <style>{customStyles}</style>

      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-md transition-opacity duration-500"
        onClick={handleClose}
      />

      <div className="relative w-full max-w-md min-w-0 animate-popIn">
        <div className="liquid-bg absolute -left-10 -top-10 h-36 w-36 rounded-full bg-[#fab218] opacity-40 blur-[40px] mix-blend-screen sm:-left-16 sm:-top-16 sm:h-48 sm:w-48"></div>
        <div
          className="liquid-bg absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-amber-600 opacity-30 blur-[50px] mix-blend-screen sm:-bottom-16 sm:-right-16 sm:h-56 sm:w-56"
          style={{ animationDelay: "-4s" }}
        ></div>

        <div className="apple-glass relative overflow-hidden rounded-[1.75rem] px-4 py-6 sm:rounded-[2rem] sm:p-8 md:p-10">
          <div className="absolute left-1/4 right-1/4 top-0 h-[1px] bg-gradient-to-r from-transparent via-white to-transparent opacity-50"></div>

          <button
            onClick={handleClose}
            className="absolute right-3 top-3 z-20 rounded-full p-2 text-white/60 transition-all hover:bg-white/10 hover:text-white sm:right-4 sm:top-4"
          >
            <X size={22} strokeWidth={1.5} />
          </button>

          <div className="relative z-10 text-center">
            {step === "form" && (
              <div className="flex min-w-0 flex-col items-center">
                <div className="relative mb-5 sm:mb-6">
                  <div className="apple-glass flex h-16 w-16 rotate-3 transform items-center justify-center rounded-[1.25rem] shadow-xl transition-transform duration-500 hover:rotate-0 sm:h-20 sm:w-20 sm:rounded-[1.5rem]">
                    <Gift
                      className="h-8 w-8 text-[#fab218] drop-shadow-[0_0_10px_rgba(250,178,24,0.8)] sm:h-10 sm:w-10"
                      strokeWidth={1.5}
                    />
                  </div>
                </div>

                <h2 className="mb-2 flex items-center gap-2 font-serif text-2xl font-medium tracking-wide text-white drop-shadow-md sm:text-4xl">
                  Clube VIP
                  <Sparkles className="h-5 w-5 text-[#fab218]" />
                </h2>

                <p className="mb-6 px-1 font-sans text-sm font-light leading-relaxed text-white/80 drop-shadow-sm sm:mb-8 sm:px-2 sm:text-base">
                  Cadastre-se para receber um{" "}
                  <strong className="font-normal text-[#fab218]">
                    presente especial
                  </strong>{" "}
                  no seu WhatsApp no dia do seu aniversário.
                </p>

                <form
                  onSubmit={handleSubmit}
                  className="w-full min-w-0 space-y-4"
                >
                  <div className="relative min-w-0">
                    <input
                      required
                      type="text"
                      name="nome"
                      value={formData.nome}
                      onChange={handleChange}
                      placeholder="Seu nome completo"
                      className="apple-input w-full min-w-0 rounded-2xl p-4 font-sans text-sm transition-all"
                    />
                  </div>

                  <div className="relative min-w-0">
                    <input
                      required
                      type="tel"
                      name="whatsapp"
                      value={formData.whatsapp}
                      onChange={handleChange}
                      placeholder="WhatsApp (DDD + Número)"
                      className="apple-input w-full min-w-0 rounded-2xl p-4 font-sans text-sm transition-all"
                    />
                  </div>

                  <div className="relative min-w-0 text-left">
                    <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2">
                      <CalendarHeart
                        className="h-5 w-5 text-white/50"
                        strokeWidth={1.5}
                      />
                    </div>

                    <input
                      required
                      type="date"
                      name="nascimento"
                      value={formData.nascimento}
                      onChange={handleChange}
                      className="apple-input block w-full min-w-0 rounded-2xl py-4 pl-12 pr-3 font-sans text-sm opacity-90 transition-all sm:pr-4"
                    />
                  </div>

                  <button type="submit" className="shadow__btn">
                    Quero Meu Presente
                  </button>
                </form>

                <p className="mt-5 flex items-center justify-center gap-2 text-[10px] uppercase tracking-[0.2em] text-white/50 sm:mt-6">
                  Zero Spam
                  <span className="h-1 w-1 rounded-full bg-[#fab218] shadow-[0_0_5px_#fab218]"></span>
                  Apenas Benefícios
                </p>
              </div>
            )}

            {step === "sending" && (
              <div className="flex flex-col items-center justify-center space-y-6 py-14 sm:py-16">
                <div className="apple-glass rounded-full p-4">
                  <Loader2 className="h-10 w-10 animate-spin text-[#fab218] drop-shadow-md" />
                </div>
                <p className="font-serif text-lg tracking-widest text-white/90 animate-pulse sm:text-xl">
                  Enviando dados...
                </p>
              </div>
            )}

            {step === "success" && (
              <div className="animate-popIn flex flex-col items-center justify-center py-8 text-center sm:py-10">
                <div className="relative mb-6">
                  <div className="absolute inset-0 rounded-full bg-green-400/40 blur-2xl"></div>
                  <div className="apple-glass relative z-10 flex h-20 w-20 items-center justify-center rounded-full sm:h-24 sm:w-24">
                    <CheckCircle
                      className="h-10 w-10 text-green-300 drop-shadow-md sm:h-12 sm:w-12"
                      strokeWidth={1.5}
                    />
                  </div>
                </div>

                <h3 className="mb-3 font-serif text-2xl text-white drop-shadow-md sm:text-4xl">
                  Tudo Certo!
                </h3>

                <p className="mb-8 font-sans text-sm font-light leading-relaxed text-white/80 sm:mb-10 sm:text-base">
                  Você entrou para a nossa lista exclusiva. Aguarde uma surpresa
                  no seu WhatsApp.
                </p>

                <button
                  onClick={handleClose}
                  className="apple-glass rounded-full px-8 py-3 font-sans text-sm tracking-widest text-white transition-all active:scale-95 hover:bg-white/20"
                >
                  Continuar
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VipModal;