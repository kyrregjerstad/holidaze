'use server';

import type { z } from 'zod';

import { createAuthHeaders } from '@/lib/api/createAuthHeaders';
import { getAccessTokenCookie } from '@/lib/api/getAccessToken';
import { holidazeAPI } from '@/lib/api/holidazeAPI';
import { ServiceReturnBase } from '@/lib/api/types';
import { bookingReturnSchema, createApiError, createApiResponseSchema } from '@/lib/schema';

export type BookVenue = {
  dateFrom: string;
  dateTo: string;
  guests: number;
  venueId: string;
};
type Booking = z.infer<typeof bookingReturnSchema>;

interface CreateBookingReturn<T> extends ServiceReturnBase<T> {
  booking: T;
}

export async function createBooking(data: BookVenue): Promise<CreateBookingReturn<Booking | null>> {
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
    cacheTags: [`venue-${data.venueId}`],
  });

  if (!res) return { booking: null, error, status };

  return { booking: res?.data, error, status };
}
