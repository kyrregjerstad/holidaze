'use client';

import { useState } from 'react';

import { differenceInDays } from 'date-fns';
import { z } from 'zod';

import { venueSchemaFull } from '@/lib/schema';
import { bookingService } from '@/lib/services';
import { extractBookedDates, formatUSD } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DatePicker } from '../DatePicker';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Separator } from '../ui/separator';
import { Skeleton } from '../ui/skeleton';
import { useToast } from '../ui/use-toast';

type Props = {
  venue: z.infer<typeof venueSchemaFull>;
  preSelectedValues?: {
    startDate?: Date;
    endDate?: Date;
    guests?: number;
  };
};

export const VenueConfirmBookingCardChat = ({ venue, preSelectedValues }: Props) => {
  const today = new Date();
  const inTwoDays = new Date(new Date().setDate(new Date().getDate() + 2));

  const [startDate, setStartDate] = useState<Date>(preSelectedValues?.startDate || today);
  const [endDate, setEndDate] = useState<Date>(preSelectedValues?.endDate || inTwoDays);
  const [guests, setGuests] = useState(1);
  const [amountOfDays, setAmountOfDays] = useState(differenceInDays(endDate, startDate));
  const [totalPrice, setTotalPrice] = useState(venue.price * amountOfDays);
  const [areDatesAvailable, setAreDatesAvailable] = useState(true);
  const { toast } = useToast();

  const disabledDates = extractBookedDates(venue.bookings);

  differenceInDays(endDate, startDate);

  const handleGuestChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (Number(e.target.value) > venue.maxGuests) {
      toast({
        title: 'Error',
        description: `This venue can accommodate max ${venue.maxGuests} guests`,
      });
    } else {
      setGuests(Number(e.target.value));
    }
  };

  const handleStartDateChange = (date: Date | undefined) => {
    if (!date) return;
    setStartDate(date);
    setAmountOfDays(differenceInDays(endDate, date));
  };

  const handleEndDateChange = (date: Date | undefined) => {
    if (!date) return;
    setEndDate(date);
    setAmountOfDays(differenceInDays(date, startDate));
  };

  const handleSubmit = async () => {
    const { booking, status, error } = await bookingService.createBooking({
      dateFrom: startDate.toISOString(),
      dateTo: endDate.toISOString(),
      guests: guests,
      venueId: venue.id,
    });

    if (error) {
      return toast({
        title: 'Error',
        description: error._errors.map((e) => e).join(', '),
        variant: 'error',
      });
    }

    if (!booking) {
      return toast({
        title: 'Error',
        description: 'Something went wrong',
        variant: 'error',
      });
    }

    toast({
      title: 'Success',
      description: `Booking confirmed! Enjoy your stay at ${venue.name}!`,
    });

    console.log({ booking, status, error });
  };

  return (
    <Card>
      <form
        action={async (formData) => {
          await handleSubmit();
        }}
      >
        <CardHeader>
          <CardTitle>
            <span>{venue.name} </span>
          </CardTitle>
          <span className="text-sm">{formatUSD(venue.price)} per night</span>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid gap-6">
            <div className="grid gap-4">
              <div className="flex justify-between gap-2">
                <DatePicker
                  label="Check in"
                  bookedDates={disabledDates}
                  setDate={handleStartDateChange}
                  selectedDate={startDate}
                  overlayDate={endDate}
                />
                <DatePicker
                  label="Check out"
                  bookedDates={disabledDates}
                  setDate={handleEndDateChange}
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
                    onChange={handleGuestChange}
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
              <Button className="w-full" disabled={!areDatesAvailable || !startDate || !endDate}>
                Confirm Booking
              </Button>
            </div>
          </div>
        </CardContent>
      </form>
    </Card>
  );
};

export const VenueConfirmBookingCardChatSkeleton = () => {
  return (
    <Card>
      <Skeleton className="h-6 w-1/2" />
    </Card>
  );
};
