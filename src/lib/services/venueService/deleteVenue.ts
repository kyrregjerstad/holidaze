'use server';

import { holidazeAPI } from '@/lib/api/holidazeAPI';
import { createApiResponseSchema } from '@/lib/schema/apiSchema';
import { venueBaseSchema } from '@/lib/schema/venueSchema';

export async function deleteVenue(id: string) {
  const { res, error, status } = await holidazeAPI({
    endpoint: `/venues/${id}`,
    method: 'DELETE',
    schema: createApiResponseSchema(venueBaseSchema),
  });

  return { venue: res?.data || null, error, status };
}
