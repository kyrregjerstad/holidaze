import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';

import { profileService, venueService } from '@/lib/services';
import { getUserFromCookie } from '@/lib/utils/cookies';
import { VenuesTable } from './VenuesTable';
import { processVenue } from './processVenue';

const ManageVenuesPage = async () => {
  const user = getUserFromCookie();
  const accessToken = cookies().get('accessToken')?.value;

  if (!user || !user.isVenueManager || !accessToken) {
    notFound();
  }

  const { venues, error } = await profileService.getAllVenuesByProfile(user.name, accessToken);

  if (error) {
    console.error(error);
    return notFound();
  }

  const transformedVenues = venues.map(processVenue);

  const handleDelete = async (id: string) => {
    'use server';
    const { status, error } = await venueService.deleteVenue(id, accessToken);

    console.log('status', status);
    console.log('error', error);

    if (status >= 400) {
      console.error('Failed to delete venue', error);
      return false;
    } else {
      return true;
    }
  };

  return (
    <div>
      <div className="shadow-xs w-full overflow-hidden rounded-lg">
        <VenuesTable venues={transformedVenues} handleDelete={handleDelete} />
      </div>
    </div>
  );
};

export default ManageVenuesPage;
