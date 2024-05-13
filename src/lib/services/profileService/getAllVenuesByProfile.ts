'use server';
import { z } from 'zod';

import { createAuthHeaders } from '@/lib/api/createAuthHeaders';
import { holidazeAPI } from '@/lib/api/holidazeAPI';
import { createApiResponseSchema } from '@/lib/schema/apiSchema';
import { venueSchemaWithBookings } from '@/lib/schema/venueSchema';

type GetAllVenuesByProfileReturn = {
  venues: z.infer<typeof venueSchemaWithBookings>[];
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
    },
    schema: createApiResponseSchema(z.array(venueSchemaWithBookings)),
    headers: await createAuthHeaders(accessToken),
  });

  if (!res) return { venues: [], error, status };

  return { venues: res.data, error, status };
}
