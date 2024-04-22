import { z } from 'zod';
import { API_BASE_URL } from '../constants';
import { useFetch } from '../hooks/useFetch';
import { createApiResponseSchema } from '../schema/apiSchema';
import {
  bookingSchema,
  ownerSchema,
  venueSchema,
  venueSchemaExtended,
} from '../schema/venueSchema';
import { createUrl } from '../utils';

export async function fetchAllVenues({ owner = false, bookings = false } = {}) {
  const { res, error } = await useFetch({
    url: createUrl(`${API_BASE_URL}/holidaze/venues`, { owner, bookings }),
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
