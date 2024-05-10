import { z } from 'zod';
import { API_BASE_URL } from '../constants';
import { useFetch } from '../hooks/useFetch';
import {
  apiKeySchema,
  createApiKeySchema,
  createApiResponseSchema,
} from '../schema/apiSchema';
import {
  loginUserReturnSchema,
  loginUserSchema,
  registerUserResponseSchema,
  registerUserSchema,
} from '../schema/userSchema';
import { createUrl } from '../utils';

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
    url: createUrl(`${API_BASE_URL}/auth/login`, { _holidaze: true }),
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

  const { res, error, status } = await useFetch({
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
  return { res, error, status };
}

export async function handleLoginApi(
  email: string,
  password: string
): Promise<HandleLoginApiReturn> {
  try {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      return { user: null, error: 'Incorrect email or password' };
    }

    const data = await res.json();

    const validation = loginApiResponseSchema.safeParse(data);

    if (!validation.success) {
      return { user: null, error: 'Failed to parse response' };
    }

    return { user: validation.data, error: null };
  } catch (error) {
    console.error('ERROR', error);
    return { user: null, error: 'Failed to fetch' };
  }
}

const loginApiResponseSchema = z.object({
  name: z.string(),
  email: z.string(),
});

type HandleLoginApiReturn =
  | {
      user: z.infer<typeof loginApiResponseSchema>;
      error: null;
    }
  | {
      user: null;
      error: string;
    };
