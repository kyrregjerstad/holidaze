'use server';

import { createAuthHeaders } from '@/lib/api/createAuthHeaders';
import { holidazeAPI } from '@/lib/api/holidazeAPI';
import { createApiResponseSchema } from '@/lib/schema/apiSchema';
import { revalidateTag } from 'next/cache';
import { z } from 'zod';

// delete just returns a status code
export async function deleteVenue(id: string, accessToken: string) {
  const { error, status } = await holidazeAPI({
    endpoint: `/venues/${id}`,
    method: 'DELETE',
    schema: createApiResponseSchema(statusSchema),
    headers: await createAuthHeaders(accessToken),
  });

  if (status === 204) {
    revalidateTag(`venue-${id}`);
  }

  return { venue: null, error, status };
}

const statusSchema = z.never();
