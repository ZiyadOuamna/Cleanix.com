import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Quote } from 'lucide-react';

const TestimonialsSection = ({ isDarkMode, testimonialsRef, testimonials }) => {
  const navigate = useNavigate();
  const displayTestimonials = testimonials || [
    {
      name: "Fatima Ahmed",
      role: "Gestionnaire d'immeubles",
      text: "Cleanix a complètement transformé la manière dont nous gérons le nettoyage de nos propriétés. Service professionnel et fiable.",
      rating: 5,
      avatar: "👩‍💼"
    },
    {
      name: "Mohamed Hassan",
      role: "Propriétaire",
      text: "Les freelancers sont très professionnels et respectent les délais. Je recommande vivement Cleanix à tous.",
      rating: 5,
      avatar: "👨‍💼"
    },
    {
      name: "Aisha Mansour",
      role: "Cadre supérieur",
      text: "Un gain de temps considérable et une excellente qualité de service. L'application est intuitive et facile à utiliser.",
      rating: 5,
      avatar: "👩‍💻"
    },
    {
      name: "Youssef Amini",
      role: "Freelancer",
      text: "Cleanix m'a permis de développer mon activité de nettoyage. Plateforme fiable et paiements garantis.",
      rating: 5,
      avatar: "👨‍🔧"
    },
    {
      name: "Leila Ben Said",
      role: "Avocate",
      text: "Service exceptionnellement professionnel. Cleanix gère tout, je peux me concentrer sur mon travail important.",
      rating: 5,
      avatar: "👩‍⚖️"
    },
    {
      name: "Hassan El Arabi",
      role: "Entrepreneur",
      text: "La meilleure solution pour gérer les espaces commerciaux. Interface simple, résultats impeccables.",
      rating: 5,
      avatar: "👨‍💼"
    }
  ];

  return (
    <section 
      ref={testimonialsRef} 
      className={`min-h-screen w-full flex items-center justify-center py-16 ${
        isDarkMode 
          ? 'bg-gradient-to-br from-[#030812] via-[#18212F] to-[#030812]'
          : 'bg-gray-50'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8 lg:mb-10">
          <h2 className={`text-xl sm:text-3xl lg:text-5xl font-bold mb-2 sm:mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Ils nous font confiance
          </h2>
          <p className={`text-xs sm:text-sm lg:text-base max-w-2xl mx-auto leading-relaxed ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Découvrez ce que nos clients et freelancers disent de Cleanix
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 lg:gap-4">
          {displayTestimonials.map((testimonial, index) => (
            <div 
              key={index}
              className={`group relative p-2 sm:p-3 lg:p-4 rounded-lg sm:rounded-xl transition-all duration-300 overflow-hidden ${
                isDarkMode 
                  ? 'bg-gray-700/50 border border-gray-600 hover:border-cyan-500' 
                  : 'bg-gray-50 border border-gray-200 hover:border-cyan-500 hover:bg-gray-100'
              } hover:shadow-2xl hover:transform hover:-translate-y-2`}
            >
              {/* Gradient Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 to-blue-600/0 group-hover:from-cyan-500/5 group-hover:to-blue-600/5 transition-all duration-300"></div>
              
              <div className="relative z-10 space-y-1 sm:space-y-2">
                {/* Quote Icon */}
                <div className="flex items-start justify-between gap-2">
                  <div className={`w-6 sm:w-8 h-6 sm:h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    isDarkMode ? 'bg-gray-600' : 'bg-cyan-100'
                  }`}>
                    <Quote size={14} className="sm:w-4 text-cyan-500" />
                  </div>
                  
                  {/* Rating */}
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i}
                        size={10}
                        className={`sm:w-3 ${
                          i < testimonial.rating 
                            ? 'fill-yellow-400 text-yellow-400' 
                            : isDarkMode ? 'text-gray-600' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                
                {/* Review Text */}
                <p className={`text-xs sm:text-xs lg:text-sm leading-relaxed italic ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  "{testimonial.text}"
                </p>
                
                {/* Divider */}
                <div className={`w-6 sm:w-8 h-0.5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600`}></div>
                
                {/* Client Info */}
                <div className="flex items-center gap-2 pt-1 sm:pt-2">
                  <div className="w-6 sm:w-8 h-6 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-lg bg-gradient-to-br from-cyan-100 to-blue-100 flex-shrink-0">
                    {testimonial.avatar}
                  </div>
                  <div className="min-w-0">
                    <p className={`font-bold text-xs ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {testimonial.name}
                    </p>
                    <p className={`text-xs leading-tight ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className={`mt-6 sm:mt-8 lg:mt-10 p-4 sm:p-6 rounded-lg sm:rounded-xl text-center border ${
          isDarkMode
            ? 'bg-gray-700/30 border-gray-600'
            : 'bg-gradient-to-r from-cyan-50 to-blue-50 border-cyan-200'
        }`}>
          <h3 
            
            className={`text-sm sm:text-xl lg:text-2xl font-bold mb-2 sm:mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Rejoignez Cleanix aujourd'hui
            
          </h3>
          <p className={`text-xs sm:text-sm lg:text-base mb-4 sm:mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Rejoignez des milliers de clients et de freelancers satisfaits
          </p>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 justify-center">
            <button 
              onClick={() => navigate('/register')}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-xs sm:text-sm hover:shadow-lg transition-all cursor-pointer">
              S'inscrire maintenant
            </button>
            <button 
              onClick={() => navigate('/')}
              className={`border-2 border-cyan-500 font-bold px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-xs sm:text-sm transition-all cursor-pointer ${
                isDarkMode 
                  ? 'text-cyan-400 hover:bg-cyan-900/10' 
                  : 'text-cyan-700 hover:bg-gray-50'
              }`}>
              En savoir plus
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;