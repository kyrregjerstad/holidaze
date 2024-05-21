'use server';

import { z } from 'zod';

import { createAuthHeaders } from '@/lib/api/createAuthHeaders';
import { holidazeAPI } from '@/lib/api/holidazeAPI';
import { ServiceReturnBase } from '@/lib/api/types';
import { createApiResponseSchema, userProfileSchemaExtended } from '@/lib/schema';

type Profile = z.infer<typeof userProfileSchemaExtended>;
interface FetchProfileByNameReturn<T> extends ServiceReturnBase<T> {
  profile: T;
}

export async function getProfile(
  name: string,
  accessToken: string
): Promise<FetchProfileByNameReturn<Profile | null>> {
  const { res, error, status } = await holidazeAPI({
    endpoint: `/profiles/${name}`,
    query: {
      _venues: true,
    },
    schema: createApiResponseSchema(userProfileSchemaExtended),
    headers: await createAuthHeaders(accessToken),
    cacheTags: [`profile-${name}`],
  });

  if (!res) return { profile: null, error, status };

  return { profile: res.data, error, status };
}
