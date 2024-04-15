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

const statusSchema = z.enum(['ACTIVE', 'REVOKED']);

export const apiKeySchema = z.object({
  name: z.string(),
  status: statusSchema,
  key: z.string(),
});

export const createApiKeySchema = z.object({
  accessToken: z.string(),
  name: z.string().min(1).max(32).optional(),
});

export const errorsSchema = z.object({
  errors: z.array(
    z.object({
      message: z.string(),
    })
  ),
  status: z.string(),
  statusCode: z.number(),
});
