'use client';

import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Download, Loader2, Search } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';

import { consultaSchema, type ConsultaSchemaType } from '@/lib/validations/consulta';
import { runConsulta, exportarConsulta } from '@/lib/consulta-api';
import type { ConsultaApiBody } from '@/types/consulta';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { NativeSelect } from '@/components/ui/native-select';
import { CnaeMultiSelect } from './CnaeMultiSelect';
import { MunicipioMultiSelect } from './MunicipioMultiSelect';

const UF_LIST = [
  'AC','AL','AP','AM','BA','CE','DF','ES','GO','MA',
  'MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN',
  'RS','RO','RR','SC','SP','SE','TO',
];

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const FADE_UP = {
  initial: { opacity: 0, y: -12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, ease: EASE },
};

function buildApiBody(values: ConsultaSchemaType): ConsultaApiBody {
  return {
    cnaes: values.cnaes.map((c) => c.codigo),
    uf: values.uf,
    municipios: values.municipios.map((m) => m.codigo),
    situacao: values.situacao,
    mei: values.mei,
  };
}

export function ConsultaForm() {
  const [consultaTotal, setConsultaTotal] = useState<number | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<ConsultaSchemaType>({
    resolver: zodResolver(consultaSchema),
    defaultValues: {
      cnaes: [],
      uf: '',
      municipios: [],
      situacao: 'todas',
      mei: 'todos',
    },
  });

  const watchedUf = watch('uf');

  // Clear municipalities and result count when UF changes
  useEffect(() => {
    setValue('municipios', []);
    setConsultaTotal(null);
  }, [watchedUf, setValue]);

  const consultaMutation = useMutation({
    mutationFn: (body: ConsultaApiBody) => runConsulta(body),
    onSuccess: (data) => setConsultaTotal(data.total),
    onError: (err: unknown) => {
      const msg =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { error?: string } } }).response?.data?.error
          : null;
      setConsultaTotal(null);
      alert(msg ?? 'Erro ao realizar a consulta. Tente novamente.');
    },
  });

  async function onConsultar(values: ConsultaSchemaType) {
    setConsultaTotal(null);
    setExportError(null);
    consultaMutation.mutate(buildApiBody(values));
  }

  async function onExportar() {
    setExportError(null);
    setIsExporting(true);
    try {
      const body = buildApiBody(getValues());
      const blob = await exportarConsulta(body);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `consulta_${new Date().toISOString().slice(0, 10)}.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err: unknown) {
      let msg = 'Erro ao exportar. Tente novamente.';
      if (err && typeof err === 'object' && 'response' in err) {
        const res = (err as { response?: { data?: { error?: string } } }).response;
        if (res?.data?.error) msg = res.data.error;
      }
      setExportError(msg);
    } finally {
      setIsExporting(false);
    }
  }

  const isConsulting = consultaMutation.isPending;
  const canExport = consultaTotal !== null && consultaTotal > 0 && !isExporting;

  return (
    <div className="max-w-screen-xl mx-auto">
      {/* Page header */}
      <motion.div {...FADE_UP} className="mb-8">
        <h1
          className="text-3xl font-bold"
          style={{ color: 'var(--foreground)', letterSpacing: '-0.025em' }}
        >
          Consulta de Estabelecimentos
        </h1>
        <p className="mt-1 text-sm" style={{ color: 'var(--muted-foreground)' }}>
          Filtre por CNAE, UF, Município, situação e MEI — depois exporte os resultados em XLSX.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.08, ease: EASE }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Filtros de Consulta</CardTitle>
            <CardDescription>
              Campos marcados com * são obrigatórios.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(onConsultar)} noValidate>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

                {/* CNAE(s) — full width */}
                <div className="md:col-span-2 space-y-1.5">
                  <Label htmlFor="cnae-search">
                    CNAE(s) <span aria-hidden="true" className="text-destructive">*</span>
                  </Label>
                  <Controller
                    name="cnaes"
                    control={control}
                    render={({ field }) => (
                      <CnaeMultiSelect
                        value={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />
                  {errors.cnaes && (
                    <p role="alert" className="text-xs text-destructive">
                      {errors.cnaes.message ?? errors.cnaes.root?.message}
                    </p>
                  )}
                </div>

                {/* UF */}
                <div className="space-y-1.5">
                  <Label htmlFor="uf-select">
                    UF <span aria-hidden="true" className="text-destructive">*</span>
                  </Label>
                  <Controller
                    name="uf"
                    control={control}
                    render={({ field }) => (
                      <NativeSelect
                        id="uf-select"
                        value={field.value}
                        onChange={field.onChange}
                        aria-invalid={!!errors.uf}
                      >
                        <option value="">Selecione a UF…</option>
                        {UF_LIST.map((uf) => (
                          <option key={uf} value={uf}>
                            {uf}
                          </option>
                        ))}
                      </NativeSelect>
                    )}
                  />
                  {errors.uf && (
                    <p role="alert" className="text-xs text-destructive">
                      {errors.uf.message}
                    </p>
                  )}
                </div>

                {/* Município(s) */}
                <div className="space-y-1.5">
                  <Label>Município(s)</Label>
                  <Controller
                    name="municipios"
                    control={control}
                    render={({ field }) => (
                      <MunicipioMultiSelect
                        uf={watchedUf}
                        value={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />
                  <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                    Opcional. Deixe em branco para todos os municípios da UF.
                  </p>
                </div>

                {/* Situação */}
                <div className="space-y-1.5">
                  <Label htmlFor="situacao-select">Situação Cadastral</Label>
                  <Controller
                    name="situacao"
                    control={control}
                    render={({ field }) => (
                      <NativeSelect
                        id="situacao-select"
                        value={field.value}
                        onChange={field.onChange}
                      >
                        <option value="todas">Todas</option>
                        <option value="ativa">Ativa</option>
                        <option value="inativa">Inativa</option>
                      </NativeSelect>
                    )}
                  />
                </div>

                {/* MEI */}
                <div className="space-y-1.5">
                  <Label htmlFor="mei-select">MEI</Label>
                  <Controller
                    name="mei"
                    control={control}
                    render={({ field }) => (
                      <NativeSelect
                        id="mei-select"
                        value={field.value}
                        onChange={field.onChange}
                      >
                        <option value="todos">Todos</option>
                        <option value="sim">Sim (apenas MEI)</option>
                        <option value="nao">Não (excluir MEI)</option>
                      </NativeSelect>
                    )}
                  />
                </div>
              </div>

              {/* Action bar */}
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Button
                  type="submit"
                  size="lg"
                  disabled={isConsulting}
                  className="gap-2"
                >
                  {isConsulting ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Consultando…
                    </>
                  ) : (
                    <>
                      <Search className="size-4" />
                      Consultar
                    </>
                  )}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  disabled={!canExport}
                  onClick={onExportar}
                  className="gap-2"
                >
                  {isExporting ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Exportando…
                    </>
                  ) : (
                    <>
                      <Download className="size-4" />
                      Exportar XLSX
                    </>
                  )}
                </Button>
              </div>

              {/* Result count */}
              {consultaTotal !== null && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-4"
                >
                  {consultaTotal === 0 ? (
                    <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                      Nenhum estabelecimento encontrado para os filtros selecionados.
                    </p>
                  ) : (
                    <p className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
                      <span
                        className="font-bold"
                        style={{ color: 'oklch(0.52 0.22 290)' }}
                      >
                        {consultaTotal.toLocaleString('pt-BR')}
                      </span>{' '}
                      estabelecimento{consultaTotal !== 1 ? 's' : ''} encontrado
                      {consultaTotal !== 1 ? 's' : ''}.
                      {consultaTotal > 0 && (
                        <span className="ml-2 text-muted-foreground">
                          Clique em &ldquo;Exportar XLSX&rdquo; para baixar.
                        </span>
                      )}
                    </p>
                  )}
                </motion.div>
              )}

              {/* Export error */}
              {exportError && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  role="alert"
                  className="mt-3 text-sm text-destructive"
                >
                  {exportError}
                </motion.p>
              )}
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
