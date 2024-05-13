import { z } from 'zod';
import { fetcher } from '@/lib/utils/fetcher';
import { API_BASE_URL } from '@/lib/constants';
import {
  createApiResponseSchema,
  loginUserReturnSchema,
  loginUserSchema,
} from '@/lib/schema';

export async function createAccessToken(data: z.infer<typeof loginUserSchema>) {
  const { res, error } = await fetcher({
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

  return { res, error };
}
