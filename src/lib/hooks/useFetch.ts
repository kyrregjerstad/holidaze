import { errorsSchema } from '@/lib/schema/apiSchema';
import { z } from 'zod';

type UseFetchReturn<T> = {
  res: T | null;
  error: z.ZodError<T> | null;
  status: number;
};

export async function useFetch<T>({
  url,
  schema,
  options,
  auth,
}: {
  url: string;
  schema: z.Schema<T>;
  options?: Omit<RequestInit, 'body'> & { method?: 'GET' | 'DELETE' };
  auth?: { accessToken: string; apiKey: string };
}): Promise<UseFetchReturn<T>>;

export async function useFetch<T>({
  url,
  schema,
  options,
  auth,
}: {
  url: string;
  schema: z.Schema<T>;
  options: RequestInit & { method: 'POST' | 'PUT' | 'PATCH' };
  auth?: { accessToken: string; apiKey: string };
}): Promise<UseFetchReturn<T>>;

export async function useFetch<T>({
  url,
  schema,
  options = {},
  auth,
}: {
  url: string;
  schema: z.Schema<T>;
  options?: RequestInit;
  auth?: { accessToken: string; apiKey: string };
}): Promise<UseFetchReturn<T>> {
  try {
    const headers = new Headers(options.headers || {});
    headers.set('Content-Type', 'application/json');

    if (auth) {
      headers.set('Authorization', `Bearer ${auth.accessToken}`);
      headers.set('X-Noroff-API-Key', auth.apiKey);
    }

    const fetchOptions: RequestInit = {
      ...options,
      headers,
    };

    const response = await fetch(url, fetchOptions);

    if (!response.ok) {
      const errorResponse = await response.json();

      const parsedError = errorsSchema.safeParse(errorResponse);

      if (!parsedError.success) {
        console.error('ERROR PARSING API ERROR RESPONSE: ', parsedError.error);
        return {
          res: null,
          status: response.status,
          error: new z.ZodError([
            {
              message: 'Invalid API error structure',
              code: 'custom',
              path: [],
            },
          ]),
        };
      }

      const zodIssues = parsedError.data.errors.map((err) => ({
        message: err.message,
        code: 'custom',
        path: [],
      })) as z.ZodIssue[];

      return {
        res: null,
        status: response.status,
        error: new z.ZodError(zodIssues),
      };
    }

    const data = await response.json();

    const result = schema.safeParse(data);

    if (!result.success) {
      console.error('ERROR PARSING RESPONSE: ', result.error);
      return { res: null, status: response.status, error: result.error };
    }

    return { res: result.data, status: 200, error: null };
  } catch (error) {
    console.error(error);
    if (error instanceof z.ZodError) {
      return { res: null, status: 500, error };
    }

    return { res: null, status: 500, error: new z.ZodError([]) };
  }
}
