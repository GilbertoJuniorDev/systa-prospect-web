'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import { EASE_OUT } from './animation-constants';

interface LandingNavbarProps {
  isAuthenticated: boolean;
}

const Logo = () => (
  <Link href="/" className="flex items-center gap-2.5 shrink-0">
    <div
      className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm select-none"
      style={{
        background: 'linear-gradient(135deg, oklch(0.68 0.25 320), oklch(0.52 0.24 290))',
      }}
    >
      S
    </div>
    <span className="font-bold text-base" style={{ color: 'var(--foreground)' }}>
      Systa
    </span>
  </Link>
);

const navLinks = [
  { href: '#recursos', label: 'Recursos' },
  { href: '#como-funciona', label: 'Como Funciona' },
  { href: '#precos', label: 'Preços' },
];

export function LandingNavbar({ isAuthenticated }: LandingNavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <motion.header
      initial={reduced ? false : { y: -8, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.35, ease: EASE_OUT }}
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-300',
        scrolled
          ? 'bg-background/90 backdrop-blur-sm shadow-sm border-b border-border'
          : 'bg-transparent'
      )}
    >
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:rounded-md focus:text-sm focus:font-medium"
      >
        Ir para conteúdo
      </a>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Logo />

          {/* Desktop nav links */}
          <nav aria-label="Navegação principal" className="hidden md:flex items-center gap-7">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium transition-colors duration-150 hover:text-foreground"
                style={{ color: 'var(--muted-foreground)' }}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center gap-2">
            {isAuthenticated ? (
              <Link
                href="/dashboard"
                className={cn(buttonVariants({ variant: 'default', size: 'sm' }))}
              >
                Ir para o Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }))}
                >
                  Entrar
                </Link>
                <Link
                  href="/register"
                  className={cn(buttonVariants({ variant: 'default', size: 'sm' }))}
                  style={{ background: 'oklch(0.52 0.22 290)', color: 'white' }}
                >
                  Começar Grátis
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-md"
            style={{ color: 'var(--foreground)' }}
            onClick={() => setMobileOpen((o) => !o)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            aria-label={mobileOpen ? 'Fechar menu' : 'Abrir menu de navegação'}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-menu"
            initial={reduced ? false : { opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: EASE_OUT }}
            className="md:hidden overflow-hidden border-t border-border bg-background"
          >
            <nav
              aria-label="Navegação mobile"
              className="flex flex-col px-4 py-4 gap-1"
            >
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium py-2.5 px-2 rounded-md transition-colors hover:text-foreground"
                  style={{ color: 'var(--muted-foreground)' }}
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <div className="flex flex-col gap-2 mt-3 pt-3 border-t border-border">
                {isAuthenticated ? (
                  <Link
                    href="/dashboard"
                    className={cn(buttonVariants({ variant: 'default' }), 'w-full justify-center')}
                    onClick={() => setMobileOpen(false)}
                  >
                    Ir para o Dashboard
                  </Link>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className={cn(buttonVariants({ variant: 'outline' }), 'w-full justify-center')}
                      onClick={() => setMobileOpen(false)}
                    >
                      Entrar
                    </Link>
                    <Link
                      href="/register"
                      className={cn(buttonVariants({ variant: 'default' }), 'w-full justify-center')}
                      style={{ background: 'oklch(0.52 0.22 290)', color: 'white' }}
                      onClick={() => setMobileOpen(false)}
                    >
                      Começar Grátis
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
