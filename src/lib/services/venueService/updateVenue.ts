'use server';

import type { DeepPartial } from 'react-hook-form';
import type { z } from 'zod';

import { revalidateTag } from 'next/cache';

import { createAuthHeaders } from '@/lib/api/createAuthHeaders';
import { holidazeAPI } from '@/lib/api/holidazeAPI';
import { createApiResponseSchema } from '@/lib/schema/apiSchema';
import { venueBaseSchema } from '@/lib/schema/venueSchema';

export type UpdateVenueSchema = DeepPartial<z.infer<typeof venueBaseSchema>>;
export type UpdateVenueReturn = ReturnType<typeof updateVenue>;

export async function updateVenue(id: string, data: UpdateVenueSchema, accessToken: string) {
  const { res, error, status } = await holidazeAPI({
    endpoint: `/venues/${id}`,
    method: 'PUT',
    data,
    schema: createApiResponseSchema(venueBaseSchema),
    headers: await createAuthHeaders(accessToken),
  });

  revalidateTag(`venue-${id}`);

  return { venue: res?.data ?? null, error, status };
}
