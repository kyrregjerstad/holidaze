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

type CreateBookingReturn = {
  booking: z.infer<typeof bookingReturnSchema> | null;
  error: z.ZodError | null;
  status: number;
};

export async function createBooking(data: BookVenue): Promise<CreateBookingReturn> {
  const accessToken = await getAccessTokenCookie();

  if (!accessToken) {
    return {
      booking: null,
      error: createApiError({
        message: 'Unauthorized',
      }),
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

  if (!res) return { booking: null, error, status };

  return { booking: res?.data, error, status };
}
