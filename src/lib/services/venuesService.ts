'use server';
import 'server-only';

import { cookies } from 'next/headers';
import { ZodSchema, z } from 'zod';
import { API_BASE_URL } from '@/lib/constants';
import { useFetch } from '@/lib/hooks/useFetch';
import {
  createApiError,
  createApiResponseSchema,
} from '@/lib/schema/apiSchema';
import {
  CreateVenue,
  bookingSchema,
  ownerSchema,
  venueSchema,
  venueSchemaExtended,
} from '../schema/venueSchema';
import { createUrl, getNoroffApiKey } from '../utils';
import { ServiceReturn } from './types';

type SortOptions = 'id' | 'name' | 'price' | 'rating' | 'created' | 'maxGuests';

type QueryParams = {
  _owner?: boolean;
  _bookings?: boolean;
  limit?: number;
  page?: number;
  sort?: SortOptions;
  sortOrder?: 'asc' | 'desc';
};

interface VenueServiceReturn extends ServiceReturn {
  venues: z.infer<typeof venueSchema>[];
}

export async function fetchAllVenues(
  query: QueryParams = {}
): Promise<VenueServiceReturn> {
  const { res, error, status } = await useFetch({
    url: createUrl(`${API_BASE_URL}/holidaze/venues`, query),
    schema: createApiResponseSchema(z.array(venueSchema)),
  });

  if (!res || res.data.length === 0) return { venues: [], error, status };

  return { venues: res.data, error, status };
}

interface FetchVenueByIdReturn extends ServiceReturn {
  venue: z.infer<typeof venueSchemaExtended> | null;
}

export async function fetchVenueById(
  id: string,
  { _owner = true, _bookings = true } = {}
): Promise<FetchVenueByIdReturn> {
  const { res, error, status } = await useFetch({
    url: createUrl(`${API_BASE_URL}/holidaze/venues/${id}`, {
      _owner,
      _bookings,
    }),
    schema: createApiResponseSchema(venueSchemaExtended),
  });

  return { venue: res?.data || null, error, status };
}

export type Venue = NonNullable<
  Awaited<ReturnType<typeof fetchVenueById>>['venue']
>;

interface FetchVenuesBySearchTermReturn extends ServiceReturn {
  venues: z.infer<typeof venueSchema>[];
}

/* search Term search by the title and description of the venue */
export async function fetchVenuesBySearchTerm(
  searchTerm: string
): Promise<FetchVenuesBySearchTermReturn> {
  const { res, error, status } = await useFetch({
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

  return { venues: res?.data || [], error, status };
}

export type VenuesBySearchTerm = Awaited<
  ReturnType<typeof fetchVenuesBySearchTerm>
>['venues'];

interface FetchCreateVenueReturn extends ServiceReturn {
  venue: z.infer<typeof venueSchema> | null;
}

export async function fetchCreateVenue(
  data: CreateVenue
): Promise<FetchCreateVenueReturn> {
  const accessToken = cookies().get('accessToken')?.value;
  const apiKey = getNoroffApiKey();

  if (!accessToken) {
    console.error('Missing access token or api key');

    return {
      venue: null,
      error: createApiError({ message: 'Missing access token or api key' }),
      status: 401,
    };
  }

  const { res, error, status } = await useFetch({
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

  return { venue: res?.data || null, error, status };
}

export type CreateVenueReturn = Awaited<ReturnType<typeof fetchCreateVenue>>;
export type UpdateVenueSchema = Partial<CreateVenue>;

interface FetchDeleteVenueByIdReturn extends ServiceReturn {
  venue: z.infer<typeof venueSchema> | null;
}

export async function fetchUpdateVenueById(
  id: string,
  data: UpdateVenueSchema
): Promise<FetchDeleteVenueByIdReturn> {
  const accessToken = cookies().get('accessToken')?.value;
  const apiKey = getNoroffApiKey();

  if (!accessToken) {
    console.error('Missing access token');
    return {
      venue: null,
      error: createApiError({ message: 'Missing access token or api key' }),
      status: 401,
    };
  }

  const { res, error, status } = await useFetch({
    url: createUrl(`${API_BASE_URL}/holidaze/venues/${id}`),
    options: {
      method: 'PUT',
      body: JSON.stringify(data),
    },
    schema: createApiResponseSchema(venueSchema),
    auth: {
      accessToken,
      apiKey,
    },
  });

  return { venue: res?.data || null, error, status };
}

export type UpdateVenueReturn = Awaited<
  ReturnType<typeof fetchUpdateVenueById>
>;
