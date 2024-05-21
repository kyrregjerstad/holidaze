import { cookies } from 'next/headers';

import { z } from 'zod';

export function getUserFromCookie() {
  const user = cookies().get('user')?.value || null;

  if (!user) {
    return null;
  }

  const userJson = decodeURIComponent(user);

  const userData = JSON.parse(userJson);

  const validation = userCookieSchema.safeParse(userData);

  if (!validation.success) {
    return null;
  }

  return validation.data;
}

const userCookieSchema = z.object({
  name: z.string(),
  email: z.string(),
  avatarUrl: z.string().nullable(),
  isVenueManager: z.boolean(),
});

export type CookieUser = z.infer<typeof userCookieSchema>;

export async function updateUserCookie(user: {
  name: string;
  email: string;
  avatarUrl: string | null;
  isVenueManager: boolean;
}) {
  'use server';
  cookies().set('user', JSON.stringify(user), {
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  });
}
