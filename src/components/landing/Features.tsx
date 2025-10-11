'use client';

import React from 'react';
import { RevealOnScroll } from '@/components/common';

const Features = () => {
  const stats = [
    { label: 'Tempo médio economizado por sessão', value: '22 min' },
    { label: 'Profissionais ativos na plataforma', value: '2.300+' },
    { label: 'Notas geradas mensalmente', value: '140 mil' }
  ];

  const workflows = [
    'Registro completo da sessão em menos de 3 minutos',
    'Modelos de nota personalizáveis por especialidade',
    'Relatórios exportáveis prontos para auditorias',
    'Integração simples com prontuários eletrônicos'
  ];

  const features = [
    {
      icon: (
  <svg className="h-12 w-12 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
          />
        </svg>
      ),
      category: 'Captura Inteligente',
      title: 'Gravação e Transcrição Automática',
      description: 'Transcreve em tempo real, identifica interlocutores e separa o conteúdo relevante por fase da consulta.',
      highlights: ['Detecção de voz em PT-BR', 'Remoção de ruído ambiente', 'Suporte a áudio externo']
    },
    {
      icon: (
  <svg className="h-12 w-12 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      category: 'Documentação Clínica',
      title: 'Evidências com Timestamps',
      description: 'Relaciona cada recomendação com o momento exato da fala do paciente para auditorias e revisões rápidas.',
      highlights: ['Busca por palavra-chave', 'Links clicáveis', 'Resumo automático por tópicos']
    },
    {
      icon: (
  <svg className="h-12 w-12 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      ),
      category: 'Integrações',
      title: 'Exportação em PDF/JSON',
      description: 'Disponibiliza os dados em formatos interoperáveis para prontuários, billing e BI sem retrabalho manual.',
      highlights: ['Templates customizáveis', 'Webhook de saída', 'Exportação em lote']
    },
    {
      icon: (
  <svg className="h-12 w-12 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          />
        </svg>
      ),
      category: 'Segurança e Compliance',
      title: 'Segurança e Conformidade',
      description: 'Dados criptografados de ponta a ponta, consentimento versionado e logs completos para proteção jurídica.',
      highlights: ['LGPD-ready', 'Hospedagem em nuvem local', 'Backups automáticos']
    },
    {
      icon: (
  <svg className="h-12 w-12 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11 5h2m-1-2v6m-6 4h12m-9 4h6"
          />
        </svg>
      ),
      category: 'Assistente Clínico',
      title: 'Protocolos Sugeridos com IA',
      description: 'Recomenda condutas baseadas nas evidências coletadas e no histórico do paciente, mantendo você no controle.',
      highlights: ['Cross-check com histórico', 'Alertas de risco', 'Notas comentadas pelo profissional']
    },
    {
      icon: (
  <svg className="h-12 w-12 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      ),
      category: 'Governança',
      title: 'Painel de Indicadores em Tempo Real',
      description: 'Acompanha produtividade, adesão e evolução clínica com dashboards configuráveis para equipes e gestores.',
      highlights: ['KPIs prontos para exportação', 'Comparativo entre unidades', 'Alertas de follow-up pendente']
    }
  ];

  return (
    <section id="features" className="relative overflow-hidden bg-[#f8fafc] py-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(224,231,255,0.55)_0%,transparent_65%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(140deg,rgba(191,219,254,0.35)_0%,transparent_60%)]" />
      <div className="pointer-events-none absolute inset-x-1/3 -top-24 h-72 rounded-full bg-gradient-to-br from-[#c7d2fe]/50 via-[#e0e7ff]/35 to-transparent blur-[160px]" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-x-1/2 bottom-[-18rem] h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(191,219,254,0.28),transparent_70%)] blur-[180px]" aria-hidden="true" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <RevealOnScroll>
            <div className="max-w-xl space-y-8">
              <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1 text-sm font-medium text-indigo-600 ring-1 ring-inset ring-indigo-100">
                Plataforma completa para fisioterapeutas de alta performance
              </span>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
                Estruture todo o ciclo de atendimento com dados confiáveis e automações inteligentes
              </h2>
              <p className="text-lg leading-8 text-slate-600">
                O PhysioNote.AI acompanha a equipe desde a primeira conversa com o paciente até a entrega do relatório final, garantindo notas consistentes, seguras e prontas para auditoria.
              </p>
              <ul className="grid gap-4 text-left text-base text-slate-600 sm:grid-cols-2">
                {workflows.map((item) => (
                  <li key={item} className="flex items-start gap-3 rounded-lg border border-indigo-100 bg-white px-4 py-3 shadow-sm">
                    <svg className="mt-1 h-4 w-4 text-indigo-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-7.25 7.25a1 1 0 01-1.414 0l-3.5-3.5a1 1 0 111.414-1.414l2.793 2.793 6.543-6.543a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </RevealOnScroll>

          <RevealOnScroll>
            <div className="grid gap-6 rounded-3xl border border-indigo-100 bg-white/80 p-8 shadow-[0_28px_80px_-40px_rgba(99,102,241,0.25)] backdrop-blur-sm">
              <h3 className="text-lg font-semibold text-slate-900">Impacto comprovado</h3>
              <div className="grid gap-6 sm:grid-cols-3">
                {stats.map((stat) => (
                  <div key={stat.label} className="rounded-2xl border border-indigo-50 bg-white p-5 text-center shadow-sm">
                    <span className="text-3xl font-bold text-indigo-500">{stat.value}</span>
                    <p className="mt-2 text-sm text-slate-500">{stat.label}</p>
                  </div>
                ))}
              </div>
              <p className="text-sm text-slate-500">
                Dados levantados com base nos clientes que utilizam a plataforma há pelo menos 3 meses. Resultados variam conforme perfil do consultório e fluxo de atendimento.
              </p>
            </div>
          </RevealOnScroll>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
          {features.map((feature, index) => (
            <RevealOnScroll key={feature.title} delay={index * 0.08}>
              <div className="feature-card group relative flex h-full flex-col overflow-hidden rounded-2xl border border-indigo-100 bg-white p-8 shadow-[0_20px_60px_-36px_rgba(99,102,241,0.18)] transition-all duration-500 ease-out hover:-translate-y-3 hover:scale-[1.02] hover:border-indigo-200 hover:shadow-[0_28px_80px_-40px_rgba(99,102,241,0.28)]">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-transparent via-transparent to-transparent transition-all duration-500 group-hover:from-indigo-50 group-hover:via-indigo-100/50 group-hover:to-transparent" />

                <div className="relative flex flex-1 flex-col items-start text-left">
                  <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium uppercase tracking-wide text-indigo-600 ring-1 ring-inset ring-indigo-100">
                    {feature.category}
                  </span>

                  <div className="feature-icon-wrapper mb-6 w-fit rounded-full bg-indigo-50 p-4 transition-all duration-500 ease-out group-hover:bg-indigo-100 group-hover:rotate-6 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-indigo-200">
                    <div className="transition-transform duration-500 group-hover:scale-110 text-indigo-500">{feature.icon}</div>
                  </div>

                  <h3 className="mb-3 text-xl font-semibold text-slate-900 transition-colors duration-300 group-hover:text-indigo-600">
                    {feature.title}
                  </h3>

                  <p className="feature-description mb-6 leading-relaxed text-slate-600 transition-colors duration-300 group-hover:text-slate-700">
                    {feature.description}
                  </p>

                  <ul className="mt-auto grid gap-2 text-sm text-slate-600">
                    {feature.highlights.map((highlight) => (
                      <li key={highlight} className="flex items-center gap-2 rounded-md bg-indigo-50 px-3 py-2 text-left">
                        <svg className="h-3 w-3 text-indigo-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-7.25 7.25a1 1 0 01-1.414 0l-3.5-3.5a1 1 0 111.414-1.414l2.793 2.793 6.543-6.543a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
