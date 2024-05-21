import type { ApiMetaPartial } from '@/lib/schema';
import type { z } from 'zod';

export interface ServiceReturnBase<T> {
  error: z.ZodFormattedError<T> | null;
  status: number;
}

export interface ApiResponseBase<T> extends ServiceReturnBase<T> {
  meta: ApiMetaPartial | null;
}
