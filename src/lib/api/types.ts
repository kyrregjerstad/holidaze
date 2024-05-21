import type { ApiMetaPartial } from '@/lib/schema';
import type { z } from 'zod';

export type Endpoint = 'venues' | 'venues/search' | 'venues/[id]' | 'bookings';

export interface ServiceReturnBase<T> {
  error: z.ZodFormattedError<T> | null;
  status: number;
}

export interface ApiResponseBase<T> extends ServiceReturnBase<T> {
  meta: ApiMetaPartial | null;
}
