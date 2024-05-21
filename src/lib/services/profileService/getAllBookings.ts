'use server';

import { z } from 'zod';

import { createAuthHeaders } from '@/lib/api/createAuthHeaders';
import { holidazeAPI } from '@/lib/api/holidazeAPI';
import { ServiceReturnBase } from '@/lib/api/types';
import { createApiResponseSchema, getAllBookingsSchema } from '@/lib/schema';

type Bookings = z.infer<typeof getAllBookingsSchema>;

interface FetchProfileByNameReturn<T> extends ServiceReturnBase<T> {
  bookings: T;
}

export async function getAllBookings(
  name: string,
  accessToken: string
): Promise<FetchProfileByNameReturn<Bookings | null>> {
  const { res, error, status } = await holidazeAPI({
    endpoint: `/profiles/${name}/bookings`,
    schema: createApiResponseSchema(getAllBookingsSchema),
    query: {
      _venue: true,
    },
    headers: await createAuthHeaders(accessToken),
    cacheTags: [`profile-${name}-bookings`],
  });

  if (!res) return { bookings: null, error, status };

  return { bookings: res.data, error, status };
}
