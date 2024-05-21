'use client';

import type { venueSchemaFull } from '@/lib/schema/venueSchema';
import type { z } from 'zod';

import { useEffect } from 'react';

import { extractBookedDates, formatUSD } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookingDrawer } from '../BookingDrawer';
import { DatePicker } from '../DatePicker';
import { buttonVariants } from '../ui/button';
import { DrawerTrigger } from '../ui/drawer';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Separator } from '../ui/separator';
import { useToast } from '../ui/use-toast';
import { useBookingStore } from './bookingStore';

type Props = {
  venue: z.infer<typeof venueSchemaFull>;
};

export const NewBookingCard = ({ venue }: Props) => {
  const { toast } = useToast();
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

  const handleGuestsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const guests = Number(e.target.value);
    if (guests > venue.maxGuests) {
      setGuests(venue.maxGuests);
      toast({
        title: 'Max guests reached',
        description: `This venue can accommodate max ${venue.maxGuests} guests`,
        variant: 'error',
      });

      return;
    }
    setGuests(Number(e.target.value));
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
                  onChange={handleGuestsChange}
                  value={guests}
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
