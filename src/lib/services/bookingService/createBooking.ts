'use server';

import type { z } from 'zod';

import { createAuthHeaders } from '@/lib/api/createAuthHeaders';
import { getAccessTokenCookie } from '@/lib/api/getAccessToken';
import { holidazeAPI } from '@/lib/api/holidazeAPI';
import { bookingReturnSchema, createApiError, createApiResponseSchema } from '@/lib/schema';

type BookVenue = {
  dateFrom: string;
  dateTo: string;
  guests: number;
  venueId: string;
};

type Schema = z.infer<typeof bookingReturnSchema>;

type CreateBookingReturn = {
  booking: Schema | null;
  error: z.ZodFormattedError<Schema, string> | null;
  status: number;
};

export async function createBooking(data: BookVenue): Promise<CreateBookingReturn> {
  const accessToken = await getAccessTokenCookie();

  if (!accessToken) {
    return {
      booking: null,
      error: createApiError({
        message: 'Unauthorized',
      }).format(),
      status: 401,
    };
  }

  const { res, error, status } = await holidazeAPI({
    method: 'POST',
    endpoint: '/bookings',
    data,
    headers: await createAuthHeaders(accessToken),
    schema: createApiResponseSchema(bookingReturnSchema),
  });

  if (!res) return { booking: null, error: error?.format() ?? null, status };

  return { booking: res?.data, error: error?.format() ?? null, status };
}
