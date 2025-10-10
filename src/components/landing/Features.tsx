'use client';

import React from 'react';

const Features = () => {
  const features = [
    {
      icon: (
        <svg className="w-12 h-12 text-primary-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
        </svg>
      ),
      title: "Gravação e Transcrição Automática",
      description: "Utilize o reconhecimento de fala para criar notas precisas durante suas sessões de fisioterapia."
    },
    {
      icon: (
        <svg className="w-12 h-12 text-primary-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: "Evidências com Timestamps",
      description: "Atribuição de falas com precisão e referência a trechos específicos da consulta."
    },
    {
      icon: (
        <svg className="w-12 h-12 text-primary-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      title: "Exportação em PDF/JSON",
      description: "Resultados de fácil exportação para integrar aos seus sistemas de prontuário existentes."
    },
    {
      icon: (
        <svg className="w-12 h-12 text-primary-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: "Segurança e Conformidade",
      description: "Proteção de dados com segurança avançada em conformidade com a LGPD e padrões médicos."
    }
  ];

  return (
    <section id="features" className="py-20 bg-neutral-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-dark mb-4">
            Características Principais
          </h2>
          <p className="text-lg text-neutral-medium max-w-2xl mx-auto">
            Descobra como o PhysioNote.AI pode revolucionar sua prática profissional
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl 
                         transform hover:-translate-y-3 hover:scale-105 
                         transition-all duration-500 ease-out
                         border border-gray-100 animate-fade-in-up cursor-pointer
                         hover:border-primary-blue hover:bg-gradient-to-br hover:from-primary-blue/5 hover:to-transparent
                         relative overflow-hidden"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Animated background effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary-blue/0 to-primary-blue/0 
                            group-hover:from-primary-blue/5 group-hover:to-blue-700/5 
                            transition-all duration-500 rounded-xl"></div>
              
              <div className="relative flex flex-col items-center text-center">
                <div className="mb-6 p-4 bg-primary-blue/10 rounded-full 
                              transition-all duration-500 ease-out
                              group-hover:bg-primary-blue/20 group-hover:scale-110 
                              group-hover:rotate-6 group-hover:shadow-lg
                              group-hover:shadow-primary-blue/30">
                  <div className="transition-transform duration-500 group-hover:scale-110">
                    {feature.icon}
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold text-neutral-dark mb-4
                             transition-colors duration-300 group-hover:text-primary-blue">
                  {feature.title}
                </h3>
                
                <p className="text-neutral-medium leading-relaxed
                            transition-all duration-300 group-hover:text-neutral-dark">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;