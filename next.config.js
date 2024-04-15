import { withSentryConfig } from '@sentry/nextjs';

/** @type {import('next').NextConfig} */
const coreConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

const config = withSentryConfig(
  coreConfig,
  {
    silent: true,
    org: 'kyrre-gjerstad',
    project: 'holidaze',
  },
  {
    widenClientFileUpload: true,
    transpileClientSDK: true,
    tunnelRoute: '/monitoring',
    hideSourceMaps: true,
    disableLogger: true,
    automaticVercelMonitors: true,
  }
);

export default config;
