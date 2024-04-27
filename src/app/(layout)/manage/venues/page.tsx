import { fetchAllVenuesByProfile } from '@/lib/services/profileService';

import { VenuesTable } from './VenuesTable';
import { processVenue } from './processVenue';

const ManageVenuesPage = async () => {
  const { venues, error } = await fetchAllVenuesByProfile('kyrre');

  if (error) {
    console.error(error);
  }

  const transformedVenues = venues.map(processVenue);

  return (
    <div>
      <div className="shadow-xs w-full overflow-hidden rounded-lg">
        <VenuesTable venues={transformedVenues} />
      </div>
    </div>
  );
};

export default ManageVenuesPage;
