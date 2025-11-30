import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
 
// Import des composants
import Header from '../../src/landing/header';
import HeroSection from '../../src/landing/heroSection';
import ServicesSection from '../../src/landing/servicesSection';
import ProcessSection from '../../src/landing/processSection';
import PaymentSection from '../../src/landing/paymentSection';
import ContactSection from '../../src/landing/contactSection';
import ChatBot from '../../src/landing/chatBot';
import Footer from '../../src/landing/footer';
import TestimonialsSection from '../../src/landing/testimonialsSection';
const LandingPage = () => {
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { id: 1, text: "👋 Bonjour ! Je suis l'assistant Cleanix. Comment puis-je vous aider aujourd'hui ?", sender: 'bot' }
  ]);
  const [chatInput, setChatInput] = useState('');
  
  // Refs pour le scroll vers les sections
  const servicesRef = useRef(null);
  const processRef = useRef(null);
  const paymentRef = useRef(null);
  const testimonialsRef = useRef(null);
  const contactRef = useRef(null);

  // Fonction pour basculer le mode sombre
  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  // Effet pour le scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Fonction pour le scroll vers les sections
  const scrollToSection = (sectionRef) => {
    sectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Méthodes de paiement
  const paymentMethods = [
    { 
      name: 'Cartes Bancaires', 
      icon: '💳', 
      description: 'Paiement sécurisé en ligne avec cryptage SSL',
      logos: [
        'https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg',
        'https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg'
      ]
    },
    { 
      name: 'PayPal', 
      icon: '📱', 
      description: 'Paiement rapide et sécurisé via votre compte PayPal',
      logos: [
        'https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg'
      ]
    },
    { 
      name: 'Virement Bancaire', 
      icon: '🏦', 
      description: 'Transfert bancaire sécurisé depuis votre application mobile',
      logos: [
        'https://cdn-icons-png.flaticon.com/512/2554/2554885.png'
      ]
    },
    { 
      name: 'Paiement en Espèces', 
      icon: '💰', 
      description: 'Paiement en main propre à notre agent lors de la prestation',
      logos: [
        'https://cdn-icons-png.flaticon.com/512/259/259842.png'
      ]
    }
  ];

  // Témoignages
  const testimonials = [
    {
      name: "Marie Dubois",
      role: "Client particulier",
      text: "Service exceptionnel ! Mon appartement n'a jamais été aussi propre.",
      rating: 5
    },
    {
      name: "Pierre Martin",
      role: "Propriétaire d'immeuble",
      text: "La gestion des clés a révolutionné ma façon de gérer mes locations.",
      rating: 5
    },
    {
      name: "Sophie Lambert",
      role: "Directrice de bureau",
      text: "Équipe professionnelle et efficace. Je recommande vivement !",
      rating: 4
    }
  ];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'dark bg-gray-900' : 'bg-white'}`}>
      <Header 
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
        isScrolled={isScrolled}
        navigate={navigate}
        scrollToSection={scrollToSection}
        servicesRef={servicesRef}
        processRef={processRef}
        paymentRef={paymentRef}
        testimonialsRef={testimonialsRef}
        contactRef={contactRef}
      />
      
      <HeroSection 
        isDarkMode={isDarkMode}
        navigate={navigate}
        scrollToSection={scrollToSection}
        servicesRef={servicesRef}
      />
      
      <ServicesSection 
        isDarkMode={isDarkMode}
        servicesRef={servicesRef}
      />
      
      <ProcessSection 
        isDarkMode={isDarkMode}
        processRef={processRef}
      />
      
      <PaymentSection 
        isDarkMode={isDarkMode}
        paymentRef={paymentRef}
        paymentMethods={paymentMethods}
      />
      
      <TestimonialsSection 
        isDarkMode={isDarkMode}
        testimonialsRef={testimonialsRef}
        testimonials={testimonials}
      />
      
      <ContactSection 
        isDarkMode={isDarkMode}
        contactRef={contactRef}
      />
      
      <Footer isDarkMode={isDarkMode} />
      
      <ChatBot 
        isDarkMode={isDarkMode}
        isChatOpen={isChatOpen}
        setIsChatOpen={setIsChatOpen}
        chatMessages={chatMessages}
        setChatMessages={setChatMessages}
        chatInput={chatInput}
        setChatInput={setChatInput}
      />

      {/* Styles d'animation personnalisés */}
      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
