import { z } from 'zod';

const cnaeOptionSchema = z.object({
  codigo: z.string(),
  descricao: z.string(),
});

const municipioOptionSchema = z.object({
  codigo: z.string(),
  descricao: z.string(),
});

const CURRENT_YEAR = new Date().getFullYear();
const MIN_YEAR = 1900;

export const consultaSchema = z
  .object({
    cnaes: z
      .array(cnaeOptionSchema)
      .min(1, 'Selecione ao menos um CNAE.'),
    uf: z.string().length(2, 'Selecione uma UF.'),
    municipios: z.array(municipioOptionSchema),
    situacao: z.enum(['todas', 'ativa', 'inativa']),
    mei: z.enum(['todos', 'sim', 'nao']),
    dataAberturaDeMes: z.number().int().min(1).max(12).optional(),
    dataAberturaDeAno: z.number().int().min(MIN_YEAR).max(CURRENT_YEAR).optional(),
    dataAberturaAteMes: z.number().int().min(1).max(12).optional(),
    dataAberturaAteAno: z.number().int().min(MIN_YEAR).max(CURRENT_YEAR).optional(),
  })
  .superRefine((data, ctx) => {
    const deMes = data.dataAberturaDeMes !== undefined;
    const deAno = data.dataAberturaDeAno !== undefined;
    const ateMes = data.dataAberturaAteMes !== undefined;
    const ateAno = data.dataAberturaAteAno !== undefined;

    if (deMes !== deAno) {
      ctx.addIssue({
        code: 'custom',
        message: deMes
          ? 'Informe também o ano de abertura (De).'
          : 'Informe também o mês de abertura (De).',
        path: [deMes ? 'dataAberturaDeAno' : 'dataAberturaDeMes'],
      });
    }

    if (ateMes !== ateAno) {
      ctx.addIssue({
        code: 'custom',
        message: ateMes
          ? 'Informe também o ano de abertura (Até).'
          : 'Informe também o mês de abertura (Até).',
        path: [ateMes ? 'dataAberturaAteAno' : 'dataAberturaAteMes'],
      });
    }

    if (deMes && deAno && ateMes && ateAno) {
      const deVal = data.dataAberturaDeAno! * 100 + data.dataAberturaDeMes!;
      const ateVal = data.dataAberturaAteAno! * 100 + data.dataAberturaAteMes!;
      if (deVal > ateVal) {
        ctx.addIssue({
          code: 'custom',
          message: 'A data "De" deve ser anterior ou igual à data "Até".',
          path: ['dataAberturaAteAno'],
        });
      }
    }
  });

export type ConsultaSchemaType = z.infer<typeof consultaSchema>;
