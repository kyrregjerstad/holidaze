import { venueService } from '@/lib/services';
import { VenueCard } from '@/components/VenueCard';

export const VenuesGrid = async () => {
  const { venues } = await venueService.getAllVenues();

  return (
    <div className="mt-8 grid gap-x-6 gap-y-12 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {venues.map((venue) => (
        <VenueCard key={venue.id} venue={venue} />
      ))}
    </div>
  );
};
