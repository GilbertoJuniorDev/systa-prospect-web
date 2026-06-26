import { z } from 'zod';

export const buscaCnpjSchema = z.object({
  cnpj: z
    .string()
    .transform((val) => val.replace(/\D/g, ''))
    .pipe(z.string().length(14, 'O CNPJ deve conter exatamente 14 dígitos.')),
});

export type BuscaCnpjSchemaType = z.infer<typeof buscaCnpjSchema>;
