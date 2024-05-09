import { VenueGallery } from '@/app/(layout)/(userLayout)/venues/[id]/VenueGallery';
import { Debug } from '@/components/Debug';
import { Calendar } from '@/components/ui/calendar';
import { DetailsPreview } from '@/components/venue/DetailsPreview';
import { LocationMap } from '@/components/venue/Location';
import { VenueAmenitiesPreview } from '@/components/venue/VenueAmenitiesPreview';
import { amenitiesKeysSchema } from '@/lib/schema/venueSchema';
import { Venue, fetchVenueById } from '@/lib/services/venuesService';
import { getUserFromCookie } from '@/lib/utils/cookies';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { z } from 'zod';
import { UpcomingBookingsTable } from '../UpcomingBookingsTable';
import { processVenue } from '../processVenue';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import Image from 'next/image';
import { VENUE_FALLBACK_IMAGE } from '@/lib/constants';

type Props = {
  params: { id: string };
};

const VenuePage = async ({ params }: Props) => {
  const result = paramsSchema.safeParse(params);
  if (!result.success) return notFound();

  const { venue } = await fetchVenueById(result.data.id);
  if (!venue) return notFound();

  const user = getUserFromCookie();

  if (!user || user.name !== venue.owner.name) return notFound();

  const transformedVenues = processVenue(venue);

  return (
    <div className="mx-auto w-full max-w-6xl p-4 sm:py-8 md:py-10 lg:px-6">
      <Suspense>
        <Debug data={venue} />
      </Suspense>
      <Image
        src={venue.media[0].url || VENUE_FALLBACK_IMAGE}
        alt={venue.name}
        width={1200}
        height={600}
      />
      <section className="flex flex-col">
        <h2 className="truncate py-4 text-5xl font-semibold">{venue.name}</h2>
        <Link
          href={`/manage/venues/edit/${venue.id}`}
          className={buttonVariants({ className: 'self-start px-8' })}
        >
          Edit
        </Link>
        <UpcomingBookingsTable bookings={transformedVenues.bookings} />
        {/* <Calendar numberOfMonths={2} className="flex w-full" /> */}
        <div className="row-start-1 grid gap-4 md:row-start-auto"></div>
      </section>
    </div>
  );
};

const paramsSchema = z.object({
  id: z.string().min(36).max(36),
});

export default VenuePage;

export const dynamic = 'force-dynamic';
