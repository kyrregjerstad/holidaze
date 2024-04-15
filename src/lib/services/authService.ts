import { z } from 'zod';
import { API_BASE_URL } from '../constants';
import { useFetch } from '../hooks/useFetch';
import {
  loginUserReturnSchema,
  loginUserSchema,
  registerUserResponseSchema,
  registerUserSchema,
} from '../schema/userSchema';
import {
  apiKeySchema,
  createApiKeySchema,
  createApiResponseSchema,
} from '../schema/apiSchema';

export async function fetchRegisterUser(
  data: z.infer<typeof registerUserSchema>
) {
  const { res, error } = await useFetch({
    url: `${API_BASE_URL}/auth/register`,
    options: {
      method: 'POST',
      body: JSON.stringify(data),
    },
    schema: createApiResponseSchema(registerUserResponseSchema),
  });
  return { res, error };
}

export async function fetchLoginUser(data: z.infer<typeof loginUserSchema>) {
  const { res, error } = await useFetch({
    url: `${API_BASE_URL}/auth/login`,
    options: {
      method: 'POST',
      body: JSON.stringify(data),
    },
    schema: createApiResponseSchema(loginUserReturnSchema),
  });
  return { res, error };
}

export async function fetchCreateApiKey(
  data: z.infer<typeof createApiKeySchema>
) {
  const validation = createApiKeySchema.safeParse(data);

  if (!validation.success) {
    return { response: null, error: validation.error };
  }

  const { name, accessToken } = validation.data;

  const { res, error } = await useFetch({
    url: `${API_BASE_URL}/auth/create-api-key`,
    auth: {
      accessToken: accessToken,
    },
    options: {
      method: 'POST',
      body: JSON.stringify({ name }),
    },
    schema: createApiResponseSchema(apiKeySchema),
  });
  return { res, error };
}
