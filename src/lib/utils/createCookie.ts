type CookieOptions = {
  name: string;
  value: string;
  path?: string;
  days?: number;
};

export function createCookie({ name, value, path, days }: CookieOptions) {
  let expires = '';
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = `; expires=${date.toUTCString()}`;
  }

  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';

  return `${name}=${value}${expires}; HttpOnly; path=${path || '/'}; SameSite=Strict${secure}`;
}
