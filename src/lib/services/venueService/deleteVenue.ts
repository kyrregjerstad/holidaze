'use server';

import { createApiResponseSchema } from '@/lib/schema/apiSchema';
import { holidazeAPI } from '../../api/holidazeAPI';
import { venueSchema } from '../../schema/venueSchema';

export async function deleteVenue(id: string) {
  const { res, error, status } = await holidazeAPI({
    endpoint: `/venues/${id}`,
    method: 'DELETE',
    schema: createApiResponseSchema(venueSchema),
  });

  return { venue: res?.data || null, error, status };
}
