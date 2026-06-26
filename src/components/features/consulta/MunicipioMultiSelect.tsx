'use client';

import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { buscarMunicipios } from '@/lib/consulta-api';
import { MultiSelect, type MultiSelectOption } from '@/components/ui/multi-select';
import type { MunicipioOption } from '@/types/consulta';

interface MunicipioMultiSelectProps {
  uf: string;
  value: MunicipioOption[];
  onChange: (next: MunicipioOption[]) => void;
  disabled?: boolean;
}

export function MunicipioMultiSelect({
  uf,
  value,
  onChange,
  disabled,
}: MunicipioMultiSelectProps) {
  const {
    data: municipios = [],
    isFetching,
    isError,
  } = useQuery({
    queryKey: ['municipios', uf],
    queryFn: () => buscarMunicipios(uf),
    enabled: uf.length === 2,
    staleTime: 1000 * 60 * 30,
  });

  const options: MultiSelectOption[] = municipios.map((m) => ({
    value: m.codigo,
    label: m.descricao,
  }));

  const selectedOptions: MultiSelectOption[] = value.map((m) => ({
    value: m.codigo,
    label: m.descricao,
  }));

  function handleChange(next: MultiSelectOption[]) {
    onChange(next.map((o) => ({ codigo: o.value, descricao: o.label })));
  }

  if (!uf) {
    return (
      <MultiSelect
        options={[]}
        value={[]}
        onChange={() => {}}
        placeholder="Selecione uma UF primeiro"
        disabled
      />
    );
  }

  if (isFetching) {
    return (
      <div className="flex h-9 items-center gap-2 rounded-lg border border-input bg-transparent px-3 text-sm text-muted-foreground">
        <Loader2 className="size-3.5 animate-spin" />
        Carregando municípios…
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-9 items-center gap-2 rounded-lg border border-destructive bg-transparent px-3 text-sm text-destructive">
        Erro ao carregar municípios.
      </div>
    );
  }

  return (
    <MultiSelect
      options={options}
      value={selectedOptions}
      onChange={handleChange}
      placeholder="Todos os municípios"
      disabled={disabled}
      emptyMessage="Nenhum município encontrado para esta UF."
    />
  );
}
