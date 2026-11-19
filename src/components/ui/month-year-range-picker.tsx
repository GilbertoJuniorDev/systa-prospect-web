'use client';

import { useRef, useState } from 'react';
import { Popover as PopoverPrimitive } from '@base-ui/react/popover';
import { CalendarRange, ChevronDown, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export interface MonthYearRangeValue {
  fromMonth?: number;
  fromYear?: number;
  toMonth?: number;
  toYear?: number;
}

interface MonthYearRangePickerProps {
  value: MonthYearRangeValue;
  onChange: (next: MonthYearRangeValue) => void;
  minYear?: number;
  maxYear?: number;
  disabled?: boolean;
  'aria-invalid'?: boolean;
  id?: string;
}

const MIN_YEAR = 1900;

export const MONTHS = [
  { label: 'Janeiro', abbr: 'Jan', value: 1 },
  { label: 'Fevereiro', abbr: 'Fev', value: 2 },
  { label: 'Março', abbr: 'Mar', value: 3 },
  { label: 'Abril', abbr: 'Abr', value: 4 },
  { label: 'Maio', abbr: 'Mai', value: 5 },
  { label: 'Junho', abbr: 'Jun', value: 6 },
  { label: 'Julho', abbr: 'Jul', value: 7 },
  { label: 'Agosto', abbr: 'Ago', value: 8 },
  { label: 'Setembro', abbr: 'Set', value: 9 },
  { label: 'Outubro', abbr: 'Out', value: 10 },
  { label: 'Novembro', abbr: 'Nov', value: 11 },
  { label: 'Dezembro', abbr: 'Dez', value: 12 },
] as const;

function formatMonthYear(month: number, year: number) {
  return `${MONTHS[month - 1].abbr.toLowerCase()}/${year}`;
}

interface MonthYearColumnProps {
  column: 'from' | 'to';
  label: string;
  month?: number;
  year?: number;
  viewYear: number;
  minYear: number;
  maxYear: number;
  isMonthDisabled: (month: number) => boolean;
  onNavigateYear: (year: number) => void;
  onSelectMonth: (month: number) => void;
  className?: string;
}

function MonthYearColumn({
  column,
  label,
  month,
  year,
  viewYear,
  minYear,
  maxYear,
  isMonthDisabled,
  onNavigateYear,
  onSelectMonth,
  className,
}: MonthYearColumnProps) {
  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-muted-foreground">{label}</span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label="Ano anterior"
            disabled={viewYear <= minYear}
            onClick={() => onNavigateYear(viewYear - 1)}
            className="flex size-6 items-center justify-center rounded-md text-muted-foreground outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-30"
          >
            <ChevronLeft className="size-4" />
          </button>
          <span className="w-11 text-center text-sm font-medium tabular-nums">{viewYear}</span>
          <button
            type="button"
            aria-label="Próximo ano"
            disabled={viewYear >= maxYear}
            onClick={() => onNavigateYear(viewYear + 1)}
            className="flex size-6 items-center justify-center rounded-md text-muted-foreground outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-30"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>
      <div role="group" aria-label={`Mês (${label})`} className="grid grid-cols-3 gap-1.5">
        {MONTHS.map((m) => {
          const isSelected = month === m.value && year === viewYear;
          const isDisabled = isMonthDisabled(m.value);
          return (
            <button
              key={m.value}
              type="button"
              data-column={column}
              data-month={m.value}
              aria-pressed={isSelected}
              aria-label={m.label}
              disabled={isDisabled}
              onClick={() => onSelectMonth(m.value)}
              className={cn(
                'h-9 rounded-md text-xs font-medium outline-none transition-colors',
                'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1',
                isSelected
                  ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                  : 'text-foreground hover:bg-accent hover:text-accent-foreground',
                isDisabled && 'pointer-events-none opacity-30',
              )}
            >
              {m.abbr}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function MonthYearRangePicker({
  value,
  onChange,
  minYear = MIN_YEAR,
  maxYear = new Date().getFullYear(),
  disabled = false,
  'aria-invalid': ariaInvalid,
  id,
}: MonthYearRangePickerProps) {
  const [open, setOpen] = useState(false);
  const [wasOpen, setWasOpen] = useState(false);
  const [viewYearFrom, setViewYearFrom] = useState(value.fromYear ?? maxYear);
  const [viewYearTo, setViewYearTo] = useState(value.toYear ?? maxYear);
  const popupRef = useRef<HTMLDivElement>(null);

  // Reset the visible year of each column to match the current value every time the
  // popover transitions from closed to open (adjusting state during render, not in an
  // effect, per https://react.dev/learn/you-might-not-need-an-effect).
  if (open && !wasOpen) {
    setWasOpen(true);
    setViewYearFrom(value.fromYear ?? maxYear);
    setViewYearTo(value.toYear ?? maxYear);
  } else if (!open && wasOpen) {
    setWasOpen(false);
  }

  const hasFrom = value.fromMonth != null && value.fromYear != null;
  const hasTo = value.toMonth != null && value.toYear != null;

  let summary = 'Selecione o período';
  if (hasFrom && hasTo) {
    summary = `${formatMonthYear(value.fromMonth!, value.fromYear!)} – ${formatMonthYear(value.toMonth!, value.toYear!)}`;
  } else if (hasFrom) {
    summary = `A partir de ${formatMonthYear(value.fromMonth!, value.fromYear!)}`;
  } else if (hasTo) {
    summary = `Até ${formatMonthYear(value.toMonth!, value.toYear!)}`;
  }

  function isFromMonthDisabled(month: number) {
    if (value.toMonth == null || value.toYear == null) return false;
    return viewYearFrom * 100 + month > value.toYear * 100 + value.toMonth;
  }

  function isToMonthDisabled(month: number) {
    if (value.fromMonth == null || value.fromYear == null) return false;
    return viewYearTo * 100 + month < value.fromYear * 100 + value.fromMonth;
  }

  function handleClear() {
    onChange({});
    setViewYearFrom(maxYear);
    setViewYearTo(maxYear);
  }

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
      <PopoverPrimitive.Trigger
        id={id}
        disabled={disabled}
        aria-invalid={ariaInvalid}
        className={cn(
          'flex h-9 w-full items-center gap-2 rounded-lg border border-input bg-transparent px-3 py-1 text-sm shadow-sm outline-none transition-colors',
          'focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50',
          'disabled:cursor-not-allowed disabled:opacity-50',
          ariaInvalid && 'border-destructive ring-3 ring-destructive/20',
          !hasFrom && !hasTo && 'text-muted-foreground',
        )}
      >
        <CalendarRange className="size-4 shrink-0 opacity-60" />
        <span className="flex-1 truncate text-left">{summary}</span>
        <ChevronDown
          className={cn(
            'size-4 shrink-0 opacity-50 transition-transform duration-150',
            open && 'rotate-180',
          )}
        />
      </PopoverPrimitive.Trigger>

      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Positioner side="bottom" align="start" sideOffset={4} className="z-50">
          <PopoverPrimitive.Popup
            ref={popupRef}
            aria-label="Selecionar período de abertura do CNPJ"
            initialFocus={() =>
              popupRef.current?.querySelector<HTMLButtonElement>(
                `[data-column="from"][data-month="${value.fromMonth ?? 1}"]`,
              ) ?? true
            }
            className={cn(
              'w-[min(92vw,420px)] rounded-xl border border-border bg-popover p-4 shadow-lg outline-none sm:w-[440px]',
              'transition-all duration-150 ease-out',
              'data-[starting-style]:scale-95 data-[starting-style]:opacity-0',
              'data-[ending-style]:scale-95 data-[ending-style]:opacity-0',
              'motion-reduce:transition-none',
            )}
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-0 sm:divide-x sm:divide-border">
              <MonthYearColumn
                column="from"
                label="De"
                month={value.fromMonth}
                year={value.fromYear}
                viewYear={viewYearFrom}
                minYear={minYear}
                maxYear={maxYear}
                isMonthDisabled={isFromMonthDisabled}
                onNavigateYear={setViewYearFrom}
                onSelectMonth={(m) => onChange({ ...value, fromMonth: m, fromYear: viewYearFrom })}
                className="sm:pr-4"
              />
              <MonthYearColumn
                column="to"
                label="Até"
                month={value.toMonth}
                year={value.toYear}
                viewYear={viewYearTo}
                minYear={minYear}
                maxYear={maxYear}
                isMonthDisabled={isToMonthDisabled}
                onNavigateYear={setViewYearTo}
                onSelectMonth={(m) => onChange({ ...value, toMonth: m, toYear: viewYearTo })}
                className="border-t border-border pt-4 sm:border-t-0 sm:pt-0 sm:pl-4"
              />
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
              <button
                type="button"
                onClick={handleClear}
                className="flex items-center gap-1 rounded text-xs font-medium text-muted-foreground outline-none transition-colors hover:text-foreground hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
              >
                <X className="size-3.5" />
                Limpar
              </button>
              <Button type="button" size="sm" onClick={() => setOpen(false)}>
                Aplicar
              </Button>
            </div>
          </PopoverPrimitive.Popup>
        </PopoverPrimitive.Positioner>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}
