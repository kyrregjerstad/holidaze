import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Debug } from '@/components/Debug';
import { amenitiesKeysSchema } from '@/lib/schema/venueSchema';
import { fetchVenueById } from '@/lib/services/venuesService';
import { notFound } from 'next/navigation';
import { z } from 'zod';
import { DetailsPreview } from '@/components/venue/DetailsPreview';
import { Location } from '@/components/venue/Location';
import { NewBookingCard } from '@/components/venue/NewBookingCard';
import { OwnerCard } from '@/components/venue/OwnerCard';
import { ReportDialog } from '@/components/venue/ReportDialog';
import { VenueAmenitiesPreview } from '@/components/venue/VenueAmenitiesPreview';
import { VenueGallery } from './VenueGallery';
import { BookingPreviewCard } from '@/components/venue/BookingPreviewCard';
import { RelatedVenues } from '@/components/venue/RelatedVenues';

type Props = {
  params: { id: string };
};

const VenuePage = async ({ params }: Props) => {
  const result = paramsSchema.safeParse(params);
  if (!result.success) return notFound();

  const { venue } = await fetchVenueById(result.data.id);
  if (!venue) return notFound();

  const amenities = amenitiesKeysSchema.parse(
    Object.entries(venue.meta)
      .filter(([_key, value]) => Boolean(value))
      .map(([key]) => key)
  );

  return (
    <div className="mx-auto max-w-6xl px-4">
      <Debug data={venue} />
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
            <BreadcrumbPage>{venue.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <VenueGallery images={venue.media} />
      <section className="grid items-start gap-8 py-8 sm:gap-12 md:grid-cols-2 md:gap-16 lg:grid-cols-[1fr_400px]">
        <div className="row-start-2 grid gap-8 md:row-start-auto">
          <div className="hidden flex-col gap-1 md:flex">
            <h2 className="pb-6 text-5xl font-semibold">{venue.name}</h2>
            <DetailsPreview maxGuests={venue.maxGuests} amenities={amenities} />
          </div>

          <div className="prose pb-8">
            <p>{venue.description}</p>
          </div>
          <div className="grid gap-20">
            {amenities.length > 0 && (
              <div className="grid gap-4">
                <h3 className="text-xl font-semibold">
                  What this place offers
                </h3>
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
        </div>

        <div className="row-start-1 grid gap-4 md:row-start-auto">
          <BookingPreviewCard venue={venue} />
          <NewBookingCard venue={venue} />
          <ReportDialog />
        </div>
      </section>
      <Location location={venue.location} />
      <RelatedVenues venueId={venue.id} />
    </div>
  );
};

const paramsSchema = z.object({
  id: z.string().min(36).max(36),
});

export default VenuePage;
