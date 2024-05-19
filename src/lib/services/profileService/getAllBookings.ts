'use server';

import { z } from 'zod';

import { createAuthHeaders } from '@/lib/api/createAuthHeaders';
import { holidazeAPI } from '@/lib/api/holidazeAPI';
import {
  bookingSchema,
  createApiResponseSchema,
  getAllBookingsSchema,
  venueBaseSchema,
} from '@/lib/schema';

type FetchProfileByNameReturn = {
  bookings: z.infer<typeof getAllBookingsSchema> | null;
  error: z.ZodError | null;
  status: number;
};

export async function getAllBookings(
  name: string,
  accessToken: string
): Promise<FetchProfileByNameReturn> {
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
