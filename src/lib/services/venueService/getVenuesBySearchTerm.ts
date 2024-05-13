'use server';

import type { VenueOptions } from './recursivelyGetAllVenues';

import { z } from 'zod';

import { holidazeAPI } from '@/lib/api/holidazeAPI';
import { createApiResponseSchema } from '@/lib/schema/apiSchema';
import { buildVenueSchema } from './buildVenueSchema';

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
