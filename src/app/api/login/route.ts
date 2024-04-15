import { loginUserSchema } from '@/lib/schema/userSchema';
import { fetchCreateApiKey, fetchLoginUser } from '@/lib/services/authService';
import { createCookie } from '@/lib/utils/createCookie';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  const validation = await loginUserSchema.safeParseAsync(await req.json());

  if (!validation.success) {
    return Response.json(validation.error, { status: 400 });
  }

  const userRes = await fetchLoginUser({ ...validation.data });

  if (userRes.error || !userRes.res?.data || !userRes.res.data.accessToken) {
    return Response.json('error', { status: 400 });
  }

  const apiRes = await fetchCreateApiKey({
    name: 'api-key',
    accessToken: userRes.res.data.accessToken,
  });

  if (apiRes.error || !apiRes.res?.data || !apiRes.res.data.key) {
    return Response.json('error', { status: 400 });
  }

  const accessToken = createCookie({
    name: 'accessToken',
    value: userRes.res.data.accessToken,
    days: 7,
  });

  const apiKey = createCookie({
    name: 'apiKey',
    value: apiRes.res.data.key,
    days: 7,
  });

  const body = JSON.stringify({
    name: userRes.res.data.name,
    email: userRes.res.data.email,
    apiKey: apiRes.res.data.key,
    accessToken: userRes.res.data.accessToken,
  });

  return new Response(body, {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Set-Cookie': `${accessToken}, ${apiKey}`,
    },
  });
}
