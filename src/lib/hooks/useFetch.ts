import { z } from 'zod';

type UseFetchReturn<T> = {
  data: T | null;
  error: z.ZodError<T> | null;
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
  auth?: { accessToken: string };
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
  auth?: { accessToken: string };
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
  auth?: { accessToken: string };
}): Promise<UseFetchReturn<T>> {
  const headers = new Headers(options.headers || {});
  headers.set('Content-Type', 'application/json');

  if (auth) {
    headers.set('Authorization', `Bearer ${auth.accessToken}`);
  }

  const fetchOptions: RequestInit = {
    ...options,
    headers,
  };

  const res = await fetch(url, fetchOptions).then((res) => res.json());

  const result = schema.safeParse(res);

  if (!result.success) {
    return { data: null, error: result.error };
  }

  return { data: result.data, error: null };
}
