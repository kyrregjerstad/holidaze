import Script from 'next/script';

import { HotJar } from './HotJar';

export const Analytics = () => {
  return (
    <>
      <Script defer data-domain="holidaze.homes" src="https://analytics.kyrre.dev/js/script.js" />
      <HotJar />
    </>
  );
};
