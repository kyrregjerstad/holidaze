import Script from 'next/script';

export const Analytics = () => {
  return (
    <>
      <Script defer data-domain="holidaze.homes" src="https://analytics.kyrre.dev/js/script.js" />
    </>
  );
};
