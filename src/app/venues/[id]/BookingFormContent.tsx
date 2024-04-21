'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { formatUSD } from '@/lib/utils';
import { useEffect } from 'react';
import { DatePicker } from './DatePicker';
import { useBookingStore } from './bookingStore';

type Props = {
  price: number;
  bookedDates: Date[];
  maxGuests: number;
};
export const BookingFormContent = ({
  price,
  bookedDates,
  maxGuests,
}: Props) => {
  const {
    startDate,
    endDate,
    amountOfDays,
    areDatesAvailable,
    setStartDate,
    setEndDate,
    setGuests,
    calculateDays,
    checkAvailability,
  } = useBookingStore((state) => state);

  useEffect(() => {
    calculateDays();
  }, [startDate, endDate]);

  useEffect(() => {
    checkAvailability(bookedDates);
  }, [startDate, endDate, bookedDates]);

  return (
    <>
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
              defaultValue={maxGuests >= 2 ? 2 : 1}
              className="w-20"
              max={maxGuests}
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
          <div>{formatUSD(price * amountOfDays)}</div>
        </div>
        <Separator />
      </div>
      <div>
        <Button className="h-12 w-full" size="lg" disabled={!areDatesAvailable}>
          Reserve
        </Button>
      </div>
      <div className="text-center text-sm text-gray-500 dark:text-gray-400">
        You won't be charged yet
      </div>
    </>
  );
};
