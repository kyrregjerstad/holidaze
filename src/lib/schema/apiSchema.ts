import { ZodError, ZodIssueCode, z } from 'zod';

export const apiMetaSchema = z.object({
  isFirstPage: z.boolean(),
  isLastPage: z.boolean(),
  currentPage: z.number(),
  previousPage: z.number().nullable(),
  nextPage: z.number().nullable(),
  pageCount: z.number(),
  totalCount: z.number(),
});

export const apiMetaPartialSchema = apiMetaSchema.partial();
export type ApiMetaPartial = z.infer<typeof apiMetaPartialSchema>;

export function createApiResponseSchema<T>(schema: z.Schema<T>) {
  return z.object({
    data: schema,
    meta: apiMetaPartialSchema,
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

const ZodIssueCodeEnum = z.enum([
  'invalid_type',
  'invalid_literal',
  'custom',
  'invalid_union',
  'invalid_union_discriminator',
  'invalid_enum_value',
  'unrecognized_keys',
  'invalid_arguments',
  'invalid_return_type',
  'invalid_date',
  'invalid_string',
  'too_small',
  'too_big',
  'invalid_intersection_types',
  'not_multiple_of',
  'not_finite',
]);

const apiSubErrorSchema = z.object({
  code: ZodIssueCodeEnum.optional(),
  message: z.string(),
  path: z.array(z.string()).optional(),
});

export const apiErrorSchema = z.object({
  errors: z.array(apiSubErrorSchema),
  status: z.string(),
  statusCode: z.number(),
});

export function createApiError({
  message,
  code = 'custom',
  path = [],
}: {
  message: string;
  code?: string;
  path?: string[];
}): ZodError {
  const error = apiSubErrorSchema.parse({ message, code, path });

  return new ZodError([{ message: error.message, code: 'custom', path }]);
}
