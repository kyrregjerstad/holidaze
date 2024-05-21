'use server';

import type { z } from 'zod';

import { API_BASE_URL } from '@/lib/constants';
import { fetcher } from '@/lib/utils/fetcher';
import { createUrl, getNoroffApiKey } from '../utils';
import { ServiceReturnBase } from './types';

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
  data?: unknown;
  method?: Method;
  headers?: Headers;
  cacheTags?: string[];
  schema: z.Schema<T>;
};
interface HolidazeAPIReturn<T> extends ServiceReturnBase<T> {
  res: T | null;
}

export async function holidazeAPI<T>({
  endpoint,
  query,
  data,
  method = 'GET',
  headers,
  schema,
  cacheTags,
}: HolidazeAPIOptions<T>): Promise<HolidazeAPIReturn<T>> {
  const options: RequestInit = {
    method,
    headers: headers ? headers : createDefaultHolidazeHeaders(),
  };

  if (cacheTags) {
    options.next = {
      tags: cacheTags,
    };
  }

  if (['POST', 'PUT', 'PATCH'].includes(method) && data) {
    options.body = JSON.stringify(data);
  }

  const url = createUrl(`${API_BASE_URL}/holidaze${endpoint}`, query);

  const { res, error, status } = await fetcher({
    url,
    schema,
    options,
  });

  return {
    res,
    error: error?.format() ?? null,
    status,
  };
}

function createDefaultHolidazeHeaders() {
  const headers = new Headers();
  headers.set('Content-Type', 'application/json');
  headers.set('X-Noroff-API-Key', getNoroffApiKey());

  return headers;
}
