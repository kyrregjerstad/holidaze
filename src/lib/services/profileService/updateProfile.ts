'use server';

import { z } from 'zod';

import { createAuthHeaders } from '@/lib/api/createAuthHeaders';
import { holidazeAPI } from '@/lib/api/holidazeAPI';
import {
  createApiResponseSchema,
  updateProfileSchema,
  updateUserProfileResponse,
} from '@/lib/schema';

export type UpdateProfileReturn = {
  profile: z.infer<typeof updateUserProfileResponse> | null;
  error: z.ZodError | null;
  status: number;
};

export async function updateProfile({
  name,
  accessToken,
  data,
}: {
  name: string;
  accessToken: string;
  data: z.infer<typeof updateProfileSchema>;
}): Promise<UpdateProfileReturn> {
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
