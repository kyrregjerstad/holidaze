import { cookies } from 'next/headers';
import { API_BASE_URL } from '../constants';
import { useFetch } from '../hooks/useFetch';
import { createApiResponseSchema } from '../schema/apiSchema';
import { userProfileSchema } from '../schema/userSchema';
import { createUrl } from '../utils';
import { redirect, RedirectType } from 'next/navigation';

export async function fetchProfileByName(name: string) {
  const accessToken = cookies().get('accessToken')?.value;
  const apiKey = cookies().get('apiKey')?.value;

  if (!accessToken || !apiKey) {
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
