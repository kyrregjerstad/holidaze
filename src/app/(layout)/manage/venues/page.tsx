import { fetchAllVenuesByProfile } from '@/lib/services/profileService';

import { VenuesTable } from './VenuesTable';

const ManageVenuesPage = async () => {
  const { venues, error } = await fetchAllVenuesByProfile('kyrre');

  if (error) {
    console.error(error);
  }

  return (
    <div>
      <div className="shadow-xs w-full overflow-hidden rounded-lg">
        <VenuesTable venues={venues} />
      </div>
    </div>
  );
};

export default ManageVenuesPage;
