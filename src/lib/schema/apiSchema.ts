import { z } from 'zod';

export const apiMetaSchema = z.object({
  isFirstPage: z.boolean(),
  isLastPage: z.boolean(),
  currentPage: z.number(),
  previousPage: z.number().nullable(),
  nextPage: z.number().nullable(),
  pageCount: z.number(),
  totalCount: z.number(),
});

export function createApiResponseSchema<T>(schema: z.Schema<T>) {
  return z.object({
    data: schema,
    meta: apiMetaSchema.partial(),
  });
}
