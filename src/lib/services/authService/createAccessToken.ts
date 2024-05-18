import type { loginUserSchema } from '@/lib/schema';
import type { z } from 'zod';

import { API_BASE_URL } from '@/lib/constants';
import { createApiResponseSchema, loginUserReturnSchema } from '@/lib/schema';
import { fetcher } from '@/lib/utils/fetcher';

export async function createAccessToken(data: z.infer<typeof loginUserSchema>) {
  const { res, error, status } = await fetcher({
    url: `${API_BASE_URL}/auth/login?_holidaze=true`,
    options: {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    },
    schema: createApiResponseSchema(loginUserReturnSchema),
  });

  return { res, error, status };
}
