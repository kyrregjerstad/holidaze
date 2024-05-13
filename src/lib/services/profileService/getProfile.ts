'use server';

import { z } from 'zod';

import { createAuthHeaders } from '@/lib/api/createAuthHeaders';
import { holidazeAPI } from '@/lib/api/holidazeAPI';
import { createApiResponseSchema, userProfileSchema } from '@/lib/schema';

type FetchProfileByNameReturn = {
  profile: z.infer<typeof userProfileSchema> | null;
  error: z.ZodError | null;
  status: number;
};

export async function getProfile(
  name: string,
  accessToken: string
): Promise<FetchProfileByNameReturn> {
  const { res, error, status } = await holidazeAPI({
    endpoint: `/profiles/${name}`,
    query: {
      _bookings: true,
      _venues: true,
    },
    schema: createApiResponseSchema(userProfileSchema),
    headers: await createAuthHeaders(accessToken),
  });

  if (!res) return { profile: null, error, status };

  return { profile: res.data, error, status };
}
