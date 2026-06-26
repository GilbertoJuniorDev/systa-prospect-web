'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const links = [
  { href: '/consulta', label: 'Consulta' },
  { href: '/busca-cnpj', label: 'Busca CNPJ' },
];

export function NavLinks() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-1 ml-8">
      {links.map(({ href, label }) => {
        const active = pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              'px-3 py-1 rounded-md text-sm font-medium transition-colors',
              active
                ? 'text-white bg-white/15'
                : 'hover:bg-white/10',
            )}
            style={{
              color: active ? 'var(--nav-fg)' : 'var(--nav-muted)',
            }}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
