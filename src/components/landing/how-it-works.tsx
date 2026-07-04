'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { EASE_OUT } from './animation-constants';

const STEPS = [
  {
    number: '01',
    title: 'Cadastre-se grátis',
    description:
      'Crie sua conta em segundos. Sem cartão de crédito. Ganhe 5 registros de bônus para começar a explorar a plataforma.',
  },
  {
    number: '02',
    title: 'Consulte e filtre',
    description:
      'Pesquise por CNPJ ou use filtros avançados por CNAE, estado, município e situação para encontrar exatamente quem você quer.',
  },
  {
    number: '03',
    title: 'Exporte e prospecte',
    description:
      'Baixe sua lista qualificada em Excel e inicie sua prospecção com dados atualizados direto da Receita Federal.',
  },
];

export function LandingHowItWorks() {
  const reduced = useReducedMotion();

  return (
    <section
      id="como-funciona"
      aria-labelledby="how-heading"
      className="py-24 px-4 sm:px-6 lg:px-8"
      style={{ background: 'var(--secondary)' }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, ease: EASE_OUT }}
          className="mb-16 text-center"
        >
          <p
            className="text-xs font-semibold uppercase tracking-widest mb-2"
            style={{ color: 'oklch(0.52 0.22 290)' }}
          >
            Como Funciona
          </p>
          <h2
            id="how-heading"
            className="text-3xl md:text-4xl font-bold mb-4"
            style={{ letterSpacing: '-0.025em' }}
          >
            Simples, rápido e sem burocracia
          </h2>
          <p className="text-lg max-w-xl mx-auto" style={{ color: 'var(--muted-foreground)' }}>
            Em 3 passos você já está prospectando com dados reais.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Connector line (desktop only) */}
          <div
            aria-hidden
            className="hidden md:block absolute top-5 left-[calc(16.66%+22px)] right-[calc(16.66%+22px)]"
            style={{ borderTop: '2px dashed var(--border)' }}
          />

          {STEPS.map((step, i) => (
            <motion.div
              key={step.number}
              initial={reduced ? false : { opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, ease: EASE_OUT, delay: reduced ? 0 : i * 0.12 }}
              className="relative flex flex-col items-center text-center md:items-start md:text-left"
            >
              {/* Number bubble */}
              <div
                className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-sm mb-5 relative z-10 shrink-0"
                style={{
                  background:
                    'linear-gradient(135deg, oklch(0.68 0.25 320), oklch(0.52 0.24 290))',
                }}
              >
                {step.number}
              </div>
              <h3 className="text-lg font-bold mb-2">{step.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
