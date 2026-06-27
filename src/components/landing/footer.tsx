import Link from 'next/link';

const Logo = () => (
  <Link href="/" className="flex items-center gap-2.5 shrink-0">
    <div
      className="w-7 h-7 rounded-lg flex items-center justify-center text-white font-bold text-xs select-none"
      style={{
        background: 'linear-gradient(135deg, oklch(0.68 0.25 320), oklch(0.52 0.24 290))',
      }}
    >
      S
    </div>
    <span className="font-bold text-sm" style={{ color: 'var(--foreground)' }}>
      Systa
    </span>
  </Link>
);

const footerLinks = [
  { href: '#recursos', label: 'Recursos' },
  { href: '#como-funciona', label: 'Como Funciona' },
  { href: '#precos', label: 'Preços' },
  { href: '/login', label: 'Entrar' },
  { href: '/register', label: 'Criar conta' },
];

export function LandingFooter() {
  return (
    <footer className="border-t px-4 sm:px-6 lg:px-8 py-10" style={{ borderColor: 'var(--border)' }}>
      <div className="max-w-6xl mx-auto">
        {/* Row 1 */}
        <div className="flex flex-wrap items-center justify-between gap-6 mb-8">
          <Logo />
          <nav aria-label="Links do rodapé" className="flex flex-wrap gap-x-6 gap-y-2">
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm transition-colors duration-150"
                style={{ color: 'var(--muted-foreground)' }}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Row 2 */}
        <div
          className="flex flex-wrap items-center justify-between gap-4 pt-6 text-xs"
          style={{ borderTop: '1px solid var(--border)', color: 'var(--muted-foreground)' }}
        >
          <p>© 2025 Systa. Todos os direitos reservados.</p>
          <p>Dados baseados no CNPJ / Receita Federal.</p>
        </div>
      </div>
    </footer>
  );
}
