'use server';

import { cookies } from 'next/headers';
import { z } from 'zod';

import { API_BASE_URL } from '@/lib/constants';
import { fetcher } from '@/lib/utils/fetcher';
import { createUrl, getNoroffApiKey } from '../utils';

type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
type Endpoint =
  | '/venues'
  | '/venues/search'
  | '/bookings'
  | '/profiles'
  | `/venues/${string}`
  | `/bookings/${string}`
  | `/profiles/${string}`;

type HolidazeAPIOptions<T> = {
  endpoint: Endpoint;
  query?: Record<string, string | number | boolean>;
  data?: any;
  method?: Method;
  headers?: Headers;
  schema: z.Schema<T>;
};

type HolidazeAPIReturn<T> = {
  res: T | null;
  error: z.ZodError<T> | null;
  status: number;
};

export async function holidazeAPI<T>({
  endpoint,
  query,
  data,
  method = 'GET',
  headers,
  schema,
}: HolidazeAPIOptions<T>): Promise<HolidazeAPIReturn<T>> {
  const options: RequestInit = {
    method,
    headers: headers ? headers : createDefaultHolidazeHeaders(),
  };

  if (['POST', 'PUT', 'PATCH'].includes(method) && data) {
    options.body = JSON.stringify(data);
  }

  const url = createUrl(`${API_BASE_URL}/holidaze${endpoint}`, query);

  return fetcher({
    url,
    schema,
    options,
  });
}

function createDefaultHolidazeHeaders() {
  const headers = new Headers();
  headers.set('Content-Type', 'application/json');
  headers.set('X-Noroff-API-Key', getNoroffApiKey());

  return headers;
}
