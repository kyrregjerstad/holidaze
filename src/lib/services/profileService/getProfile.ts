'use server';

import { z } from 'zod';

import { createAuthHeaders } from '@/lib/api/createAuthHeaders';
import { holidazeAPI } from '@/lib/api/holidazeAPI';
import { createApiResponseSchema, userProfileSchema, venueBaseSchema } from '@/lib/schema';

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
      _venues: true,
    },
    schema: createApiResponseSchema(
      userProfileSchema.extend({
        venues: z.array(venueBaseSchema),
      })
    ),
    headers: await createAuthHeaders(accessToken),
    cacheTags: [`profile-${name}`],
  });

  if (!res) return { profile: null, error, status };

  return { profile: res.data, error, status };
}
