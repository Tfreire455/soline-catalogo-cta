import React, { useState, useEffect } from "react";
import { X, Gift, Sparkles, CheckCircle, Loader2, CalendarHeart } from "lucide-react";

// Estilos customizados para o Efeito Gota/Vidro (iOS Style) e Animações
const customStyles = `
  /* Efeito de Vidro/Gota Apple */
  .apple-glass {
    background: rgba(255, 255, 255, 0.05); /* Quase transparente */
    backdrop-filter: blur(20px) saturate(150%);
    -webkit-backdrop-filter: blur(20px) saturate(150%);
    border: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow: 
      0 30px 60px rgba(0, 0, 0, 0.15),
      inset 0 1px 0 rgba(255, 255, 255, 0.3),
      inset 0 0 20px rgba(255, 255, 255, 0.05);
  }

  /* Inputs estilo iOS */
  .apple-input {
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

  /* Botão Uiverse Adaptado ao Tema Vidro/Dourado */
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
    font-family: 'Outfit', sans-serif; /* Usando a fonte sans para o botão ficar mais clean */
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

  /* Animações de Entrada (Scale suave) */
  @keyframes popIn {
    0% { opacity: 0; transform: scale(0.9) translateY(20px); }
    100% { opacity: 1; transform: scale(1) translateY(0); }
  }
  .animate-popIn {
    animation: popIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }

  /* Blob Animado de Fundo (Sensação Líquida) */
  @keyframes liquidBlob {
    0%, 100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
    50% { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
  }
  .liquid-bg {
    animation: liquidBlob 8s ease-in-out infinite;
  }
`;

const VipModal = ({ botApiUrl }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [step, setStep] = useState("form"); // form, sending, success
  
  const [formData, setFormData] = useState({
    nome: "",
    whatsapp: "",
    nascimento: ""
  });

  // Abre o modal automaticamente assim que carrega (sempre)
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 500); 

    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Máscara simples para celular
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
      const targetUrl = botApiUrl || process.env.REACT_APP_URL_BOT || "http://localhost:3000"; 
      
      const response = await fetch(`${targetUrl}/api/vip/cadastro`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        setStep("success");
        // Fecha automaticamente após sucesso
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

  // Se estiver minimizado, mostra apenas o botão flutuante com efeito Glass
  if (!isOpen) {
    if (!isMinimized) return null; 
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 bg-[#222] right-6 z-50 group flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 apple-glass rounded-full hover:scale-110 transition-transform duration-300"
        title="Ganhe um presente"
      >
        <Gift className="w-6 h-6 sm:w-8 sm:h-8 text-[#fab218] group-hover:rotate-12 transition-transform drop-shadow-lg" />
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-amber-500 border border-white/50 shadow-sm"></span>
        </span>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
      <style>{customStyles}</style>

      {/* Backdrop Escurecido com Blur Forte (Apple Style) */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-md transition-opacity duration-500"
        onClick={handleClose}
      ></div>

      {/* Container Principal Animado */}
      <div className="relative w-full max-w-md animate-popIn">
        
        {/* Blobs de Fundo (Sensação de água/luz por trás do vidro) */}
        <div className="absolute -top-16 -left-16 w-48 h-48 bg-[#fab218] rounded-full mix-blend-screen filter blur-[40px] opacity-40 liquid-bg"></div>
        <div className="absolute -bottom-16 -right-16 w-56 h-56 bg-amber-600 rounded-full mix-blend-screen filter blur-[50px] opacity-30 liquid-bg" style={{ animationDelay: '-4s' }}></div>

        {/* Card Modal - Apple Glass */}
        <div className="apple-glass rounded-[2rem] p-8 sm:p-10 relative overflow-hidden">
          
          {/* Reflexo interno no topo da borda */}
          <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-white to-transparent opacity-50"></div>

          {/* Botão Fechar */}
          <button 
            onClick={handleClose}
            className="absolute top-4 right-4 text-white/60 hover:text-white hover:bg-white/10 rounded-full p-2 transition-all z-20"
          >
            <X size={22} strokeWidth={1.5} />
          </button>

          <div className="relative z-10 text-center">
            
            {step === "form" && (
              <div className="flex flex-col items-center">
                
                {/* Ícone Estilizado (Gota) */}
                <div className="relative mb-6">
                  <div className="w-20 h-20 apple-glass rounded-[1.5rem] flex items-center justify-center rotate-3 transform hover:rotate-0 transition-transform duration-500 shadow-xl">
                    <Gift className="w-10 h-10 text-[#fab218] drop-shadow-[0_0_10px_rgba(250,178,24,0.8)]" strokeWidth={1.5} />
                  </div>
                </div>

                <h2 className="font-serif text-3xl sm:text-4xl text-white mb-2 tracking-wide font-medium flex items-center gap-2 drop-shadow-md">
                  Clube VIP <Sparkles className="w-5 h-5 text-[#fab218]" />
                </h2>
                
                <p className="font-sans text-sm sm:text-base text-white/80 mb-8 leading-relaxed font-light px-2 drop-shadow-sm">
                  Cadastre-se para receber um <strong className="text-[#fab218] font-normal">presente especial</strong> no seu WhatsApp no dia do seu aniversário.
                </p>

                <form onSubmit={handleSubmit} className="w-full space-y-4">
                  {/* Nome */}
                  <div className="relative">
                    <input
                      required
                      type="text"
                      name="nome"
                      value={formData.nome}
                      onChange={handleChange}
                      placeholder="Seu nome completo"
                      className="w-full apple-input rounded-2xl p-4 font-sans text-sm transition-all"
                    />
                  </div>

                  {/* WhatsApp */}
                  <div className="relative">
                    <input
                      required
                      type="tel"
                      name="whatsapp"
                      value={formData.whatsapp}
                      onChange={handleChange}
                      placeholder="WhatsApp (DDD + Número)"
                      className="w-full apple-input rounded-2xl p-4 font-sans text-sm transition-all"
                    />
                  </div>

                  {/* Nascimento */}
                  <div className="relative text-left">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                       <CalendarHeart className="w-5 h-5 text-white/50" strokeWidth={1.5} />
                    </div>
                    <input
                      required
                      type="date"
                      name="nascimento"
                      value={formData.nascimento}
                      onChange={handleChange}
                      className="w-full apple-input rounded-2xl p-4 pl-12 font-sans text-sm transition-all [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert opacity-90"
                    />
                  </div>

                  {/* Botão Uiverse */}
                  <button type="submit" className="shadow__btn">
                    Quero Meu Presente
                  </button>
                </form>
                
                <p className="mt-6 text-[10px] text-white/50 uppercase tracking-[0.2em] font-sans flex items-center justify-center gap-2">
                   Zero Spam <span className="w-1 h-1 bg-[#fab218] rounded-full shadow-[0_0_5px_#fab218]"></span> Apenas Benefícios
                </p>
              </div>
            )}

            {step === "sending" && (
              <div className="flex flex-col items-center justify-center py-16 space-y-6">
                <div className="p-4 apple-glass rounded-full">
                  <Loader2 className="w-10 h-10 text-[#fab218] animate-spin drop-shadow-md" />
                </div>
                <p className="font-serif text-xl text-white/90 tracking-widest animate-pulse">Enviando dados...</p>
              </div>
            )}

            {step === "success" && (
              <div className="flex flex-col items-center justify-center py-10 text-center animate-popIn">
                <div className="mb-6 relative">
                   <div className="absolute inset-0 bg-green-400/40 blur-2xl rounded-full"></div>
                   <div className="w-24 h-24 apple-glass rounded-full flex items-center justify-center relative z-10">
                     <CheckCircle className="w-12 h-12 text-green-300 drop-shadow-md" strokeWidth={1.5} />
                   </div>
                </div>
                
                <h3 className="font-serif text-3xl sm:text-4xl text-white mb-3 drop-shadow-md">
                  Tudo Certo!
                </h3>
                <p className="font-sans text-white/80 mb-10 font-light text-sm sm:text-base leading-relaxed">
                  Você entrou para a nossa lista exclusiva. Aguarde uma surpresa no seu WhatsApp.
                </p>
                
                <button 
                  onClick={handleClose}
                  className="px-8 py-3 apple-glass text-white rounded-full font-sans text-sm hover:bg-white/20 transition-all tracking-widest active:scale-95"
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