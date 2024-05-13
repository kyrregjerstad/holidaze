'use server';

import type { CreateVenue } from '@/lib/schema/venueSchema';

import { holidazeAPI } from '@/lib/api/holidazeAPI';
import { createApiResponseSchema } from '@/lib/schema/apiSchema';
import { venueSchema } from '@/lib/schema/venueSchema';

export async function createVenue(data: CreateVenue) {
  const { res, error, status } = await holidazeAPI({
    endpoint: '/venues',
    method: 'POST',
    data,
    schema: createApiResponseSchema(venueSchema),
  });

  return { venue: res?.data || null, error, status };
}

export type CreateVenueReturn = ReturnType<typeof createVenue>;
