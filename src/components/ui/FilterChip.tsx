import type { ElementType, ReactNode } from 'react';
import { cn } from '@/lib/utils';

type FilterChipVariant = 'default' | 'cnae';

interface FilterChipProps {
  children: ReactNode;
  /** Ícone opcional exibido à esquerda do conteúdo (ex.: MapPin, Building2). */
  icon?: ElementType;
  variant?: FilterChipVariant;
  className?: string;
}

const VARIANT_STYLE: Record<FilterChipVariant, React.CSSProperties> = {
  default: {
    background: 'oklch(0.94 0.025 290)',
    color: 'oklch(0.35 0.15 290)',
    border: '1px solid oklch(0.85 0.06 290)',
  },
  cnae: {
    background: 'oklch(0.90 0.04 290)',
    color: 'oklch(0.30 0.18 290)',
    border: '1px solid oklch(0.80 0.08 290)',
  },
};

const VARIANT_CLASS: Record<FilterChipVariant, string> = {
  default: 'font-semibold',
  cnae: 'font-mono font-medium',
};

/**
 * Chip de filtro roxo reutilizável (UF, Situação, MEI, municípios, CNAE).
 * Substitui os <span> duplicados em ExportDetails e ConsultaCard.
 */
export function FilterChip({ children, icon: Icon, variant = 'default', className }: FilterChipProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs',
        VARIANT_CLASS[variant],
        className,
      )}
      style={VARIANT_STYLE[variant]}
    >
      {Icon && <Icon className="size-3 shrink-0" />}
      {children}
    </span>
  );
}
