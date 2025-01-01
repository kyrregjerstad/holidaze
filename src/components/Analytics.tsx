import Script from 'next/script';

import { HotJar } from './HotJar';

export const Analytics = () => {
  return (
    <>
      <Script
        defer
        data-domain="holidaze.homes"
        src={process.env.NEXT_PUBLIC_PLAUSIBLE_SCRIPT_URL}
      />
      <HotJar />
    </>
  );
};
