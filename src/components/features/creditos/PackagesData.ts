import { Zap, Star, Crown } from 'lucide-react';
import type { PackageId } from '@/lib/credits-api';

export interface Package {
  id: PackageId;
  name: string;
  /** Total de registros creditados na conta ao comprar (contrato com backend/Stripe). */
  credits: number;
  /** Quantidade "base" de registros exibida em destaque no card. */
  records: number;
  /** Registros de bônus exibidos separadamente do valor base (0 quando não há bônus). */
  bonus: number;
  price: string;
  priceNote: string;
  /** Valor por registro, já formatado para exibição. */
  perRecord: string;
  popular: boolean;
  Icon: React.ElementType;
  accentFrom: string;
  accentTo: string;
  features: string[];
}

export const PACKAGES: Package[] = [
  {
    id: 'starter',
    name: 'Starter',
    credits: 500,
    records: 500,
    bonus: 0,
    price: 'R$ 150',
    priceNote: ',00',
    perRecord: 'R$ 0,30 / registro',
    popular: false,
    Icon: Zap,
    accentFrom: 'oklch(0.65 0.15 220)',
    accentTo: 'oklch(0.52 0.18 250)',
    features: [
      '500 registros',
      'Consulta CNPJ completa',
      'Filtros por CNAE e UF',
      'Exportação XLSX',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    credits: 1000,
    records: 1000,
    bonus: 0,
    price: 'R$ 250',
    priceNote: ',00',
    perRecord: 'R$ 0,25 / registro',
    popular: true,
    Icon: Star,
    accentFrom: 'oklch(0.68 0.25 320)',
    accentTo: 'oklch(0.52 0.24 290)',
    features: [
      '1.000 registros',
      'Consulta CNPJ completa',
      'Filtros por CNAE e UF',
      'Exportação XLSX',
      'Melhor custo-benefício',
    ],
  },
  {
    id: 'max',
    name: 'Max',
    credits: 2500,
    records: 2000,
    bonus: 500,
    price: 'R$ 500',
    priceNote: ',00',
    perRecord: 'R$ 0,20 / registro',
    popular: false,
    Icon: Crown,
    accentFrom: 'oklch(0.72 0.20 60)',
    accentTo: 'oklch(0.58 0.22 40)',
    features: [
      '2.000 + 500 registros de bônus',
      'Consulta CNPJ completa',
      'Filtros por CNAE e UF',
      'Exportação XLSX',
      'Maior volume de prospecção',
    ],
  },
];
