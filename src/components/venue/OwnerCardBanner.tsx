'use client';

import { VENUE_FALLBACK_IMAGE } from '@/lib/constants';
import Image from 'next/image';

export const OwnerCardBanner = ({
  url,
  alt,
}: {
  url: string | null;
  alt: string | null;
}) => {
  return (
    <Image
      src={url || VENUE_FALLBACK_IMAGE}
      alt={alt || 'Holidaze owner banner'}
      width={48}
      height={48}
      className="absolute left-0 top-0 h-full w-full rounded-lg object-cover opacity-30"
      onError={(e) => {
        e.currentTarget.onerror = null;
        e.currentTarget.src = VENUE_FALLBACK_IMAGE.src;
      }}
    />
  );
};
