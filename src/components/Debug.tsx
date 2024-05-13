'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';

type Props = {
  data: any;
};

export const Debug = ({ data }: Props) => {
  const params = useSearchParams();

  const debug = params.get('debug');

  if (!debug) return null;

  return (
    <pre className="my-8 max-h-[90dvh] max-w-[900px] overflow-auto border p-2 text-left text-sm text-gray-500 shadow-inner dark:text-gray-400">
      {JSON.stringify(data, null, 2)}
    </pre>
  );
};
