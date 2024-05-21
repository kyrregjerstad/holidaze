import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';

import { differenceInDays } from 'date-fns';
import { Metadata } from 'next';

import { profileService, venueService } from '@/lib/services';
import { VenueFull } from '@/lib/types';
import { getUserFromCookie } from '@/lib/utils/cookies';
import { Debug } from '@/components/Debug';
import { BookingsTable } from './BookingsTable';

const ManageBookingsPage = async () => {
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

  const bookings = processVenues(venues);

  const deleteVenue = async (id: string) => {
    'use server';
    const { status, error } = await venueService.deleteVenue(id, accessToken);

    if (status === 204) {
      return true;
    } else {
      console.error('Failed to delete venue', error);
      return false;
    }
  };

  return (
    <div className="shadow-xs w-full overflow-hidden rounded-lg">
      <Debug data={venues} />
      <BookingsTable bookings={bookings} deleteVenue={deleteVenue} />
    </div>
  );
};

export default ManageBookingsPage;

function processVenues(venues: VenueFull[]) {
  return venues
    .flatMap((venue) =>
      venue.bookings.map((booking) => ({
        id: booking.id,
        dateFrom: new Date(booking.dateFrom),
        dateTo: new Date(booking.dateTo),
        totalDays: differenceInDays(new Date(booking.dateTo), new Date(booking.dateFrom)),
        guests: booking.guests,
        totalPrice:
          differenceInDays(new Date(booking.dateTo), new Date(booking.dateFrom)) * venue.price,
        customer: {
          name: booking.customer.name,
          avatar: booking.customer.avatar,
          banner: booking.customer.banner,
        },
        venue: {
          name: venue.name,
          id: venue.id,
        },
      }))
    )
    .sort((a, b) => a.dateFrom.getTime() - b.dateFrom.getTime());
}

export const metadata: Metadata = {
  title: 'Holidaze | Manage Bookings',
};
