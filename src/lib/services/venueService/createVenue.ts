'use server';

import type { ApiResponseBase } from '@/lib/api/types';
import type { CreateVenue } from '@/lib/types';

import { holidazeAPI } from '@/lib/api/holidazeAPI';
import { createApiResponseSchema } from '@/lib/schema/apiSchema';
import { venueBaseSchema } from '@/lib/schema/venueSchema';

interface CreateVenueReturn<T> extends ApiResponseBase<T> {
  venue: T | null;
}

export async function createVenue(data: CreateVenue): Promise<CreateVenueReturn<CreateVenue>> {
  const { res, error, status } = await holidazeAPI({
    endpoint: '/venues',
    method: 'POST',
    data,
    schema: createApiResponseSchema(venueBaseSchema),
  });

  return { venue: res?.data ?? null, error, meta: res?.meta ?? null, status };
}
