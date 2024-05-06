import { fetchAllVenues } from '@/lib/services/venuesService';
import { VenueCard } from '../VenueCard';

export const RelatedVenues = async ({ venueId }: { venueId: string }) => {
  // fetch one more venue to ensure we have 4 related venues
  const { venues } = await fetchAllVenues({ limit: 5 });

  // To ensure we're not showing the current venue in the related venues
  const filteredVenues = venues
    .filter((venue) => venue.id !== venueId)
    .slice(0, 4);

  return (
    <section className="py-8">
      <h3 className="pb-4 text-xl font-bold">Related Venues: </h3>
      <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
        {filteredVenues.map((venue) => (
          <VenueCard key={venue.id} venue={venue} />
        ))}
      </div>
    </section>
  );
};
