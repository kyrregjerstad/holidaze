'use client';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { GripIcon } from 'lucide-react';
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
            >
              <img
                alt={alt}
                className="aspect-square object-cover"
                height={600}
                src={url}
                width={600}
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
        <div className="w-full">
          <img
            alt={selectedImage?.alt}
            src={selectedImage?.url}
            className="w-full"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

const ImagePreview = ({ image }: { image: { url: string; alt: string } }) => {
  return (
    <Link
      className="relative overflow-hidden rounded-xl transition-all after:absolute after:inset-0 after:bg-black after:opacity-0 hover:after:opacity-20 focus:after:opacity-20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 dark:focus-visible:ring-gray-300"
      href="#"
    >
      <img
        alt={image.alt}
        className="aspect-square object-cover"
        height={600}
        src={image.url}
        width={600}
      />
    </Link>
  );
};
