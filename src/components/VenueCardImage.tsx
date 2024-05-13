'use client';

import Image from 'next/image';

import { VENUE_FALLBACK_IMAGE } from '@/lib/constants';

export const VenueCardImage = ({
  url,
  name,
  description,
}: {
  url: string | undefined;
  name: string;
  description: string;
}) => {
  return (
    <Image
      alt={`Holidaze featured Home: ${name} - ${description}`}
      className="size-52 w-full object-cover transition-transform duration-500 group-hover:scale-105"
      width="314"
      height="192"
      src={url || VENUE_FALLBACK_IMAGE}
      onError={(e) => {
        // e.currentTarget.onerror = null;
        // e.currentTarget.src = VENUE_FALLBACK_IMAGE.src;
      }}
    />
  );
};
