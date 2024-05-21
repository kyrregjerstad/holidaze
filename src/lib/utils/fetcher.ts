import { z } from 'zod';

import { errorsSchema } from '@/lib/schema/apiSchema';

type FetcherReturn<T> = {
  res: T | null;
  error: z.ZodError<T> | null;
  status: number;
};

export async function fetcher<T>({
  url,
  schema,
  options = {},
}: {
  url: string;
  schema: z.Schema<T>;
  options?: RequestInit;
}): Promise<FetcherReturn<T>> {
  try {
    const response = await fetch(url, options);

    // in the case of a 204 response, we don't need to parse the response body
    // this is used for DELETE requests
    if (response.status === 204) {
      return { res: null, status: 204, error: null };
    }

    if (response.status === 401) {
      console.error('UNAUTHORIZED');
      return { res: null, status: 401, error: null };
    }

    if (!response.ok) {
      const errorResponse = await response.json();

      console.error('ERROR RESPONSE: ', errorResponse);

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
    if (error instanceof z.ZodError) {
      console.error(
        'PATHS: ',
        error.errors.map((err) => err.path)
      );
      return { res: null, status: 500, error };
    }

    console.error(error);
    return { res: null, status: 500, error: new z.ZodError([]) };
  }
}
