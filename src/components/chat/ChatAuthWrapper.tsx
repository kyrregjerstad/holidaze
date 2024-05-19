import { getAccessTokenCookie } from '@/lib/api/getAccessToken';
import { authService } from '@/lib/services';
import { getUserFromCookie } from '@/lib/utils/cookies';
import { Chat } from './Chat';

export const ChatAuthWrapper = async () => {
  const user = getUserFromCookie();
  const accessToken = await getAccessTokenCookie();
  if (!user || !accessToken) {
    return null;
  }

  const { authorized } = await authService.authCheck(accessToken);

  if (!authorized) {
    return null;
  }

  return <Chat user={user} />;
};
