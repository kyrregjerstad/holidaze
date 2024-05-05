'use client';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { VENUE_FALLBACK_IMAGE } from '@/lib/constants';
import { GripIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

type Image = {
  url: string;
  alt: string;
};
type Props = {
  images: Image[];
};
export const VenueGallery = ({ images }: Props) => {
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);

  return (
    <Dialog>
      <section className="relative min-h-32 bg-gray-100 dark:bg-gray-800">
        <div className="grid gap-2 sm:grid-cols-4">
          {images.map(({ url, alt }) => (
            <DialogTrigger
              key={url}
              onClick={() => setSelectedImage({ url, alt })}
              className="cursor-pointer"
            >
              <Image
                alt={alt}
                className="aspect-square object-cover"
                height={600}
                width={600}
                src={url}
              />
            </DialogTrigger>
          ))}
        </div>
        <Button
          className="absolute bottom-4 right-4 gap-1"
          size="sm"
          variant="secondary"
        >
          <GripIcon className="h-4 w-4" />
          Show all photos
        </Button>
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
