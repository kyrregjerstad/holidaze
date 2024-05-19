import { profileService } from '..';

/* 
Checks if the user is authorized by requesting a profile from the server, which can only be done with a valid access token.
*/
export async function authCheck(accessToken: string) {
  const { status, error } = await profileService.getProfile('authcheck', accessToken);

  if (status === 401) {
    return { authorized: false, error: 'Unauthorized', status };
  } else if (error) {
    return { authorized: false, error, status };
  }

  return { authorized: true, error, status };
}
