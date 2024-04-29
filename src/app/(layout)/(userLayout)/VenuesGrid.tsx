import { VenueCard } from '@/components/VenueCard';
import { fetchAllVenues } from '@/lib/services/venuesService';

export const VenuesGrid = async () => {
  const { venues, error } = await fetchAllVenues();

  return (
    <div className="mt-8 grid gap-x-6 gap-y-12 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {venues.map((venue) => (
        <VenueCard key={venue.id} venue={venue} />
      ))}
    </div>
  );
};
