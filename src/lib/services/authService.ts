import { z } from 'zod';
import { API_BASE_URL } from '../constants';
import { useFetch } from '../hooks/useFetch';
import { registerUserSchema } from '../schema/userSchema';
import { createApiResponseSchema } from '../schema/apiSchema';

export async function registerUser(data: z.infer<typeof registerUserSchema>) {
  const { data: response, error } = await useFetch({
    url: `${API_BASE_URL}/auth/register`,
    options: {
      method: 'POST',
      body: JSON.stringify(data),
    },
    schema: createApiResponseSchema(registerUserSchema),
  });
  return { response, error };
}
