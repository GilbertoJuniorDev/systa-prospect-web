'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { CheckCircle2, Coins } from 'lucide-react';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import { EASE_OUT, staggerContainer, staggerItem } from './animation-constants';

interface LandingFreeTrialProps {
  isAuthenticated: boolean;
}

const BULLETS = [
  'Busque qualquer empresa pelo CNPJ',
  'Filtre por CNAE, estado e município',
  'Exporte até 50 registros em Excel',
  'Sem cartão de crédito necessário',
];

const CREDITS = Array.from({ length: 5 });

export function LandingFreeTrial({ isAuthenticated }: LandingFreeTrialProps) {
  const reduced = useReducedMotion();

  return (
    <section
      aria-labelledby="free-trial-heading"
      className="py-24 px-4 sm:px-6 lg:px-8"
      style={{ background: 'oklch(0.52 0.22 290 / 0.04)' }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Text content */}
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.55, ease: EASE_OUT }}
          >
            {/* Badge */}
            <span
              className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest px-3 py-1.5 rounded-full mb-6"
              style={{
                background: 'oklch(0.52 0.22 290 / 0.10)',
                color: 'oklch(0.52 0.22 290)',
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: 'oklch(0.52 0.22 290)' }}
              />
              Teste Gratuito
            </span>

            <h2
              id="free-trial-heading"
              className="font-extrabold mb-4"
              style={{
                fontSize: 'clamp(1.75rem, 3vw, 2.75rem)',
                letterSpacing: '-0.03em',
                color: 'var(--foreground)',
              }}
            >
              Ganhe{' '}
              <span
                style={{
                  background: 'linear-gradient(135deg, oklch(0.68 0.25 320), oklch(0.52 0.24 290))',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                5 registros
              </span>{' '}
              ao criar sua conta
            </h2>

            <p
              className="text-base md:text-lg leading-relaxed mb-8"
              style={{ color: 'var(--muted-foreground)' }}
            >
              Explore a plataforma sem risco. Com os registros de bônus você já consegue
              testar filtros, buscar empresas e exportar resultados reais.
            </p>

            {/* Bullets */}
            <motion.ul
              variants={reduced ? undefined : staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: '-60px' }}
              className="space-y-3 mb-10"
              role="list"
            >
              {BULLETS.map((text) => (
                <motion.li
                  key={text}
                  variants={reduced ? undefined : staggerItem}
                  className="flex items-start gap-3 text-sm md:text-base"
                  style={{ color: 'var(--foreground)' }}
                >
                  <CheckCircle2
                    size={18}
                    className="mt-0.5 shrink-0"
                    style={{ color: 'oklch(0.52 0.22 290)' }}
                    aria-hidden
                  />
                  {text}
                </motion.li>
              ))}
            </motion.ul>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <Link
                href={isAuthenticated ? '/dashboard' : '/register'}
                className={cn(
                  buttonVariants({ size: 'lg' }),
                  'h-12 px-7 text-base font-semibold rounded-xl'
                )}
                style={{
                  background: 'oklch(0.52 0.22 290)',
                  color: 'white',
                  boxShadow: '0 4px 18px oklch(0.52 0.22 290 / 0.35)',
                }}
              >
                {isAuthenticated ? 'Ir para o Dashboard' : 'Criar conta grátis'}
              </Link>
              <p
                className="text-xs self-center"
                style={{ color: 'var(--muted-foreground)' }}
              >
                Sem cartão · 5 registros ao ativar · Comece em segundos
              </p>
            </div>
          </motion.div>

          {/* Right: Credit visual card */}
          <motion.div
            initial={reduced ? false : { opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, ease: EASE_OUT, delay: 0.1 }}
            className="flex justify-center lg:justify-end"
          >
            <div
              className="relative w-full max-w-sm rounded-2xl p-8"
              style={{
                background: 'oklch(1 0 0 / 0.80)',
                backdropFilter: 'blur(12px)',
                border: '1px solid oklch(0.52 0.22 290 / 0.15)',
                boxShadow:
                  '0 8px 32px oklch(0.52 0.22 290 / 0.10), 0 1px 2px oklch(0 0 0 / 0.06)',
              }}
            >
              {/* Decorative blob */}
              <div
                aria-hidden
                className="pointer-events-none absolute -top-10 -right-10 w-40 h-40 rounded-full"
                style={{
                  background:
                    'radial-gradient(ellipse, oklch(0.68 0.25 320 / 0.15), transparent 70%)',
                }}
              />

              {/* Card header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p
                    className="text-xs font-semibold uppercase tracking-widest mb-0.5"
                    style={{ color: 'oklch(0.52 0.22 290)' }}
                  >
                    Bônus de cadastro
                  </p>
                  <p
                    className="text-xs"
                    style={{ color: 'var(--muted-foreground)' }}
                  >
                    Creditado ao criar sua conta
                  </p>
                </div>
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{
                    background:
                      'linear-gradient(135deg, oklch(0.68 0.25 320), oklch(0.52 0.24 290))',
                  }}
                >
                  <Coins size={18} color="white" aria-hidden />
                </div>
              </div>

              {/* Credit amount */}
              <div className="mb-6">
                <div
                  className="text-7xl font-extrabold leading-none mb-1"
                  style={{
                    fontVariantNumeric: 'tabular-nums',
                    background:
                      'linear-gradient(135deg, oklch(0.68 0.25 320), oklch(0.52 0.24 290))',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  5
                </div>
                <p
                  className="text-base font-semibold"
                  style={{ color: 'var(--foreground)' }}
                >
                  registros grátis
                </p>
              </div>

              {/* Credit dots */}
              <div className="flex gap-2 mb-6" aria-label="5 registros disponíveis">
                {CREDITS.map((_, i) => (
                  <motion.div
                    key={i}
                    initial={reduced ? false : { scale: 0, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{
                      duration: 0.35,
                      ease: EASE_OUT,
                      delay: reduced ? 0 : 0.3 + i * 0.07,
                    }}
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{
                      background:
                        'linear-gradient(135deg, oklch(0.68 0.25 320), oklch(0.52 0.24 290))',
                      boxShadow: '0 2px 8px oklch(0.52 0.22 290 / 0.30)',
                    }}
                  >
                    <Coins size={16} color="white" aria-hidden />
                  </motion.div>
                ))}
              </div>

              {/* Footer info */}
              <div
                className="pt-5 flex items-center justify-between text-xs"
                style={{
                  borderTop: '1px solid oklch(0.52 0.22 290 / 0.10)',
                  color: 'var(--muted-foreground)',
                }}
              >
                <span>Sem expiração</span>
                <span
                  className="px-2 py-0.5 rounded-full text-xs font-medium"
                  style={{
                    background: 'oklch(0.52 0.22 290 / 0.08)',
                    color: 'oklch(0.52 0.22 290)',
                  }}
                >
                  Conta Gratuita
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
