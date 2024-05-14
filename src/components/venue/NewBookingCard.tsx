'use client';

import type { venueSchemaFull } from '@/lib/schema/venueSchema';
import type { z } from 'zod';

import { useEffect } from 'react';

import { formatUSD } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookingDrawer } from '../BookingDrawer';
import { DatePicker } from '../DatePicker';
import { buttonVariants } from '../ui/button';
import { DrawerTrigger } from '../ui/drawer';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Separator } from '../ui/separator';
import { useBookingStore } from './bookingStore';

type Props = {
  venue: z.infer<typeof venueSchemaFull>;
};

export const NewBookingCard = ({ venue }: Props) => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const inOneWeek = new Date(today);
  inOneWeek.setDate(inOneWeek.getDate() + 7);

  const bookedDates = extractBookedDates(venue.bookings);

  const {
    startDate,
    endDate,
    amountOfDays,
    areDatesAvailable,
    setStartDate,
    setEndDate,
    setGuests,
    guests,
    calculateTotalDays,
  } = useBookingStore();

  useEffect(() => {
    calculateTotalDays();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, endDate]);

  const totalPrice = venue.price * amountOfDays;

  const onSuccess = () => {
    setStartDate(undefined, bookedDates);
    setEndDate(undefined, bookedDates);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          ${venue.price}
          <span className="text-sm font-normal text-gray-500 dark:text-gray-400">/night</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="grid gap-6">
          <div className="grid gap-4">
            <div className="flex justify-between gap-2">
              <DatePicker
                label="Check in"
                bookedDates={bookedDates}
                setDate={setStartDate}
                selectedDate={startDate}
                overlayDate={endDate}
              />
              <DatePicker
                label="Check out"
                bookedDates={bookedDates}
                setDate={setEndDate}
                selectedDate={endDate}
                overlayDate={startDate}
              />
            </div>
            {!areDatesAvailable && (
              <div className="text-center text-red-500 dark:text-red-400">
                Selected dates are not available
              </div>
            )}

            <div className="flex justify-between">
              <div>
                <Label htmlFor="guests">Guests</Label>
                <Input
                  id="guests"
                  name="guests"
                  type="number"
                  defaultValue={venue.maxGuests >= 2 ? 2 : 1}
                  className="w-20"
                  max={venue.maxGuests}
                  min={1}
                  onChange={(e) => setGuests(Number(e.target.value))}
                />
              </div>
              <div className="self-end justify-self-end ">
                <span>
                  {amountOfDays} {amountOfDays > 1 ? 'days' : 'day'}
                </span>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <Separator />
            <div className="flex items-center justify-between">
              <div className="font-semibold">Total</div>
              <div>{formatUSD(totalPrice)}</div>
            </div>
            <Separator />
          </div>
          <div>
            <BookingDrawer
              venue={venue}
              guests={guests}
              startDate={startDate}
              endDate={endDate}
              amountOfDays={amountOfDays}
              totalPrice={totalPrice}
              onSuccess={onSuccess}
            >
              <DrawerTrigger
                className={buttonVariants({ className: 'w-full' })}
                disabled={!areDatesAvailable || !startDate || !endDate}
              >
                Reserve
              </DrawerTrigger>
            </BookingDrawer>
          </div>
          <div className="text-center text-sm text-gray-500 dark:text-gray-400">
            You won&apos;t be charged yet
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

function extractBookedDates(bookings: { dateFrom: string; dateTo: string }[]) {
  return bookings.flatMap(({ dateFrom, dateTo }) => {
    const start = new Date(dateFrom);
    const end = new Date(dateTo);
    return generateDates(start, end);
  });
}

function generateDates(start: Date, end: Date): Date[] {
  if (start > end) {
    return [];
  } else {
    const nextDate = new Date(start);
    nextDate.setDate(nextDate.getDate() + 1);
    return [new Date(start), ...generateDates(nextDate, end)];
  }
}
