'use server';
import { cookies } from 'next/headers';
import { z } from 'zod';
import { API_BASE_URL } from '../constants';
import { useFetch } from '../hooks/useFetch';
import { createApiError, createApiResponseSchema } from '../schema/apiSchema';
import { bookingReturnSchema } from '../schema/bookingSchema';
import { createUrl, getNoroffApiKey } from '../utils';

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

export async function fetchCreateBooking(
  data: BookVenue
): Promise<CreateBookingReturn> {
  const accessToken = cookies().get('accessToken')?.value;
  const apiKey = getNoroffApiKey();

  if (!accessToken || !apiKey) {
    return {
      booking: null,
      error: createApiError({ message: 'Missing access token or API key' }),
      status: 401,
    };
  }

  const { res, error, status } = await useFetch({
    url: createUrl(`${API_BASE_URL}/holidaze/bookings`),
    schema: createApiResponseSchema(bookingReturnSchema),
    auth: {
      accessToken,
      apiKey,
    },
    options: {
      method: 'POST',
      body: JSON.stringify({ ...data }),
    },
  });

  if (!res) return { booking: null, error, status };

  return { booking: res?.data, error, status };
}
