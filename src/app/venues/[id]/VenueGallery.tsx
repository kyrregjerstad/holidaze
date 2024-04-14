import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { GripIcon } from 'lucide-react';

type Props = {
  images: { url: string; alt: string }[];
};
export const VenueGallery = ({ images }: Props) => {
  return (
    <section className="relative bg-gray-100 dark:bg-gray-800">
      <div className="grid gap-2 sm:grid-cols-4">
        {images.map((image) => (
          <Link
            className="relative overflow-hidden rounded-xl transition-all after:absolute after:inset-0 after:bg-black after:opacity-0 hover:after:opacity-20 focus:after:opacity-20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 dark:focus-visible:ring-gray-300"
            href="#"
            key={image.url}
          >
            <img
              alt={image.alt}
              className="aspect-square object-cover"
              height={600}
              src={image.url}
              width={600}
            />
          </Link>
        ))}
        {/* <Link
          className="relative col-span-2 row-span-2 overflow-hidden rounded-xl transition-all after:absolute after:inset-0 after:bg-black after:opacity-0 hover:after:opacity-20 focus:after:opacity-20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 dark:focus-visible:ring-gray-300 sm:rounded-l-xl"
          href="#"
        >
          <img
            alt="Venue Image"
            className="aspect-square object-cover"
            height={600}
            src="/placeholder.svg"
            width={600}
          />
        </Link>
        <Link
          className="relative overflow-hidden rounded-tl-xl transition-all after:absolute after:inset-0 after:bg-black after:opacity-0 hover:after:opacity-20 focus:after:opacity-20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 dark:focus-visible:ring-gray-300"
          href="#"
        >
          <img
            alt="Venue Image"
            className="aspect-square object-cover"
            height={600}
            src="/placeholder.svg"
            width={600}
          />
        </Link>
        <Link
          className="relative overflow-hidden rounded-tr-xl transition-all after:absolute after:inset-0 after:bg-black after:opacity-0 hover:after:opacity-20 focus:after:opacity-20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 dark:focus-visible:ring-gray-300"
          href="#"
        >
          <img
            alt="Venue Image"
            className="aspect-square object-cover"
            height={600}
            src="/placeholder.svg"
            width={600}
          />
        </Link>
        <Link
          className="relative overflow-hidden rounded-bl-xl transition-all after:absolute after:inset-0 after:bg-black after:opacity-0 hover:after:opacity-20 focus:after:opacity-20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 dark:focus-visible:ring-gray-300"
          href="#"
        >
          <img
            alt="Venue Image"
            className="aspect-square object-cover"
            height={600}
            src="/placeholder.svg"
            width={600}
          />
        </Link>
        <Link
          className="relative overflow-hidden rounded-br-xl transition-all after:absolute after:inset-0 after:bg-black after:opacity-0 hover:after:opacity-20 focus:after:opacity-20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 dark:focus-visible:ring-gray-300"
          href="#"
        >
          <img
            alt="Venue Image"
            className="aspect-square object-cover"
            height={600}
            src="/placeholder.svg"
            width={600}
          />
        </Link> */}
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
  );
};
