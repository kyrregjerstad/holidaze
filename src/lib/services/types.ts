import { z } from 'zod';

export interface ServiceReturn {
  error: z.ZodError | null;
  status: number;
}
