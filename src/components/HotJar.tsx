'use client';

import { useEffect } from 'react';

import { hotjar } from 'react-hotjar';

export const HotJar = () => {
  useEffect(() => {
    const id = Number(process.env.NEXT_PUBLIC_HOTJAR_ID);

    if (!id || isNaN(id)) {
      throw new Error('Missing NEXT_PUBLIC_HOTJAR_ID');
    }

    hotjar.initialize({
      id,
      sv: 6,
    });
  }, []);

  return null;
};
