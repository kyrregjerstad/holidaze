'use client';

import { useState } from 'react';

import Image from 'next/image';

import { VENUE_FALLBACK_IMAGE } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

type Image = {
  url: string;
  alt: string;
};
type Props = {
  images: Image[];
};
export const VenueGallery = ({ images }: Props) => {
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);

  const totalImages = images.length;

  if (!images.length || totalImages === 0) {
    return null;
  }

  return (
    <Dialog>
      <section className="relative min-h-32 bg-gray-100 dark:bg-gray-800">
        <div
          className={cn('grid grid-cols-2 gap-2', {
            'sm:grid-cols-1': totalImages === 1,
            'sm:grid-cols-2': totalImages === 2,
            'sm:grid-cols-3': totalImages === 3 || totalImages == 5 || totalImages === 6,
            'sm:grid-cols-4': totalImages === 4 || totalImages === 7 || totalImages === 8,
          })}
        >
          {images.map(({ url, alt }) => (
            <DialogTrigger
              key={url}
              onClick={() => setSelectedImage({ url, alt })}
              className="cursor-pointer"
            >
              <Image
                alt={alt}
                className="aspect-square rounded-lg object-cover"
                height={600}
                width={600}
                src={url}
              />
            </DialogTrigger>
          ))}
        </div>
      </section>
      <DialogContent className="w-full">
        <div className="aspect-video w-full">
          <Image
            alt={selectedImage?.alt || 'Selected image'}
            src={selectedImage?.url || VENUE_FALLBACK_IMAGE}
            fill
            className="w-full object-cover"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
