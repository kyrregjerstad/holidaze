import type { registerUserSchema } from '@/lib/schema';
import type { z } from 'zod';

import { API_BASE_URL } from '@/lib/constants';
import { createApiResponseSchema, registerUserResponseSchema } from '@/lib/schema';
import { fetcher } from '@/lib/utils/fetcher';

export async function register(data: z.infer<typeof registerUserSchema>) {
  const { res, error } = await fetcher({
    url: `${API_BASE_URL}/auth/register`,
    options: {
      method: 'POST',
      body: JSON.stringify(data),
    },
    schema: createApiResponseSchema(registerUserResponseSchema),
  });
  return { res, error };
}
