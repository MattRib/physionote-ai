'use client';

import Link from 'next/link';
import { Mic, Sparkles } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';

const Hero = () => {
  const prefersReducedMotion = useReducedMotion();
  const easeOut = [0.16, 1, 0.3, 1] as const;
  const easeInOut = [0.37, 0, 0.63, 1] as const;
  const linearEase = [0, 0, 1, 1] as const;

  const fadeUpProps = (delay = 0) => ({
    initial: { opacity: 0, y: prefersReducedMotion ? 0 : 28 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: prefersReducedMotion ? 0.45 : 0.7, ease: easeOut, delay }
  });

  const floatingShapes = [
    {
      className:
        'absolute -top-32 -left-16 h-72 w-72 rounded-[32px] bg-gradient-to-br from-[#c7d2fe]/60 via-[#e0e7ff]/40 to-transparent blur-[140px] opacity-90',
      animate: prefersReducedMotion ? { y: 0 } : { y: [-26, 10, -26] },
      transition: prefersReducedMotion ? undefined : { duration: 16, repeat: Infinity, ease: easeInOut, repeatType: 'mirror' as const }
    },
    {
      className:
        'absolute -bottom-28 right-[-5rem] h-[26rem] w-[26rem] rounded-full bg-[conic-gradient(from_140deg,rgba(129,140,248,0.55),rgba(191,219,254,0.25),transparent_70%)] blur-[170px] opacity-75',
      animate: prefersReducedMotion ? { rotate: 0 } : { rotate: [0, 360] },
      transition: prefersReducedMotion ? undefined : { duration: 48, repeat: Infinity, ease: linearEase }
    }
  ];

  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center overflow-hidden bg-gradient-to-br from-[#f6f8ff] via-white to-[#eef2ff] pt-32 pb-20 text-slate-900 sm:pt-36 lg:pt-40"
    >
      {/* Lighter ambient glow keeps depth without darkening the hero. */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(191,219,254,0.55),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_18%,rgba(221,214,254,0.45),transparent_62%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(125deg,rgba(226,232,255,0.5)_0%,rgba(255,255,255,0)_70%)]" />
      </div>

      <div className="absolute inset-0 overflow-hidden">
        {floatingShapes.map(({ className, animate, transition }, index) => (
          <motion.div key={index} className={className} aria-hidden="true" animate={animate} transition={transition} />
        ))}
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:items-center">
          <div className="relative">
            <motion.div
              className="pointer-events-none absolute -inset-6 rounded-[36px] border border-white/60 bg-white blur-3xl sm:-inset-8"
              aria-hidden="true"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, ease: easeOut, delay: 0.3 }}
            />

            <div className="relative space-y-8">
              <motion.div
                className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white px-4 py-2 text-sm font-medium text-indigo-600 shadow-sm backdrop-blur-xl"
                {...fadeUpProps(0.1)}
              >
                <Sparkles className="h-4 w-4" />
                Documentação guiada por IA
              </motion.div>

              <motion.h1
                className="hero-text-shadow text-4xl font-bold leading-tight text-slate-900 md:text-5xl lg:text-6xl"
                {...fadeUpProps(0.2)}
              >
                Transforme sua prática com a{' '}
                <span className="inline-block bg-gradient-to-r from-[#4f46e5] via-[#6366f1] to-[#a855f7] bg-clip-text text-transparent">
                  documentação inteligente
                </span>{' '}
                de sessões de fisioterapia
              </motion.h1>

              <motion.p
                className="max-w-xl text-lg leading-relaxed text-slate-600 hero-subtitle-shadow"
                {...fadeUpProps(0.35)}
              >
                Automatize a documentação de consultas com IA para fisioterapeutas, economizando tempo e garantindo precisão em cada sessão.
              </motion.p>

              <motion.div className="flex flex-col gap-4 sm:flex-row" {...fadeUpProps(0.45)}>
                <Link href="/login">
                  <span className="inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-[#4f46e5] via-[#6366f1] to-[#818cf8] px-8 py-4 text-lg font-semibold text-white shadow-[0_18px_50px_-18px_rgba(99,102,241,0.45)] transition duration-300 hover:from-[#4338ca] hover:via-[#4f46e5] hover:to-[#7c3aed] hover:shadow-[0_24px_70px_-26px_rgba(99,102,241,0.55)] focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 sm:w-auto">
                    Comece Agora
                  </span>
                </Link>
                <Link href="#features">
                  <span className="inline-flex w-full items-center justify-center rounded-xl border border-indigo-100 px-8 py-4 text-lg font-semibold text-indigo-600 backdrop-blur-lg transition duration-300 hover:border-indigo-200 hover:bg-indigo-50/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-200 sm:w-auto">
                    Veja como Funciona
                  </span>
                </Link>
              </motion.div>
            </div>
          </div>

          <div className="relative flex h-full items-center justify-center lg:justify-end">
            <div className="relative w-full max-w-lg">
              <motion.div
                className="absolute -top-24 left-12 h-44 w-44 rounded-full bg-gradient-to-br from-[#c7d2fe]/40 via-[#e0e7ff]/30 to-transparent blur-[130px]"
                aria-hidden="true"
                animate={prefersReducedMotion ? { y: 0 } : { y: [-18, 12, -18] }}
                transition={prefersReducedMotion ? undefined : { duration: 18, repeat: Infinity, ease: easeInOut, repeatType: 'mirror' }}
              />
              <motion.div
                className="absolute -bottom-20 right-4 h-56 w-56 rounded-[46px] bg-gradient-to-br from-[#dbeafe]/70 via-[#e0e7ff]/45 to-[#eef2ff]/60 blur-3xl shadow-[0_40px_120px_-55px_rgba(79,70,229,0.35)]"
                aria-hidden="true"
                animate={prefersReducedMotion ? { rotate: 0 } : { rotate: [0, 360] }}
                transition={prefersReducedMotion ? undefined : { duration: 52, repeat: Infinity, ease: linearEase }}
              />

              <motion.div
                className="relative overflow-hidden rounded-[36px] border border-indigo-100 bg-white/80 p-1 shadow-[0_32px_120px_-48px_rgba(99,102,241,0.35)] backdrop-blur-xl"
                {...fadeUpProps(0.55)}
              >
                <div className="rounded-[28px] bg-gradient-to-br from-white via-[#eef2ff] to-[#e0e7ff] p-10">
                  <motion.div
                    className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#4338ca] via-[#4f46e5] to-[#6366f1] shadow-[0_16px_40px_-18px_rgba(99,102,241,0.45)]"
                    animate={prefersReducedMotion ? { y: 0 } : { y: [-8, 6, -8] }}
                    transition={prefersReducedMotion ? undefined : { duration: 10, repeat: Infinity, ease: easeInOut, repeatType: 'mirror' }}
                  >
                    <Mic className="h-9 w-9 text-white" />
                  </motion.div>

                  <div className="mt-8 space-y-6 text-left text-slate-600">
                    <div>
                      <p className="text-sm uppercase tracking-[0.3em] text-indigo-400">IA Clínica</p>
                      <p className="mt-2 text-2xl font-semibold text-slate-900">Protocolos automatizados</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="rounded-2xl border border-indigo-100 bg-white p-4 text-sm text-slate-600 shadow-sm">
                        <p className="font-medium text-slate-900">Registro Instantâneo</p>
                        <p>Notas em segundos após cada sessão.</p>
                      </div>
                      <div className="rounded-2xl border border-indigo-100 bg-white p-4 text-sm text-slate-600 shadow-sm">
                        <p className="font-medium text-slate-900">Insights Assistidos</p>
                        <p>Sugestões alinhadas aos objetivos terapêuticos.</p>
                      </div>
                    </div>
                    <p className="text-sm text-slate-500">
                      Ajuste as cores das formas translúcidas em <code>Hero.tsx</code> ou personalize os motion variants em <code>Hero.tsx</code> e <code>RevealOnScroll.tsx</code> para alinhar o visual à identidade da marca.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
