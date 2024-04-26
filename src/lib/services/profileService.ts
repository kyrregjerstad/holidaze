'use server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { API_BASE_URL } from '../constants';
import { useFetch } from '../hooks/useFetch';
import { createApiResponseSchema } from '../schema/apiSchema';
import { userProfileSchema } from '../schema/userSchema';
import { createUrl } from '../utils';

export async function fetchProfileByName(name: string, token?: string) {
  const accessToken = token || cookies().get('accessToken')?.value;
  const apiKey = process.env.NOROFF_API_KEY;

  if (!apiKey) {
    throw new Error(
      'Missing NOROFF_API key, did you forget to add it to your .env file?'
    );
  }

  if (!accessToken || !apiKey) {
    console.error('Missing access token or api key');
    redirect('/login');
  }

  const { res, error, status } = await useFetch({
    url: createUrl(`${API_BASE_URL}/holidaze/profiles/${name}`, {
      _bookings: true,
      _venues: true,
    }),
    schema: createApiResponseSchema(userProfileSchema),
    auth: {
      accessToken,
      apiKey,
    },
  });

  if (!res) return { venue: null, error, status };

  return { profile: res?.data, error, status };
}
