'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Coins, History, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LogoutButton } from '@/components/features/auth/logout-button';
import { NavLinks } from './NavLinks';
import { CreditsBadge } from './CreditsBadge';
import { NavBadge } from './NavBadge';

const EASE_OUT = [0.16, 1, 0.3, 1] as const;

const mobileLinks = [
  { href: '/consulta',         label: 'Consulta',         icon: null    },
  { href: '/minhas-consultas', label: 'Minhas Consultas', icon: History },
  { href: '/busca-cnpj',       label: 'Busca CNPJ',       icon: null,    badge: 'Gratuito' },
  { href: '/creditos',         label: 'Registros',        icon: Coins   },
];

interface DashboardNavProps {
  userEmail: string;
}

export function DashboardNav({ userEmail }: DashboardNavProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const reduced = useReducedMotion();
  const pathname = usePathname();
  const initials = userEmail.charAt(0).toUpperCase();

  return (
    <header
      className="sticky top-0 z-40"
      style={{
        background: 'var(--nav-bg)',
        borderBottom: '1px solid oklch(0 0 0 / 0.12)',
      }}
    >
      {/* Header bar */}
      <div className="flex items-center px-4 sm:px-6 lg:px-8 h-14">
        <Link href="/dashboard" className="flex items-center gap-2.5 shrink-0">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm shrink-0"
            style={{
              background: 'linear-gradient(135deg, oklch(0.68 0.25 320), oklch(0.52 0.24 290))',
            }}
          >
            S
          </div>
          <span
            className="font-bold text-base"
            style={{ color: 'var(--nav-fg)', letterSpacing: '-0.015em' }}
          >
            Systa
          </span>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex">
          <NavLinks />
        </div>

        {/* Desktop right side */}
        <div className="ml-auto hidden md:flex items-center gap-3">
          <CreditsBadge />
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
            style={{ background: 'oklch(0.68 0.25 320)', color: '#fff' }}
          >
            {initials}
          </div>
          <span className="text-sm hidden sm:block" style={{ color: 'var(--nav-muted)' }}>
            {userEmail}
          </span>
          <LogoutButton />
        </div>

        {/* Mobile right side */}
        <div className="ml-auto flex md:hidden items-center gap-2">
          <CreditsBadge />
          <button
            className="p-2 rounded-md transition-colors hover:bg-white/10"
            style={{ color: 'var(--nav-fg)' }}
            onClick={() => setMobileOpen((o) => !o)}
            aria-expanded={mobileOpen}
            aria-controls="dashboard-mobile-menu"
            aria-label={mobileOpen ? 'Fechar menu' : 'Abrir menu de navegação'}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="dashboard-mobile-menu"
            initial={reduced ? false : { opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: EASE_OUT }}
            className="md:hidden overflow-hidden"
            style={{ borderTop: '1px solid oklch(1 0 0 / 0.08)' }}
          >
            <nav
              aria-label="Navegação mobile"
              className="flex flex-col px-4 py-3 gap-1"
            >
              {mobileLinks.map(({ href, label, icon: Icon, badge }) => {
                const active = pathname.startsWith(href);
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      'flex items-center gap-2.5 px-3 py-2.5 rounded-md text-sm font-medium transition-colors',
                      active ? 'bg-white/15' : 'hover:bg-white/10',
                    )}
                    style={{ color: active ? 'var(--nav-fg)' : 'var(--nav-muted)' }}
                  >
                    {Icon && <Icon className="size-4 shrink-0" aria-hidden="true" />}
                    {label}
                    {badge && <NavBadge>{badge}</NavBadge>}
                  </Link>
                );
              })}

              {/* User section */}
              <div
                className="flex items-center gap-3 mt-2 pt-3"
                style={{ borderTop: '1px solid oklch(1 0 0 / 0.12)' }}
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
                  style={{ background: 'oklch(0.68 0.25 320)', color: '#fff' }}
                >
                  {initials}
                </div>
                <span className="text-sm truncate flex-1" style={{ color: 'var(--nav-muted)' }}>
                  {userEmail}
                </span>
                <LogoutButton />
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
