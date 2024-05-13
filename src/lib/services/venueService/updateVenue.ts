'use server';

import { holidazeAPI } from '@/lib/api/holidazeAPI';
import { createApiResponseSchema } from '@/lib/schema/apiSchema';
import { venueSchema } from '@/lib/schema/venueSchema';
import { UpdateVenueSchema } from './recursivelyGetAllVenues';

export async function updateVenue(id: string, data: UpdateVenueSchema) {
  const { res, error, status } = await holidazeAPI({
    endpoint: `/venues/${id}`,
    method: 'PUT',
    data,
    schema: createApiResponseSchema(venueSchema),
  });

  return { venue: res?.data || null, error, status };
}
