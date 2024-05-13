import { type NextRequest } from 'next/server';

import { loginUserSchema } from '@/lib/schema/userSchema';
import { authService } from '@/lib/services';
import { createCookie } from '@/lib/utils/createCookie';

export async function POST(req: NextRequest) {
  try {
    const validation = await loginUserSchema.safeParseAsync(await req.json());

    if (!validation.success) {
      return Response.json(validation.error, { status: 400 });
    }

    console.log('validation.data', validation.data);

    const { res, error } = await authService.createAccessToken({
      ...validation.data,
    });

    console.log('res', res);
    console.log('error', error);

    if (error || !res?.data.accessToken) {
      return Response.json('error', { status: 400 });
    }

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
        isVenueManager: res.data.venueManager || false,
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
