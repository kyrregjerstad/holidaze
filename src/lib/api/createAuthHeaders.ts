'use server';
import { getNoroffApiKey } from '../utils';

export async function createAuthHeaders(accessToken: string) {
  const headers = new Headers();
  headers.set('Content-Type', 'application/json');
  headers.set('Authorization', `Bearer ${accessToken}`);
  headers.set('X-Noroff-API-Key', getNoroffApiKey());
  return headers;
}
