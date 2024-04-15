import { fetchVenueById } from '@/lib/services/venuesService';
import { notFound } from 'next/navigation';
import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { z } from 'zod';
import { VenueGallery } from './VenueGallery';
import { VenueDetailsCard } from './VenueDetailsCard';
import { ReportDialog } from './ReportDialog';
import { VenueAmenitiesPreview } from './VenueAmenitiesPreview';
import { DetailsPreview } from './DetailsPreview';
import { Debug } from '@/components/Debug';
import { Location } from './Location';

type Props = {
  params: { id: string };
};

const VenuePage = async ({ params }: Props) => {
  const result = paramsSchema.safeParse(params);
  if (!result.success) return notFound();

  const { venue } = await fetchVenueById(result.data.id);
  if (!venue) return notFound();

  const amenities = Object.entries(venue.meta)
    .filter(([_key, value]) => Boolean(value))
    .map(([key]) => key);

  return (
    <div className="mx-auto max-w-6xl p-4 sm:py-8 md:py-10 lg:px-6">
      <Debug data={venue} />
      <VenueGallery images={venue.media} />
      <section className="grid items-start gap-8 py-8 sm:gap-12 md:grid-cols-2 md:gap-16 lg:grid-cols-[1fr_400px]">
        <div className="row-start-2 grid gap-8 md:row-start-auto">
          <div className="hidden flex-col gap-1 md:flex">
            <h2 className="text-4xl font-semibold">{venue.name}</h2>
            <DetailsPreview maxGuests={venue.maxGuests} amenities={amenities} />
          </div>
          <div className="prose">
            <p>{venue.description}</p>
          </div>
          <div className="grid gap-8">
            {amenities.length > 0 && (
              <>
                <h3 className="text-xl font-semibold">
                  What this place offers
                </h3>
                <VenueAmenitiesPreview amenities={amenities} />
              </>
            )}
            {amenities.length > 6 && (
              <Button className="justify-self-start" variant="outline">
                Show all amenities
              </Button>
            )}
          </div>
          <div className="grid gap-8">
            <div className="grid gap-0.5">
              <h3 className="text-xl font-semibold">Find a date</h3>
              <div className="text-gray-500 dark:text-gray-400">
                Pick your travel dates for availability.
              </div>
            </div>
            <div className="justify-self-start rounded-lg p-0 sm:border sm:p-4">
              <Calendar
                className="hidden p-0 xl:flex [&>div]:gap-6 [&>div]:space-x-0 [&_[name=day]]:h-10 [&_[name=day]]:w-10 [&_td]:h-10 [&_td]:w-10 [&_th]:w-10"
                mode="range"
                numberOfMonths={2}
              />
              {/* <Calendar className="flex p-0 xl:hidden" /> */}
            </div>
          </div>
        </div>
        <div className="row-start-1 grid gap-4 md:row-start-auto">
          {/* <div className="flex flex-col gap-1 sm:hidden">
            <h2 className="font-semibold sm:text-2xl">
              Venue in Santa Cruz, California, United States
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 sm:text-base">
              2 guests · 1 bedroom · 1 bed · 1 bath · Wifi · Kitchen
            </p>
          </div> */}
          <VenueDetailsCard venue={venue} />
          <ReportDialog />
        </div>
      </section>
      <Location location={venue.location} />
    </div>
  );
};

const paramsSchema = z.object({
  id: z.string().min(36).max(36),
});

export default VenuePage;
