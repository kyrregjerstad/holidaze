'use server';

import { z } from 'zod';

import { createAuthHeaders } from '@/lib/api/createAuthHeaders';
import { holidazeAPI } from '@/lib/api/holidazeAPI';
import { ServiceReturnBase } from '@/lib/api/types';
import {
  createApiResponseSchema,
  updateProfileSchema,
  updateUserProfileResponse,
} from '@/lib/schema';

type Profile = z.infer<typeof updateUserProfileResponse>;
export interface UpdateProfileReturn<T> extends ServiceReturnBase<T> {
  profile: T;
}

export async function updateProfile({
  name,
  accessToken,
  data,
}: {
  name: string;
  accessToken: string;
  data: z.infer<typeof updateProfileSchema>;
}): Promise<UpdateProfileReturn<Profile | null>> {
  const { res, error, status } = await holidazeAPI({
    endpoint: `/profiles/${name}`,
    method: 'PUT',
    schema: createApiResponseSchema(updateUserProfileResponse),
    headers: await createAuthHeaders(accessToken),
    cacheTags: [`profile-${name}`],
    data,
  });

  if (!res) return { profile: null, error, status };

  return { profile: res.data, error, status };
}
