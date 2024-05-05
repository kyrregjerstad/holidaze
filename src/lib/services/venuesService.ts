'use server';
import 'server-only';

import { z } from 'zod';
import { API_BASE_URL } from '../constants';
import { useFetch } from '../hooks/useFetch';
import { createApiResponseSchema } from '../schema/apiSchema';
import {
  bookingSchema,
  createVenueSchema,
  ownerSchema,
  venueSchema,
  venueSchemaExtended,
} from '../schema/venueSchema';
import { createUrl } from '../utils';
import { cookies } from 'next/headers';

type SortOptions = 'id' | 'name' | 'price' | 'rating' | 'created' | 'maxGuests';

type QueryParams = {
  _owner?: boolean;
  _bookings?: boolean;
  limit?: number;
  page?: number;
  sort?: SortOptions;
  sortOrder?: 'asc' | 'desc';
};
export async function fetchAllVenues(query: QueryParams = {}) {
  const { res, error } = await useFetch({
    url: createUrl(`${API_BASE_URL}/holidaze/venues`, query),
    schema: createApiResponseSchema(z.array(venueSchema)),
  });

  if (!res) return { venues: [], error };

  if (res.data.length === 0) return { venues: [], error: null };

  return { venues: res?.data, error };
}

export async function fetchVenueById(
  id: string,
  { _owner = true, _bookings = true } = {}
) {
  const { res, error } = await useFetch({
    url: createUrl(`${API_BASE_URL}/holidaze/venues/${id}`, {
      _owner,
      _bookings,
    }),
    schema: createApiResponseSchema(venueSchemaExtended),
  });

  if (!res) return { venue: null, error };

  return { venue: res?.data, error };
}

export type Venue = NonNullable<
  Awaited<ReturnType<typeof fetchVenueById>>['venue']
>;

/* search Term search by the title and description of the venue */
export async function fetchVenuesBySearchTerm(searchTerm: string) {
  const { res, error } = await useFetch({
    url: createUrl(`${API_BASE_URL}/holidaze/venues/search`, {
      q: searchTerm,
      _bookings: true,
      _owner: true,
    }),
    schema: createApiResponseSchema(
      z.array(
        venueSchema.extend({
          bookings: z.array(bookingSchema),
          owner: ownerSchema,
        })
      )
    ),
  });

  if (!res) return { venues: [], error };

  return { venues: res?.data, error };
}

export type VenuesBySearchTerm = Awaited<
  ReturnType<typeof fetchVenuesBySearchTerm>
>['venues'];

export async function fetchCreateVenue(
  data: z.infer<typeof createVenueSchema>
) {
  const accessToken = cookies().get('accessToken')?.value;
  const apiKey = process.env.NOROFF_API_KEY;

  if (!accessToken || !apiKey) {
    console.error('Missing access token or api key');
    return { venue: null, error: null };
  }

  const { res, error } = await useFetch({
    url: createUrl(`${API_BASE_URL}/holidaze/venues`),
    options: {
      method: 'POST',
      body: JSON.stringify(data),
    },
    schema: createApiResponseSchema(venueSchema),
    auth: {
      accessToken,
      apiKey,
    },
  });

  if (!res) return { venue: null, error };

  return { venue: res?.data, error };
}

export type CreateVenue = Awaited<ReturnType<typeof fetchCreateVenue>>;
