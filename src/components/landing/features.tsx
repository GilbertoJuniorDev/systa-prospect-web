'use client';

import { Search, Filter, FileSpreadsheet, Coins } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { EASE_OUT } from './animation-constants';

const FEATURES = [
  {
    Icon: Search,
    title: 'Busca por CNPJ',
    description:
      'Consulte qualquer empresa brasileira com dados completos: razão social, endereço, sócios, CNAE e situação cadastral.',
    gradientFrom: 'oklch(0.68 0.25 320)',
    gradientTo: 'oklch(0.52 0.24 290)',
  },
  {
    Icon: Filter,
    title: 'Filtro por CNAE',
    description:
      'Segmente estabelecimentos por código de atividade econômica, estado, município e situação com precisão cirúrgica.',
    gradientFrom: 'oklch(0.55 0.18 220)',
    gradientTo: 'oklch(0.52 0.20 250)',
  },
  {
    Icon: FileSpreadsheet,
    title: 'Exportação XLSX',
    description:
      'Baixe sua lista qualificada em planilha Excel pronta para uso no seu CRM ou ferramenta de prospecção.',
    gradientFrom: 'oklch(0.55 0.18 142)',
    gradientTo: 'oklch(0.52 0.16 160)',
  },
  {
    Icon: Coins,
    title: 'Registros sem assinatura',
    description:
      'Pague apenas pelo que usar. Sem mensalidades, sem contratos. Compre registros quando precisar.',
    gradientFrom: 'oklch(0.72 0.20 60)',
    gradientTo: 'oklch(0.58 0.22 40)',
  },
];

export function LandingFeatures() {
  const reduced = useReducedMotion();

  return (
    <section
      id="recursos"
      aria-labelledby="features-heading"
      className="py-24 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, ease: EASE_OUT }}
          className="mb-12"
        >
          <p
            className="text-xs font-semibold uppercase tracking-widest mb-2"
            style={{ color: 'oklch(0.52 0.22 290)' }}
          >
            Funcionalidades
          </p>
          <h2
            id="features-heading"
            className="text-3xl md:text-4xl font-bold mb-4"
            style={{ letterSpacing: '-0.025em' }}
          >
            Tudo que você precisa para prospectar
          </h2>
          <p className="text-lg max-w-xl" style={{ color: 'var(--muted-foreground)' }}>
            Dados precisos do Cadastro Nacional de Pessoas Jurídicas (CNPJ) em suas mãos.
          </p>
        </motion.div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURES.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={reduced ? false : { opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, ease: EASE_OUT, delay: reduced ? 0 : i * 0.08 }}
            >
              <Card
                className="h-full transition-shadow duration-200 hover:shadow-md"
                style={{ boxShadow: '0 0 0 1px oklch(0 0 0 / 0.06)' }}
              >
                <CardContent className="p-5">
                  {/* Icon */}
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                    style={{
                      background: `linear-gradient(135deg, ${feature.gradientFrom}, ${feature.gradientTo})`,
                    }}
                  >
                    <feature.Icon size={20} color="white" />
                  </div>
                  <h3 className="font-semibold text-base mb-2">{feature.title}</h3>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: 'var(--muted-foreground)' }}
                  >
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
