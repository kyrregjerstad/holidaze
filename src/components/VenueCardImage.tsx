'use client';

import Image from 'next/image';

import { VENUE_FALLBACK_IMAGE } from '@/lib/constants';
import { cn } from '@/lib/utils';

export const VenueCardImage = ({
  url,
  name,
  description,
  className,
}: {
  url: string | undefined;
  name: string;
  description: string;
  className?: string;
}) => {
  return (
    <Image
      alt={`Holidaze featured Home: ${name} - ${description}`}
      className={cn(
        'size-52 w-full object-cover transition-transform duration-500 group-hover:scale-105',
        className
      )}
      width="314"
      height="192"
      src={url || VENUE_FALLBACK_IMAGE}
    />
  );
};
