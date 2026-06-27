import { Zap, Star, Crown } from 'lucide-react';
import type { PackageId } from '@/lib/credits-api';

export interface Package {
  id: PackageId;
  name: string;
  credits: number;
  price: string;
  priceNote: string;
  popular: boolean;
  Icon: React.ElementType;
  accentFrom: string;
  accentTo: string;
}

export const PACKAGES: Package[] = [
  {
    id: 'starter',
    name: 'Starter',
    credits: 50,
    price: 'R$ 29',
    priceNote: ',00',
    popular: false,
    Icon: Zap,
    accentFrom: 'oklch(0.65 0.15 220)',
    accentTo: 'oklch(0.52 0.18 250)',
  },
  {
    id: 'pro',
    name: 'Pro',
    credits: 150,
    price: 'R$ 59',
    priceNote: ',00',
    popular: true,
    Icon: Star,
    accentFrom: 'oklch(0.68 0.25 320)',
    accentTo: 'oklch(0.52 0.24 290)',
  },
  {
    id: 'max',
    name: 'Max',
    credits: 500,
    price: 'R$ 149',
    priceNote: ',00',
    popular: false,
    Icon: Crown,
    accentFrom: 'oklch(0.72 0.20 60)',
    accentTo: 'oklch(0.58 0.22 40)',
  },
];
