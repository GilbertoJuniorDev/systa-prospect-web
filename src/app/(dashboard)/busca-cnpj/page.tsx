import type { Metadata } from 'next';
import { BuscaCnpjPage } from '@/components/features/busca-cnpj/BuscaCnpjPage';

export const metadata: Metadata = {
  title: 'Consulta por CNPJ | Systa',
};

export default function BuscaCnpjRoute() {
  return <BuscaCnpjPage />;
}
