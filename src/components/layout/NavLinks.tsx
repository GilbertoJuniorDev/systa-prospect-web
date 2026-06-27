'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Coins } from 'lucide-react';
import { cn } from '@/lib/utils';

const links = [
  { href: '/consulta', label: 'Consulta', icon: null },
  { href: '/busca-cnpj', label: 'Busca CNPJ', icon: null },
  { href: '/creditos', label: 'Créditos', icon: Coins },
];

export function NavLinks() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-1 ml-8">
      {links.map(({ href, label, icon: Icon }) => {
        const active = pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1 rounded-md text-sm font-medium transition-colors',
              active
                ? 'text-white bg-white/15'
                : 'hover:bg-white/10',
            )}
            style={{
              color: active ? 'var(--nav-fg)' : 'var(--nav-muted)',
            }}
          >
            {Icon && <Icon className="size-3.5 shrink-0" />}
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
