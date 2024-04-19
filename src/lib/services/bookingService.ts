'use server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { API_BASE_URL } from '../constants';
import { useFetch } from '../hooks/useFetch';
import { createApiResponseSchema } from '../schema/apiSchema';
import { userProfileSchema } from '../schema/userSchema';
import { createUrl } from '../utils';
import { bookingReturnSchema } from '../schema/bookingSchema';

type BookVenue = {
  dateFrom: string;
  dateTo: string;
  guests: number;
  venueId: string;
};

export async function fetchCreateBooking(data: BookVenue) {
  const accessToken = cookies().get('accessToken')?.value;
  const apiKey = process.env.NOROFF_API_KEY;

  if (!apiKey) {
    throw new Error(
      'Missing NOROFF_API key, did you forget to add it to your .env file?'
    );
  }

  if (!accessToken || !apiKey) {
    redirect('/login');
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

  console.log('res', res);

  if (!res) return { venue: null, error, status };

  return { booking: res?.data, error, status };
}
