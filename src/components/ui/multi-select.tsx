'use client';

import { useEffect, useRef, useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface MultiSelectOption {
  label: string;
  value: string;
}

interface MultiSelectProps {
  options: MultiSelectOption[];
  value: MultiSelectOption[];
  onChange: (next: MultiSelectOption[]) => void;
  placeholder?: string;
  disabled?: boolean;
  maxHeight?: number;
  emptyMessage?: string;
}

export function MultiSelect({
  options,
  value,
  onChange,
  placeholder = 'Selecione…',
  disabled = false,
  maxHeight = 240,
  emptyMessage = 'Nenhuma opção disponível.',
}: MultiSelectProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function toggle(option: MultiSelectOption) {
    const isSelected = value.some((v) => v.value === option.value);
    onChange(
      isSelected ? value.filter((v) => v.value !== option.value) : [...value, option],
    );
  }

  function selectAll() {
    onChange([...options]);
  }

  function clearAll() {
    onChange([]);
  }

  const triggerLabel =
    value.length === 0
      ? placeholder
      : value.length === 1
        ? value[0].label
        : `${value.length} selecionados`;

  return (
    <div ref={containerRef} className="relative w-full">
      <button
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => !disabled && setOpen((o) => !o)}
        className={cn(
          'flex h-9 w-full items-center justify-between rounded-lg border border-input bg-transparent px-3 py-1 text-sm shadow-sm outline-none',
          'transition-colors',
          'focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50',
          'disabled:cursor-not-allowed disabled:opacity-50',
          value.length === 0 && 'text-muted-foreground',
        )}
      >
        <span className="truncate text-left">{triggerLabel}</span>
        <ChevronDown
          className={cn(
            'ml-2 size-4 shrink-0 opacity-50 transition-transform duration-150',
            open && 'rotate-180',
          )}
        />
      </button>

      {open && (
        <div
          className="absolute z-50 mt-1 w-full rounded-lg border border-border bg-popover shadow-lg"
          role="listbox"
          aria-multiselectable="true"
        >
          {options.length > 0 && (
            <div className="flex items-center gap-2 border-b border-border px-3 py-1.5">
              <button
                type="button"
                onClick={selectAll}
                className="text-xs font-medium text-primary hover:underline"
              >
                Todos
              </button>
              <span className="text-muted-foreground">·</span>
              <button
                type="button"
                onClick={clearAll}
                className="text-xs font-medium text-muted-foreground hover:text-foreground hover:underline"
              >
                Limpar
              </button>
            </div>
          )}

          <ul
            className="overflow-y-auto py-1 text-sm"
            style={{ maxHeight }}
          >
            {options.length === 0 ? (
              <li className="px-3 py-2 text-muted-foreground">{emptyMessage}</li>
            ) : (
              options.map((option) => {
                const selected = value.some((v) => v.value === option.value);
                return (
                  <li
                    key={option.value}
                    role="option"
                    aria-selected={selected}
                    onClick={() => toggle(option)}
                    className={cn(
                      'flex cursor-pointer items-center gap-2 px-3 py-1.5',
                      'hover:bg-accent hover:text-accent-foreground',
                      selected && 'font-medium',
                    )}
                  >
                    <span
                      className={cn(
                        'flex size-4 shrink-0 items-center justify-center rounded border border-input',
                        selected && 'border-primary bg-primary text-primary-foreground',
                      )}
                    >
                      {selected && <Check className="size-3" />}
                    </span>
                    <span className="truncate">{option.label}</span>
                  </li>
                );
              })
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
