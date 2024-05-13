'use server';

import type { DeepPartial } from 'react-hook-form';
import type { z } from 'zod';

import { holidazeAPI } from '@/lib/api/holidazeAPI';
import { createApiResponseSchema } from '@/lib/schema/apiSchema';
import { venueSchema } from '@/lib/schema/venueSchema';

export type UpdateVenueSchema = DeepPartial<z.infer<typeof venueSchema>>;
export type UpdateVenueReturn = ReturnType<typeof updateVenue>;

export async function updateVenue(id: string, data: UpdateVenueSchema) {
  const { res, error, status } = await holidazeAPI({
    endpoint: `/venues/${id}`,
    method: 'PUT',
    data,
    schema: createApiResponseSchema(venueSchema),
  });

  return { venue: res?.data ?? null, error, status };
}
