'use client';

import React from 'react';
import { Quote, Star } from 'lucide-react';

const Testimonials = () => {
  const testimonials = [
    {
      quote: "O PhysioNote.AI revolucionou minha prática. Economizo mais de 2 horas por dia na documentação e posso focar totalmente nos meus pacientes durante as sessões.",
      name: "Dr. Maria Silva",
      title: "Fisioterapeuta - Clínica Movimento",
      rating: 5
    },
    {
      quote: "A precisão na transcrição e a organização automática das informações transformaram nossa clínica. Nossos relatórios ficaram muito mais profissionais e detalhados.",
      name: "Dr. João Santos",
      title: "Diretor - Centro de Reabilitação Vida",
      rating: 5
    },
    {
      quote: "Impressionante como a IA entende termos técnicos específicos da fisioterapia. Reduziu meu tempo administrativo em 60% e aumentou a qualidade dos registros.",
      name: "Dra. Ana Rodrigues",
      title: "Especialista em Ortopedia - Clínica Reabilitar+",
      rating: 5
    }
  ];

  return (
    <section className="py-20 bg-neutral-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-3xl md:text-4xl font-bold text-[#333333] mb-4">
            O que dizem nossos clientes
          </h2>
          <p className="text-lg text-neutral-medium max-w-2xl mx-auto">
            Veja como o PhysioNote.AI está transformando a prática de fisioterapeutas em todo o Brasil
          </p>
          
          {/* Overall Rating */}
          <div className="flex items-center justify-center gap-2 mt-6">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className="w-5 h-5 fill-[#5A9BCF] text-[#5A9BCF]" 
                />
              ))}
            </div>
            <span className="text-lg font-semibold text-[#333333]">4.8/5</span>
            <span className="text-neutral-medium text-sm">(250+ avaliações)</span>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl 
                         transform hover:-translate-y-2 hover:scale-105 transition-all duration-400
                         border border-gray-100 hover:border-[#5A9BCF] animate-fade-in-up cursor-pointer
                         relative overflow-hidden"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              {/* Quote Icon Background */}
              <Quote className="absolute top-4 right-4 w-16 h-16 text-[#5A9BCF] opacity-10" />
              
              <div className="relative">
                {/* Rating Stars */}
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star 
                      key={i} 
                      className="w-4 h-4 fill-[#5A9BCF] text-[#5A9BCF]" 
                    />
                  ))}
                </div>

                {/* Quote Text */}
                <p className="text-[#333333] text-lg mb-6 leading-relaxed font-medium">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
                
                {/* Author Info */}
                <div className="flex items-center space-x-4 pt-4 border-t border-gray-100">
                  {/* Avatar with Initial */}
                  <div className="flex-shrink-0">
                    <div className="w-14 h-14 bg-[#5A9BCF] rounded-full flex items-center justify-center">
                      <span className="text-xl font-bold text-white">
                        {testimonial.name.split(' ')[1].charAt(0)}
                      </span>
                    </div>
                  </div>
                  
                  {/* Name and Title */}
                  <div className="flex-1">
                    <h4 className="font-semibold text-[#333333] text-base">
                      {testimonial.name}
                    </h4>
                    <p className="text-neutral-medium text-sm mt-1">
                      {testimonial.title}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;