'use client';

import { useState, useRef, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Loader2, X, Search } from 'lucide-react';
import { buscarCnaes } from '@/lib/consulta-api';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import type { CnaeOption } from '@/types/consulta';

interface CnaeMultiSelectProps {
  value: CnaeOption[];
  onChange: (next: CnaeOption[]) => void;
  disabled?: boolean;
}

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

export function CnaeMultiSelect({ value, onChange, disabled }: CnaeMultiSelectProps) {
  const [search, setSearch] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const debouncedSearch = useDebounce(search, 350);

  const { data: options = [], isFetching } = useQuery({
    queryKey: ['cnaes', debouncedSearch],
    queryFn: () => buscarCnaes(debouncedSearch),
    enabled: debouncedSearch.trim().length >= 2,
    staleTime: 1000 * 60 * 10,
  });

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  function addCnae(cnae: CnaeOption) {
    if (!value.some((v) => v.codigo === cnae.codigo)) {
      onChange([...value, cnae]);
    }
    setSearch('');
    setDropdownOpen(false);
  }

  function removeCnae(codigo: string) {
    onChange(value.filter((v) => v.codigo !== codigo));
  }

  const showDropdown =
    dropdownOpen && debouncedSearch.trim().length >= 2;

  return (
    <div ref={containerRef} className="space-y-2">
      {/* Search input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Digite o código ou descrição do CNAE…"
          value={search}
          disabled={disabled}
          className="pl-8 pr-8"
          onChange={(e) => {
            setSearch(e.target.value);
            setDropdownOpen(true);
          }}
          onFocus={() => search.trim().length >= 2 && setDropdownOpen(true)}
          aria-label="Buscar CNAE"
          aria-autocomplete="list"
          aria-expanded={showDropdown}
        />
        {isFetching && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 size-3.5 animate-spin text-muted-foreground" />
        )}
      </div>

      {/* Hint */}
      {search.trim().length > 0 && search.trim().length < 2 && (
        <p className="text-xs text-muted-foreground">
          Digite ao menos 2 caracteres para buscar.
        </p>
      )}

      {/* Dropdown results */}
      {showDropdown && (
        <div className="relative z-50">
          <ul
            role="listbox"
            className="absolute top-0 left-0 right-0 rounded-lg border border-border bg-popover shadow-lg overflow-y-auto text-sm"
            style={{ maxHeight: 220 }}
          >
            {options.length === 0 && !isFetching ? (
              <li className="px-3 py-2 text-muted-foreground">
                Nenhum resultado para &ldquo;{debouncedSearch}&rdquo;.
              </li>
            ) : (
              options.map((opt) => {
                const selected = value.some((v) => v.codigo === opt.codigo);
                return (
                  <li
                    key={opt.codigo}
                    role="option"
                    aria-selected={selected}
                    onClick={() => !selected && addCnae(opt)}
                    className={cn(
                      'flex items-center gap-2 px-3 py-2',
                      selected
                        ? 'cursor-default opacity-50'
                        : 'cursor-pointer hover:bg-accent hover:text-accent-foreground',
                    )}
                  >
                    <span className="font-mono text-xs text-muted-foreground shrink-0">
                      {opt.codigo}
                    </span>
                    <span className="truncate">{opt.descricao}</span>
                    {selected && (
                      <span className="ml-auto text-xs text-muted-foreground shrink-0">
                        já selecionado
                      </span>
                    )}
                  </li>
                );
              })
            )}
          </ul>
        </div>
      )}

      {/* Selected tags */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {value.map((cnae) => (
            <span
              key={cnae.codigo}
              className="inline-flex items-center gap-1.5 rounded-md border border-border bg-secondary px-2 py-0.5 text-xs font-medium"
            >
              <span className="font-mono">{cnae.codigo}</span>
              <span className="max-w-[180px] truncate text-muted-foreground">
                {cnae.descricao}
              </span>
              <button
                type="button"
                onClick={() => removeCnae(cnae.codigo)}
                disabled={disabled}
                className="ml-0.5 rounded-sm opacity-60 transition-opacity hover:opacity-100 focus-visible:outline-none"
                aria-label={`Remover CNAE ${cnae.codigo}`}
              >
                <X className="size-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
