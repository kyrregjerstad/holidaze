'use server';
import { cookies } from 'next/headers';
import { z } from 'zod';
import { API_BASE_URL } from '../constants';
import { useFetch } from '../hooks/useFetch';
import {
  createApiError,
  createApiResponseSchema,
} from '@/lib/schema/apiSchema';
import { userProfileSchema } from '@/lib/schema/userSchema';
import { venueSchemaWithBookings } from '@/lib/schema/venueSchema';
import { createUrl, getNoroffApiKey } from '@/lib/utils';

type FetchProfileByNameReturn = {
  profile: z.infer<typeof userProfileSchema> | null;
  error: z.ZodError | null;
  status: number;
};

export async function fetchProfileByName(
  name: string,
  token?: string
): Promise<FetchProfileByNameReturn> {
  const accessToken = token || cookies().get('accessToken')?.value;
  const apiKey = getNoroffApiKey();

  if (!accessToken) {
    console.error('Missing access token');
    const error = createApiError({ message: 'Missing access token' });
    return { profile: null, error, status: 401 };
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

  if (!res) return { profile: null, error, status };

  return { profile: res.data, error, status };
}

type FetchAllVenuesByProfileReturn = {
  venues: z.infer<typeof venueSchemaWithBookings>[];
  error: z.ZodError | null;
  status: number;
};

export async function fetchAllVenuesByProfile(
  name: string
): Promise<FetchAllVenuesByProfileReturn> {
  const accessToken = cookies().get('accessToken')?.value;
  const apiKey = getNoroffApiKey();

  if (!accessToken) {
    console.error('Missing access token');
    const error = createApiError({ message: 'Missing access token' });
    return { venues: [], error, status: 401 };
  }

  const { res, error, status } = await useFetch({
    url: createUrl(`${API_BASE_URL}/holidaze/profiles/${name}/venues`, {
      _bookings: true,
    }),
    schema: createApiResponseSchema(z.array(venueSchemaWithBookings)),
    auth: {
      accessToken,
      apiKey,
    },
  });

  if (!res) return { venues: [], error, status };

  return { venues: res.data, error, status };
}
