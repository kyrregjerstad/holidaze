import { z } from 'zod';
import { API_BASE_URL } from '@/lib/constants';
import { fetcher } from '@/lib/utils/fetcher';
import {
  createApiResponseSchema,
  registerUserResponseSchema,
  registerUserSchema,
} from '@/lib/schema';

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
