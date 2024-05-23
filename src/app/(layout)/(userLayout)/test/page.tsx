import React from 'react';

import { parseISO, startOfDay } from 'date-fns';

import { venueService } from '@/lib/services';
import { filterAndSortBookings } from '@/lib/services/venueService/getNextAvailableDates';
import { VenueDetailsCardChat } from '@/components/chat/VenueCardChat';
import { Debug } from '@/components/Debug';

const Page = async () => {
  const currentDate = new Date();

  const { availableDate } = await venueService.getNextAvailableDates({
    venueId: 'f0b7b4ce-ceaa-4659-89b8-3c8e24185cc6',
    startDate: currentDate,
    days: 1,
  });
  const { venue } = await venueService.getVenueById('f0b7b4ce-ceaa-4659-89b8-3c8e24185cc6');

  if (!availableDate || !venue) {
    return null;
  }

  const bookedDates = filterAndSortBookings(venue.bookings, currentDate);

  return (
    <>
      <div className="flex min-h-screen w-screen gap-4 bg-black text-white">
        <div className="flex-1">
          <h1>Booked dates</h1>
          <Debug data={bookedDates} />
        </div>
        <div className="flex-1">
          <h1>Available Dates</h1>
          <Debug data={availableDate} />
        </div>
      </div>
    </>
  );
};

export default Page;

export const dynamic = 'force-dynamic';
