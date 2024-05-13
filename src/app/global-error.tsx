'use client';

import { useEffect } from 'react';
import * as Sentry from '@sentry/nextjs';
import Error from 'next/error';

export default function GlobalError(props: { error: unknown }) {
  useEffect(() => {
    Sentry.captureException(props.error);
  }, [props.error]);

  return (
    <html>
      <body>
        <Error statusCode={500} />
      </body>
    </html>
  );
}
