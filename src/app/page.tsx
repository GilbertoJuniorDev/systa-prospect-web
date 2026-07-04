import type { Metadata } from 'next';
import { getSession } from '@/lib/session';
import { LandingNavbar } from '@/components/landing/navbar';
import { LandingHero } from '@/components/landing/hero';
import { LandingFeatures } from '@/components/landing/features';
import { LandingHowItWorks } from '@/components/landing/how-it-works';
import { LandingPricing } from '@/components/landing/pricing';
import { LandingFreeTrial } from '@/components/landing/free-trial';
import { LandingCta } from '@/components/landing/cta-section';
import { LandingFooter } from '@/components/landing/footer';

export const metadata: Metadata = {
  title: 'Systa — Inteligência de Dados B2B para o Brasil',
  description:
    'Consulte empresas por CNPJ, filtre por CNAE, estado e cidade, e exporte resultados em Excel. Comece grátis com 5 registros.',
};

export default async function LandingPage() {
  const session = await getSession();
  const isAuthenticated = session !== null;

  return (
    <div className="min-h-screen" style={{ background: 'var(--background)' }}>
      <LandingNavbar isAuthenticated={isAuthenticated} />
      <main id="main-content">
        <LandingHero isAuthenticated={isAuthenticated} />
        <LandingFeatures />
        <LandingHowItWorks />
        <LandingFreeTrial isAuthenticated={isAuthenticated} />
        <LandingPricing isAuthenticated={isAuthenticated} />
        <LandingCta isAuthenticated={isAuthenticated} />
      </main>
      <LandingFooter />
    </div>
  );
}
