import type { ApiMetaPartial } from '@/lib/schema';
import type { z } from 'zod';

export type Endpoint = 'venues' | 'venues/search' | 'venues/[id]' | 'bookings';

export interface ApiResponseBase<T> {
  meta: ApiMetaPartial | null;
  error: z.ZodError<T> | null;
  status: number;
}
