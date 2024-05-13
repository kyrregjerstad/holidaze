'use server';
import { createApiResponseSchema } from '@/lib/schema/apiSchema';
import { CreateVenue, venueSchema } from '@/lib/schema/venueSchema';
import { holidazeAPI } from '@/lib/api/holidazeAPI';

export async function createVenue(data: CreateVenue) {
  const { res, error, status } = await holidazeAPI({
    endpoint: '/venues',
    method: 'POST',
    data,
    schema: createApiResponseSchema(venueSchema),
  });

  return { venue: res?.data || null, error, status };
}
