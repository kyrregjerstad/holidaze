'use server';

import { z } from 'zod';

import { holidazeAPI } from '@/lib/api/holidazeAPI';
import { createApiResponseSchema } from '@/lib/schema/apiSchema';
import { buildVenueSchema } from './buildVenueSchema';
import { VenueOptions } from './recursivelyGetAllVenues';

export async function getVenuesBySearchTerm(
  searchTerm: string,
  options: VenueOptions = {
    owner: true,
    bookings: true,
  }
) {
  const { res, error, status } = await holidazeAPI({
    endpoint: '/venues/search',
    query: {
      q: searchTerm,
      _bookings: options.bookings ?? true,
      _owner: options.owner ?? true,
    },
    schema: createApiResponseSchema(z.array(buildVenueSchema({ ...options }))),
  });

  return { venues: res?.data || [], error, status };
}
