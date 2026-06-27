'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { Zap, Star, Crown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import { EASE_OUT } from './animation-constants';

interface LandingPricingProps {
  isAuthenticated: boolean;
}

const PACKAGES = [
  {
    id: 'starter',
    name: 'Starter',
    credits: 50,
    price: 'R$ 29',
    priceNote: ',00',
    perCredit: 'R$ 0,58 / crédito',
    popular: false,
    Icon: Zap,
    accentFrom: 'oklch(0.65 0.15 220)',
    accentTo: 'oklch(0.52 0.18 250)',
    features: [
      '50 créditos',
      'Consulta CNPJ completa',
      'Filtros por CNAE e UF',
      'Exportação XLSX',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    credits: 150,
    price: 'R$ 59',
    priceNote: ',00',
    perCredit: 'R$ 0,39 / crédito',
    popular: true,
    Icon: Star,
    accentFrom: 'oklch(0.68 0.25 320)',
    accentTo: 'oklch(0.52 0.24 290)',
    features: [
      '150 créditos',
      'Consulta CNPJ completa',
      'Filtros por CNAE e UF',
      'Exportação XLSX',
      'Melhor custo-benefício',
    ],
  },
  {
    id: 'max',
    name: 'Max',
    credits: 500,
    price: 'R$ 149',
    priceNote: ',00',
    perCredit: 'R$ 0,30 / crédito',
    popular: false,
    Icon: Crown,
    accentFrom: 'oklch(0.72 0.20 60)',
    accentTo: 'oklch(0.58 0.22 40)',
    features: [
      '500 créditos',
      'Consulta CNPJ completa',
      'Filtros por CNAE e UF',
      'Exportação XLSX',
      'Maior volume de prospecção',
    ],
  },
];

export function LandingPricing({ isAuthenticated }: LandingPricingProps) {
  const reduced = useReducedMotion();

  return (
    <section
      id="precos"
      aria-labelledby="pricing-heading"
      className="py-24 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-5xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, ease: EASE_OUT }}
          className="text-center mb-10"
        >
          <p
            className="text-xs font-semibold uppercase tracking-widest mb-2"
            style={{ color: 'oklch(0.52 0.22 290)' }}
          >
            Preços
          </p>
          <h2
            id="pricing-heading"
            className="text-3xl md:text-4xl font-bold mb-4"
            style={{ letterSpacing: '-0.025em' }}
          >
            Pague pelo que usar
          </h2>
          <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
            Comece com 5 créditos grátis ao criar sua conta. Sem assinaturas, sem contratos.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PACKAGES.map((pkg, i) => (
            <motion.div
              key={pkg.id}
              initial={reduced ? false : { opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, ease: EASE_OUT, delay: reduced ? 0 : i * 0.09 }}
              className="relative"
            >
              {pkg.popular && (
                <div
                  className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10 px-3 py-1 rounded-full text-xs font-semibold text-white whitespace-nowrap"
                  style={{
                    background:
                      'linear-gradient(135deg, oklch(0.68 0.25 320), oklch(0.52 0.24 290))',
                  }}
                >
                  ✦ Mais Popular
                </div>
              )}

              <div
                className={cn('rounded-2xl h-full flex flex-col p-6', !pkg.popular && 'border')}
                style={
                  pkg.popular
                    ? {
                        background:
                          'linear-gradient(160deg, oklch(0.26 0.06 290), oklch(0.20 0.05 290))',
                        boxShadow:
                          '0 4px 24px oklch(0.52 0.24 290 / 0.30), 0 0 0 2px oklch(0.68 0.25 320)',
                      }
                    : {
                        borderColor: 'var(--border)',
                        background: 'var(--card)',
                      }
                }
              >
                {/* Header */}
                <div className="flex items-center gap-3 mb-5">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{
                      background: `linear-gradient(135deg, ${pkg.accentFrom}, ${pkg.accentTo})`,
                    }}
                  >
                    <pkg.Icon size={18} color="white" />
                  </div>
                  <div>
                    <div
                      className="font-bold text-base"
                      style={{ color: pkg.popular ? 'white' : 'var(--foreground)' }}
                    >
                      {pkg.name}
                    </div>
                    <div
                      className="text-xs"
                      style={{
                        color: pkg.popular
                          ? 'oklch(0.78 0.05 290)'
                          : 'var(--muted-foreground)',
                      }}
                    >
                      {pkg.credits} créditos
                    </div>
                  </div>
                </div>

                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-baseline gap-0.5">
                    <span
                      className="text-3xl font-extrabold"
                      style={{
                        color: pkg.popular ? 'white' : 'var(--foreground)',
                        fontVariantNumeric: 'tabular-nums',
                      }}
                    >
                      {pkg.price}
                    </span>
                    <span
                      className="text-base font-semibold"
                      style={{
                        color: pkg.popular ? 'oklch(0.85 0.04 290)' : 'var(--foreground)',
                      }}
                    >
                      {pkg.priceNote}
                    </span>
                  </div>
                  <p
                    className="text-xs mt-1"
                    style={{
                      color: pkg.popular
                        ? 'oklch(0.70 0.05 290)'
                        : 'var(--muted-foreground)',
                    }}
                  >
                    {pkg.perCredit}
                  </p>
                </div>

                {/* Features */}
                <ul className="flex flex-col gap-2.5 mb-8 flex-1">
                  {pkg.features.map((feat) => (
                    <li key={feat} className="flex items-center gap-2">
                      <Check
                        size={14}
                        className="shrink-0"
                        style={{
                          color: pkg.popular
                            ? 'oklch(0.80 0.18 310)'
                            : 'oklch(0.52 0.22 290)',
                        }}
                      />
                      <span
                        className="text-sm"
                        style={{
                          color: pkg.popular ? 'oklch(0.88 0.03 290)' : 'var(--foreground)',
                        }}
                      >
                        {feat}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Link
                  href={isAuthenticated ? '/creditos' : '/register'}
                  className={cn(
                    buttonVariants({ variant: pkg.popular ? 'default' : 'outline' }),
                    'w-full justify-center font-semibold'
                  )}
                  style={
                    pkg.popular
                      ? { background: 'oklch(0.68 0.25 320)', color: 'white' }
                      : {}
                  }
                >
                  {isAuthenticated
                    ? `Comprar ${pkg.name}`
                    : `Começar com ${pkg.name}`}
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
