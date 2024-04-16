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
});

export type CookieUser = z.infer<typeof userCookieSchema>;
