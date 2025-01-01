import Script from 'next/script';

import { PUBLIC_PLAUSIBLE_SCRIPT_URL } from '$env/static/public';

import { HotJar } from './HotJar';

export const Analytics = () => {
  return (
    <>
      <Script defer data-domain="holidaze.homes" src={PUBLIC_PLAUSIBLE_SCRIPT_URL} />
      <HotJar />
    </>
  );
};
