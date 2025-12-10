import React from 'react';
import { ArrowRight, CheckCircle2, Users, Star, Clock } from 'lucide-react';

const HeroSection = ({ isDarkMode, navigate, scrollToSection, servicesRef }) => {
  const stats = [
    {
      icon: Users,
      value: '1000+',
      label: 'Utilisateurs actifs',
      color: '#07A2BE'
    },
    {
      icon: Star,
      value: '4.8★',
      label: 'Note moyenne',
      color: '#07A2BE'
    },
    {
      icon: Clock,
      value: '24/7',
      label: 'Support client',
      color: '#07A2BE'
    }
  ];

  return (
    <section className={`min-h-screen w-full flex items-center justify-center py-16 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-[#030812] via-[#18212F] to-[#030812]'
        : 'bg-gradient-to-br from-white via-cyan-50 to-[#f0f9ff]'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          
          {/* Texte Gauche */}
          <div className="w-full lg:w-1/2 space-y-8">

            {/* Titre Principal */}
            <h1 className={`text-5xl md:text-7xl font-bold leading-tight tracking-tight ${
              isDarkMode ? 'text-white' : 'text-[#030812]'
            }`}>
              Votre Espace,<br/>
              <span className="bg-gradient-to-r from-[#07A2BE] via-cyan-500 to-blue-500 bg-clip-text text-transparent">
                Impeccable
              </span>
              {' '}en un Clic
            </h1>
            
            {/* Sous-titre */}
            <p className={`text-lg md:text-xl leading-relaxed ${
              isDarkMode ? 'text-[#777B83]' : 'text-[#777B83]'
            }`}>
              Connectez-vous instantanément à des professionnels vérifiés du nettoyage. 
              Réservation simple, paiement sécurisé, service de qualité.
            </p>

            {/* Points clés */}
            <div className="space-y-3 pt-4">
              {[
                'Professionnels vérifiés et assurés',
                'Réservation en 2 minutes',
                'Garantie 100% satisfaction'
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <CheckCircle2 size={20} className="text-[#07A2BE] flex-shrink-0" />
                  <span className={isDarkMode ? 'text-[#777B83]' : 'text-[#030812]'}>{item}</span>
                </div>
              ))}
            </div>
            
            {/* Boutons CTA */}
            <div className="flex flex-col sm:flex-row gap-4 pt-8">
              <button 
                onClick={() => scrollToSection(servicesRef)}
                className="group flex items-center justify-center gap-2 bg-gradient-to-r from-[#07A2BE] to-cyan-500 text-white font-bold px-8 py-4 rounded-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              >
                Commencer maintenant
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button 
                onClick={() => navigate('/register')}
                className={`font-bold px-8 py-4 rounded-xl transition-all duration-300 border-2 ${
                  isDarkMode
                    ? 'border-[#07A2BE] text-[#07A2BE] hover:bg-[#07A2BE]/10'
                    : 'border-[#07A2BE] text-[#07A2BE] hover:bg-gray-50'
                }`}
              >
                Devenir Freelancer
              </button>
            </div>
          </div>

          {/* Stats Droite - Piano/Zigzag Layout */}
          <div className="w-full lg:w-1/2 flex flex-col justify-center space-y-6">
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              const isAlternate = idx % 2 === 1;
              
              return (
                <div
                  key={idx}
                  className={`flex ${isAlternate ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`w-5/6 p-6 rounded-2xl backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-2xl border cursor-pointer group ${
                      isDarkMode
                        ? 'bg-gradient-to-br from-[#18212F]/50 to-[#030812]/50 border-[#07A2BE]/30 hover:border-[#07A2BE]/60 hover:-translate-y-2'
                        : 'bg-gray-50/80 border-[#07A2BE]/30 hover:border-[#07A2BE]/60 shadow-lg hover:-translate-y-2'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className="p-4 rounded-lg flex-shrink-0"
                        style={{
                          backgroundColor: isDarkMode ? '#07A2BE20' : '#07A2BE10'
                        }}
                      >
                        <Icon size={28} style={{ color: stat.color }} className="group-hover:scale-110 transition-transform" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-3xl font-bold" style={{ color: stat.color }}>
                          {stat.value}
                        </p>
                        <p className={`text-sm mt-1 ${
                          isDarkMode ? 'text-[#777B83]' : 'text-[#777B83]'
                        }`}>
                          {stat.label}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
