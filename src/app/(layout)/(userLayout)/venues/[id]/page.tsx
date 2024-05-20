import type { VenueFull } from '@/lib/types';

import { Suspense } from 'react';

import { notFound } from 'next/navigation';

import { z } from 'zod';

import { getAccessTokenCookie } from '@/lib/api/getAccessToken';
import { amenitiesKeysSchema } from '@/lib/schema/venueSchema';
import { venueService } from '@/lib/services';
import { getUserFromCookie } from '@/lib/utils/cookies';
import { Debug } from '@/components/Debug';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { BookingPreviewCard } from '@/components/venue/BookingPreviewCard';
import { DetailsPreview } from '@/components/venue/DetailsPreview';
import { DisabledBookingCard } from '@/components/venue/DisabledBookingCard';
import { LocationMap } from '@/components/venue/Location';
import { NewBookingCard } from '@/components/venue/NewBookingCard';
import { OtherVenuesByOwner } from '@/components/venue/OtherVenuesByOwner';
import { OwnerCard } from '@/components/venue/OwnerCard';
import { RelatedVenues } from '@/components/venue/RelatedVenues';
import { ReportDialog } from '@/components/venue/ReportDialog';
import { VenueAmenitiesPreview } from '@/components/venue/VenueAmenitiesPreview';
import { VenueManagerCard } from '@/components/venue/VenueManagerCard';
import { VenueGallery } from './VenueGallery';

type Props = {
  params: { id: string };
};

const VenuePage = async ({ params }: Props) => {
  const result = paramsSchema.safeParse(params);
  if (!result.success) return notFound();

  const { venue } = await venueService.getVenueById(result.data.id);
  if (!venue) return notFound();

  const amenities = amenitiesKeysSchema.parse(
    Object.entries(venue.meta)
      .filter(([_key, value]) => Boolean(value))
      .map(([key]) => key)
  );

  return (
    <div className="mx-auto w-full max-w-6xl px-4">
      <Suspense>
        <Debug data={venue} />
      </Suspense>
      <Breadcrumb className="py-8">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/search">Venues</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="max-w-xs truncate">{venue.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <VenueGallery images={venue.media} />
      <section className="grid w-full items-start gap-8 py-8 sm:gap-12 md:grid-cols-2 md:gap-16 lg:grid-cols-[1fr_400px]">
        <div className="row-start-2 grid gap-8 md:row-start-auto">
          <div className="flex flex-col gap-1">
            <h2 className="max-w-[600px] overflow-hidden text-pretty break-words pb-6 text-3xl font-semibold sm:text-5xl">
              {venue.name}
            </h2>
            <DetailsPreview maxGuests={venue.maxGuests} amenities={amenities} />
          </div>

          <div className="prose">
            <p>{venue.description}</p>
          </div>
          {amenities.length > 0 && (
            <div className="grid gap-4">
              <h3 className="text-xl font-semibold">What this place offers</h3>
              <div className="grid gap-8">
                <VenueAmenitiesPreview amenities={amenities} />
              </div>
            </div>
          )}
          <div className="grid gap-4">
            <h3 className="text-xl font-semibold">About the Owner</h3>
            <OwnerCard owner={venue.owner} />
          </div>
        </div>

        <div className="row-start-1 grid gap-4 md:row-start-auto">
          <Suspense fallback={<Skeleton className="h-64" />}>
            <InfoCards venue={venue} />
          </Suspense>
        </div>
      </section>
      <LocationMap location={venue.location} />
      <Separator className="my-12" />
      <section className="">
        <h3 className="pb-4 text-xl font-bold">Other venues by {venue.owner.name}: </h3>
        <Suspense fallback={<OtherVenuesSkeleton />}>
          <OtherVenuesByOwner venueId={venue.id} ownerName={venue.owner.name} />
        </Suspense>
      </section>
      <Separator className="my-20" />
      <section className="pb-20">
        <h3 className="pb-4 text-xl font-bold">Related Venues: </h3>
        <Suspense fallback={<OtherVenuesSkeleton />}>
          <RelatedVenues venueId={venue.id} />
        </Suspense>
      </section>
    </div>
  );
};

const paramsSchema = z.object({
  id: z.string().min(36).max(36),
});

export default VenuePage;

const OtherVenuesSkeleton = () => {
  return (
    <section className="py-8">
      <h3 className="pb-4 text-xl font-bold">Other venues by: </h3>
      <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <Skeleton key={index} className="h-64" />
        ))}
      </div>
    </section>
  );
};

const InfoCards = async ({ venue }: { venue: VenueFull }) => {
  const user = getUserFromCookie();

  if (!user) {
    return <DisabledBookingCard venue={venue} />;
  }

  const accessToken = await getAccessTokenCookie();
  if (user.name === venue.owner.name && user.isVenueManager && accessToken) {
    const deleteVenue = async (venueId: string) => {
      'use server';
      const { status, error } = await venueService.deleteVenue(venueId, accessToken);

      if (status === 204) {
        return true;
      } else {
        console.error('Failed to delete venue', error);
        return false;
      }
    };

    return <VenueManagerCard venue={venue} deleteVenue={deleteVenue} />;
  }

  const upcomingUserBooking = venue.bookings.find((booking) => booking.customer.name === user.name);

  return (
    <div className="flex flex-col justify-center gap-4">
      {upcomingUserBooking && <BookingPreviewCard venue={venue} booking={upcomingUserBooking} />}
      <NewBookingCard venue={venue} />
      <ReportDialog />
    </div>
  );
};
