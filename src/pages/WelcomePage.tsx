import React, { useState, useEffect, useRef } from 'react';
import { Beef, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { useDriverTour, welcomeTourSteps } from '../hooks/useDriverTour';
import TourButton from '../components/TourButton';

const WelcomePage: React.FC = () => {
  const navigate = useNavigate();
  const [showTourButton, setShowTourButton] = useState(false);
  
  // Referencias para las animaciones GSAP
  const logoRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);
  const bg1Ref = useRef<HTMLDivElement>(null);
  const bg2Ref = useRef<HTMLDivElement>(null);
  const bg3Ref = useRef<HTMLDivElement>(null);

  const { startTour } = useDriverTour({
    steps: welcomeTourSteps,
    onDestroyed: () => {
      // Auto-navigate to menu after welcome tour
      setTimeout(() => {
        navigate('/menu');
      }, 1000);
    }
  });

  useEffect(() => {
    // Timeline principal de GSAP
    const tl = gsap.timeline();

    // Configurar estados iniciales
    gsap.set([logoRef.current, titleRef.current, subtitleRef.current, descriptionRef.current, buttonRef.current], {
      opacity: 0,
      y: 50,
      scale: 0.8
    });

    gsap.set([bg1Ref.current, bg2Ref.current, bg3Ref.current], {
      scale: 0,
      rotation: 0
    });

    // Animación de entrada de elementos de fondo
    tl.to([bg1Ref.current, bg2Ref.current, bg3Ref.current], {
      scale: 1,
      rotation: 360,
      duration: 2,
      ease: "power2.out",
      stagger: 0.3
    })
    // Animación del logo con efecto de rebote
    .to(logoRef.current, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.8,
      ease: "back.out(1.7)",
      onComplete: () => {
        // Animación de pulso continuo para el logo
        gsap.to(logoRef.current, {
          scale: 1.1,
          duration: 1.5,
          ease: "power2.inOut",
          yoyo: true,
          repeat: -1
        });
      }
    }, "-=1")
    // Animación del título principal con efecto de escritura
    .to(titleRef.current, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.6,
      ease: "power3.out"
    }, "-=0.4")
    // Animación del subtítulo
    .to(subtitleRef.current, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.5,
      ease: "power2.out"
    }, "-=0.2")
    // Animación de la descripción
    .to(descriptionRef.current, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.5,
      ease: "power2.out"
    }, "-=0.1")
    // Animación del botón con efecto de rebote
    .to(buttonRef.current, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.6,
      ease: "back.out(1.4)",
      onComplete: () => {
        // Animación de rebote continuo para el botón
        gsap.to(buttonRef.current, {
          y: -10,
          duration: 1,
          ease: "power2.inOut",
          yoyo: true,
          repeat: -1
        });
        
        // Mostrar botón de tour después de las animaciones
        setShowTourButton(true);
      }
    }, "-=0.1");

    // Animación de rotación continua para elementos de fondo
    gsap.to(bg1Ref.current, {
      rotation: "+=360",
      duration: 20,
      ease: "none",
      repeat: -1
    });

    gsap.to(bg2Ref.current, {
      rotation: "-=360",
      duration: 25,
      ease: "none",
      repeat: -1
    });

    gsap.to(bg3Ref.current, {
      rotation: "+=360",
      duration: 30,
      ease: "none",
      repeat: -1
    });

    // Cleanup function
    return () => {
      tl.kill();
      gsap.killTweensOf([logoRef.current, titleRef.current, subtitleRef.current, descriptionRef.current, buttonRef.current, bg1Ref.current, bg2Ref.current, bg3Ref.current]);
    };
  }, []);

  const handleStart = () => {
    // Animación de salida antes de navegar
    const tl = gsap.timeline({
      onComplete: () => navigate('/menu')
    });

    tl.to([logoRef.current, titleRef.current, subtitleRef.current, descriptionRef.current, buttonRef.current], {
      opacity: 0,
      y: -50,
      scale: 0.8,
      duration: 0.5,
      ease: "power2.in",
      stagger: 0.1
    })
    .to([bg1Ref.current, bg2Ref.current, bg3Ref.current], {
      scale: 0,
      opacity: 0,
      duration: 0.3,
      ease: "power2.in"
    }, "-=0.3");
  };

  const handleStartTour = () => {
    startTour();
  };

  const handleButtonHover = () => {
    gsap.to(buttonRef.current, {
      scale: 1.05,
      duration: 0.3,
      ease: "power2.out"
    });
  };

  const handleButtonLeave = () => {
    gsap.to(buttonRef.current, {
      scale: 1,
      duration: 0.3,
      ease: "power2.out"
    });
  };

  return (
    <div 
      ref={backgroundRef}
      className="min-h-screen flex flex-col items-center justify-center p-4 text-center relative overflow-hidden welcome-page-bg"
      onClick={handleStart}
    >
      {/* Layered Background Images with Mix Blend Modes */}
      <div className="absolute inset-0 bg-layer-1"></div>
      <div className="absolute inset-0 bg-layer-2"></div>
      <div className="absolute inset-0 bg-overlay"></div>
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          ref={bg1Ref}
          className="absolute -top-20 -left-20 w-60 h-60 rounded-full bg-[#FF8C00] opacity-10"
        ></div>
        <div 
          ref={bg2Ref}
          className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-[#FF8C00] opacity-5"
        ></div>
        <div 
          ref={bg3Ref}
          className="absolute top-1/3 right-1/4 w-40 h-40 rounded-full bg-white opacity-5"
        ></div>
      </div>
      
      {/* Logo and Content */}
      <div className="relative z-10">
        <div className="mb-8">
          <div 
            ref={logoRef}
            className="inline-flex items-center justify-center w-32 h-32 bg-[#FF8C00] rounded-full mb-6 shadow-2xl"
          >
            <Beef size={80} className="text-white" />
          </div>
          <h1 
            ref={titleRef}
            className="text-5xl font-extrabold text-white mb-2 font-heavyrust-primary text-shadow-lg"
          >
            PARRILLEROS
          </h1>
          <p 
            ref={subtitleRef}
            className="text-2xl text-[#FF8C00] font-bold font-bebas-neue-primary text-shadow-md"
          >
            FAST FOOD
          </p>
        </div>
        
        <div>
          <p 
            ref={descriptionRef}
            className="text-white text-xl mb-12 max-w-md mx-auto text-shadow-md"
          >
            Bienvenido a tu experiencia de autoservicio. Toque la pantalla para comenzar su pedido.
          </p>
          
          <div 
            ref={buttonRef}
            className="inline-flex items-center bg-[#FF8C00] text-white px-8 py-4 rounded-full text-xl font-bold hover:bg-orange-600 transition-colors cursor-pointer shadow-2xl backdrop-blur-sm"
            onMouseEnter={handleButtonHover}
            onMouseLeave={handleButtonLeave}
          >
            Toque para comenzar
            <ArrowRight size={24} className="ml-2" />
          </div>
        </div>
      </div>

      {/* Tour Button - Pequeño y discreto en esquina inferior izquierda */}
      {showTourButton && (
        <TourButton 
          onStartTour={handleStartTour}
          variant="floating"
          size="sm"
          className="bottom-6 left-6 pointer-events-auto"
          onClick={(e: React.MouseEvent) => {
            e.stopPropagation();
            handleStartTour();
          }}
        />
      )}
    </div>
  );
};

export default WelcomePage;