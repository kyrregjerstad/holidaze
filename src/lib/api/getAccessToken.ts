'use server';
import { cookies } from 'next/headers';

export async function getAccessTokenCookie() {
  return cookies().get('accessToken')?.value;
}
