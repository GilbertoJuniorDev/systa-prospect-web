import type { Metadata } from 'next';
import { ConsultaForm } from '@/components/features/consulta/ConsultaForm';

export const metadata: Metadata = {
  title: 'Consulta de Estabelecimentos | Systa',
};

export default function ConsultaPage() {
  return <ConsultaForm />;
}
