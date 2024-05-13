import { z } from 'zod';

import { fetcher } from '@/lib/utils/fetcher';

export async function login(
  email: string,
  password: string
): Promise<LoginReturn> {
  try {
    const { res, error } = await fetcher({
      url: '/api/login', // this is a local API for handling login
      options: {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      },
      schema: loginApiResponseSchema,
    });

    if (error) {
      console.error('ERROR', error);
      return { user: null, error: 'Failed to fetch' };
    }

    if (!res) {
      return { user: null, error: 'Invalid username or password' };
    }

    return { user: res, error: null };
  } catch (error) {
    console.error('ERROR', error);
    return { user: null, error: 'Failed to fetch' };
  }
}

type LoginReturn =
  | {
      user: z.infer<typeof loginApiResponseSchema>;
      error: null;
    }
  | {
      user: null;
      error: string;
    };

const loginApiResponseSchema = z.object({
  name: z.string(),
  email: z.string(),
});
