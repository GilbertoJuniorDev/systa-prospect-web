'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import { EASE_OUT } from './animation-constants';

interface LandingCtaProps {
  isAuthenticated: boolean;
}

export function LandingCta({ isAuthenticated }: LandingCtaProps) {
  const reduced = useReducedMotion();

  return (
    <section aria-labelledby="cta-heading" className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: EASE_OUT }}
          className="relative overflow-hidden rounded-3xl px-8 py-16 text-center"
          style={{
            background:
              'linear-gradient(135deg, oklch(0.38 0.24 290), oklch(0.28 0.16 290))',
          }}
        >
          {/* Decorative blobs */}
          <div
            aria-hidden
            className="pointer-events-none absolute -top-20 -right-20 w-72 h-72 rounded-full"
            style={{
              background:
                'radial-gradient(ellipse, oklch(0.68 0.25 320 / 0.18), transparent 70%)',
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-16 -left-16 w-56 h-56 rounded-full"
            style={{
              background:
                'radial-gradient(ellipse, oklch(0.52 0.22 290 / 0.20), transparent 70%)',
            }}
          />

          <div className="relative max-w-2xl mx-auto">
            <h2
              id="cta-heading"
              className="font-extrabold mb-4"
              style={{
                fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
                letterSpacing: '-0.03em',
                color: 'white',
              }}
            >
              Comece a prospectar agora mesmo
            </h2>
            <p
              className="text-base md:text-lg mb-8"
              style={{ color: 'oklch(0.78 0.05 290)' }}
            >
              Crie sua conta grátis e ganhe 5 créditos para explorar a plataforma.{' '}
              Sem cartão de crédito, sem mensalidade.
            </p>

            <Link
              href={isAuthenticated ? '/dashboard' : '/register'}
              className={cn(
                buttonVariants({ size: 'lg' }),
                'h-12 px-8 text-base font-semibold rounded-xl inline-flex'
              )}
              style={{ background: 'white', color: 'oklch(0.28 0.16 290)' }}
            >
              {isAuthenticated ? 'Acessar o Dashboard' : 'Criar conta grátis'}
            </Link>

            <p className="mt-5 text-xs" style={{ color: 'oklch(0.60 0.06 290)' }}>
              Dados baseados no CNPJ / Receita Federal do Brasil
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
