import { loginUserSchema } from '@/lib/schema/userSchema';
import { fetchLoginUser } from '@/lib/services/authService';
import { fetchProfileByName } from '@/lib/services/profileService';
import { createCookie } from '@/lib/utils/createCookie';
import { type NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const validation = await loginUserSchema.safeParseAsync(await req.json());

    if (!validation.success) {
      return Response.json(validation.error, { status: 400 });
    }

    const { res, error } = await fetchLoginUser({ ...validation.data });

    if (error || !res || !res.data.accessToken) {
      return Response.json('error', { status: 400 });
    }

    const { profile } = await fetchProfileByName(
      res.data.name,
      res.data.accessToken
    );

    const accessToken = createCookie({
      name: 'accessToken',
      value: res.data.accessToken,
      days: 7,
    });

    const user = createCookie({
      name: 'user',
      value: JSON.stringify({
        name: res.data.name,
        email: res.data.email,
        avatarUrl: res.data.avatar?.url
          ? encodeURIComponent(res.data.avatar.url)
          : null,
        isVenueManager: profile?.venueManager || false,
      }),

      days: 7,
    });

    const body = JSON.stringify({
      name: res.data.name,
      email: res.data.email,
    });

    return new Response(body, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Set-Cookie': `${accessToken}, ${user}`,
      },
    });
  } catch (error) {
    console.log(error);
    return Response.json('error', { status: 500 });
  }
}
