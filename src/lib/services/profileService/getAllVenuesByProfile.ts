'use server';

import { z } from 'zod';

import { createAuthHeaders } from '@/lib/api/createAuthHeaders';
import { holidazeAPI } from '@/lib/api/holidazeAPI';
import { ServiceReturnBase } from '@/lib/api/types';
import { createApiResponseSchema } from '@/lib/schema/apiSchema';
import { venueSchemaFull } from '@/lib/schema/venueSchema';

type Venue = z.infer<typeof venueSchemaFull>;
interface GetAllVenuesByProfileReturn<T> extends ServiceReturnBase<T> {
  venues: T;
}

export async function getAllVenuesByProfile(
  name: string,
  accessToken: string
): Promise<GetAllVenuesByProfileReturn<Venue[]>> {
  const { res, error, status } = await holidazeAPI({
    endpoint: `/profiles/${name}/venues`,
    query: {
      _bookings: true,
      _owner: true,
    },
    schema: createApiResponseSchema(z.array(venueSchemaFull)),
    headers: await createAuthHeaders(accessToken),
    cacheTags: [`profile-${name}-venues`],
  });

  if (!res) return { venues: [], error, status };

  return { venues: res.data, error, status };
}
