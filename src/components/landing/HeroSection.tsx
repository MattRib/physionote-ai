'use client';

import React from 'react';
import Link from 'next/link';

const HeroSection = () => {
  return (
    <section className="pt-20 pb-16 bg-gradient-to-br from-neutral-white to-neutral-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-dark mb-6 leading-tight
                         opacity-0 animate-hero-title">
              Transforme sua prática com a 
              <span className="text-primary-blue"> documentação inteligente </span> 
              de sessões de fisioterapia
            </h1>
            
            <p className="text-lg md:text-xl text-neutral-medium mb-8 leading-relaxed
                        opacity-0 animate-hero-subtitle">
              Automatize a documentação de consultas com IA para fisioterapeutas, 
              economizando tempo e garantindo precisão em cada sessão.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/login">
                <button className="bg-primary-blue text-white px-8 py-4 rounded-lg font-semibold text-lg
                                 hover:bg-blue-700 hover:scale-110 transform transition-all duration-400
                                 shadow-lg hover:shadow-xl
                                 opacity-0 animate-hero-button-primary w-full sm:w-auto">
                  Comece Agora
                </button>
              </Link>
              
              <Link href="#features">
                <button className="border-2 border-primary-blue text-primary-blue px-8 py-4 rounded-lg 
                                 font-semibold text-lg hover:bg-primary-blue hover:text-white 
                                 hover:scale-110 transform transition-all duration-400 shadow-md hover:shadow-xl
                                 opacity-0 animate-hero-button-secondary w-full sm:w-auto">
                  Veja como Funciona
                </button>
              </Link>
            </div>
          </div>
          
          {/* Placeholder for Image/Illustration */}
          <div className="opacity-0 animate-hero-image">
            <div className="bg-gradient-to-br from-primary-blue/10 to-primary-blue/5 
                          rounded-2xl p-8 h-96 flex items-center justify-center">
              <div className="text-center">
                <div className="w-32 h-32 bg-primary-blue/20 rounded-full mx-auto mb-4 
                              flex items-center justify-center animate-bounce-gentle">
                  <svg className="w-16 h-16 text-primary-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                </div>
                <p className="text-neutral-medium font-medium">
                  Ilustração do PhysioNote.AI
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;