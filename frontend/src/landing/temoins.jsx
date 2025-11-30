import React from 'react';

const TestimonialsSection = ({ isDarkMode, testimonialsRef, testimonials }) => {
  return (
    <section ref={testimonialsRef} className={`py-20 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className={`text-4xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Ils nous font confiance
          </h2>
          <p className={`text-xl ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Découvrez ce que nos clients disent de nos services
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className={`p-6 rounded-2xl transition-all duration-300 hover:transform hover:scale-105 ${
                isDarkMode ? 'bg-gray-800' : 'bg-gray-50 shadow-lg'
              }`}
            >
              {/* Étoiles de rating */}
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <span 
                    key={i}
                    className={`text-xl ${
                      i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>
              
              {/* Texte du témoignage */}
              <p className={`mb-6 italic ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                "{testimonial.text}"
              </p>
              
              {/* Informations client */}
              <div className="flex items-center">
                <div>
                  <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {testimonial.name}
                  </p>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;