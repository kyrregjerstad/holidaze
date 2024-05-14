'use server';

import type { ApiResponseBase } from '@/lib/api/types';
import type { VenueFull } from '@/lib/types';

import { holidazeAPI } from '@/lib/api/holidazeAPI';
import { createApiResponseSchema } from '@/lib/schema/apiSchema';
import { venueSchemaFull } from '@/lib/schema/venueSchema';

interface GetVenueByIdReturn<T> extends ApiResponseBase<T> {
  venue: T | null;
}

export async function getVenueById(
  id: string
): Promise<GetVenueByIdReturn<VenueFull>> {
  const { res, error, status } = await holidazeAPI({
    endpoint: `/venues/${id}`,
    query: {
      _owner: true,
      _bookings: true,
    },
    schema: createApiResponseSchema(venueSchemaFull),
  });

  return { venue: res?.data ?? null, error, meta: res?.meta ?? null, status };
}
