'use server';

import { z } from 'zod';

import { createAuthHeaders } from '@/lib/api/createAuthHeaders';
import { holidazeAPI } from '@/lib/api/holidazeAPI';
import { createApiResponseSchema } from '@/lib/schema/apiSchema';
import { venueSchemaFull } from '@/lib/schema/venueSchema';

type GetAllVenuesByProfileReturn = {
  venues: z.infer<typeof venueSchemaFull>[];
  error: z.ZodError | null;
  status: number;
};

export async function getAllVenuesByProfile(
  name: string,
  accessToken: string
): Promise<GetAllVenuesByProfileReturn> {
  const { res, error, status } = await holidazeAPI({
    endpoint: `/profiles/${name}/venues`,
    query: {
      _bookings: true,
      _owner: true,
    },
    schema: createApiResponseSchema(z.array(venueSchemaFull)),
    headers: await createAuthHeaders(accessToken),
  });

  if (!res) return { venues: [], error, status };

  return { venues: res.data, error, status };
}
