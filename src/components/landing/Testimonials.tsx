'use client';

import React from 'react';
import { Quote, Star } from 'lucide-react';
import { RevealOnScroll } from '@/components/common';

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
    <section id="testimonials" className="relative overflow-hidden bg-white py-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(224,231,255,0.4)_0%,transparent_65%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(150deg,rgba(191,219,254,0.25)_0%,transparent_70%)]" />
      <div className="pointer-events-none absolute -left-24 top-32 h-80 w-80 rounded-full bg-gradient-to-br from-[#c7d2fe]/40 via-[#e0e7ff]/30 to-transparent blur-[150px]" aria-hidden="true" />
      <div className="pointer-events-none absolute right-[-8rem] bottom-[-12rem] h-[26rem] w-[26rem] rounded-full bg-[radial-gradient(circle,rgba(191,219,254,0.28),transparent_72%)] blur-[180px]" aria-hidden="true" />

      <RevealOnScroll>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-slate-900 md:text-4xl">
              O que dizem nossos clientes
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-slate-600">
              Veja como o PhysioNote.AI está transformando a prática de fisioterapeutas em todo o Brasil
            </p>

            {/* Overall Rating */}
            <div className="mt-6 flex items-center justify-center gap-2">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-5 w-5 fill-[#6366f1] text-[#6366f1]"
                  />
                ))}
              </div>
              <span className="text-lg font-semibold text-slate-900">4.8/5</span>
              <span className="text-sm text-slate-500">(250+ avaliações)</span>
            </div>
          </div>

          {/* Testimonials Grid */}
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 lg:grid-cols-2">
            {testimonials.map((testimonial, index) => (
              <RevealOnScroll key={index} delay={index * 0.12}>
                <div
                  className="group relative cursor-pointer overflow-hidden rounded-2xl border border-indigo-100 bg-white p-8 shadow-[0_24px_70px_-44px_rgba(99,102,241,0.25)] transition-all duration-500 ease-out hover:-translate-y-3 hover:scale-[1.02] hover:border-indigo-200 hover:bg-gradient-to-br hover:from-white hover:via-indigo-50/40 hover:to-white hover:shadow-[0_32px_90px_-46px_rgba(99,102,241,0.35)]"
                >
                  {/* Quote Icon Background */}
                  <Quote className="absolute right-4 top-4 h-16 w-16 text-indigo-200 opacity-40" />

                  <div className="relative">
                    {/* Rating Stars */}
                    <div className="mb-4 flex items-center gap-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="h-4 w-4 fill-[#a855f7] text-[#a855f7]"
                        />
                      ))}
                    </div>

                    {/* Quote Text */}
                    <p className="mb-6 text-lg font-medium leading-relaxed text-slate-700">
                      &ldquo;{testimonial.quote}&rdquo;
                    </p>

                    {/* Author Info */}
                    <div className="flex items-center space-x-4 border-t border-indigo-100 pt-4">
                      {/* Avatar with Initial */}
                      <div className="flex-shrink-0">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#4338ca] via-[#4f46e5] to-[#6366f1] shadow-[0_12px_30px_-18px_rgba(99,102,241,0.35)]">
                          <span className="text-xl font-bold text-white">
                            {testimonial.name.split(' ')[1].charAt(0)}
                          </span>
                        </div>
                      </div>

                      {/* Name and Title */}
                      <div className="flex-1">
                        <h4 className="text-base font-semibold text-slate-900">
                          {testimonial.name}
                        </h4>
                        <p className="mt-1 text-sm text-slate-500">
                          {testimonial.title}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </RevealOnScroll>
  </section>
  );
};

export default Testimonials;