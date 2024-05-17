'use server';

import { createAuthHeaders } from '@/lib/api/createAuthHeaders';
import { holidazeAPI } from '@/lib/api/holidazeAPI';
import { createApiResponseSchema } from '@/lib/schema/apiSchema';
import { z } from 'zod';

// TODO: fix deleteVenue, it returns no body on success just a 204 status code
export async function deleteVenue(id: string, accessToken: string) {
  const { res, error, status } = await holidazeAPI({
    endpoint: `/venues/${id}`,
    method: 'DELETE',
    schema: createApiResponseSchema(statusSchema),
    headers: await createAuthHeaders(accessToken),
  });

  return { venue: res?.data || null, error, status };
}

const statusSchema = z.never();
