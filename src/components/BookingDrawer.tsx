'use client';

import type { VenueFull } from '@/lib/types';
import type { ReactNode } from 'react';

import { useRef, useState } from 'react';

import Image from 'next/image';

import { VENUE_FALLBACK_IMAGE } from '@/lib/constants';
import { bookingService } from '@/lib/services';
import { formatUSD } from '@/lib/utils';
import { revalidateVenue } from '@/lib/utils/revalidateVenue';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { Badge } from './ui/badge';
import { Button, buttonVariants } from './ui/button';
import { useToast } from './ui/use-toast';

type Props = {
  venue: VenueFull;
  guests: number;
  startDate: Date | undefined;
  endDate: Date | undefined;
  totalPrice: number;
  amountOfDays: number;
  onSuccess: () => void;
  children: ReactNode;
};

export const BookingDrawer = ({
  venue,
  guests,
  startDate,
  endDate,
  totalPrice,
  amountOfDays,
  onSuccess,
  children,
}: Props) => {
  const closeDrawerRef = useRef<HTMLButtonElement | null>(null);
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!startDate || !endDate) {
      return;
    }

    setIsSubmitting(true);
    const res = await bookingService.createBooking({
      dateFrom: startDate.toISOString(),
      dateTo: endDate.toISOString(),
      guests,
      venueId: venue.id,
    });

    if (res.status === 200 && res.error === null) {
      closeDrawerRef.current?.click();

      // Show toast after drawer has closed
      setTimeout(() => {
        toast({
          title: 'Booking successful! ☀️',
          description: `Your booking at ${venue.name} has been confirmed, enjoy your stay!`,
          duration: 8000,
        });
      }, 500);

      onSuccess();
    } else {
      console.error('Booking failed', res.error);
      closeDrawerRef.current?.click();

      // Show toast after drawer has closed
      setTimeout(() => {
        toast({
          title: 'Booking failed! 🌧',
          description: `There was an error with your booking, please try again later.`,
          variant: 'destructive',
          duration: 15000,
        });
      }, 500);
    }

    setIsSubmitting(false);
    await revalidateVenue(venue.id);
  };
  return (
    <Drawer>
      <>{children}</>
      <DrawerContent className="mx-auto max-w-3xl pb-8 ">
        <form
          action={async () => {
            await handleSubmit();
          }}
        >
          <DrawerHeader className="flex flex-col pt-0">
            <div className="pb-2">
              <Image
                src={venue.media[0]?.url || VENUE_FALLBACK_IMAGE}
                alt={`Image of ${venue.name}`}
                width={600}
                height={400}
                className="aspect-video w-full max-w-full overflow-hidden rounded-md object-cover"
              />
            </div>
            <DrawerTitle className="truncate text-3xl">
              {venue.name}
            </DrawerTitle>
            <DrawerDescription>Owned by {venue.owner.name}</DrawerDescription>

            <div className="flex flex-wrap justify-center gap-2 sm:justify-start">
              <Badge>
                {guests} {guests > 1 ? 'guests' : 'guest'}
              </Badge>
              <Badge>
                {amountOfDays} {amountOfDays > 1 ? 'days' : 'day'}
              </Badge>
              <Badge>Check in: {startDate?.toLocaleDateString()}</Badge>
              <Badge>Check out: {endDate?.toLocaleDateString()}</Badge>
            </div>
            <span className="pt-4 text-xl">
              Total Price:
              <span className="font-bold"> {formatUSD(totalPrice)}</span>
            </span>
          </DrawerHeader>
          <DrawerFooter className="flex w-full flex-row">
            <DrawerClose
              ref={closeDrawerRef}
              className={buttonVariants({
                variant: 'outline',
                className: 'flex-1 cursor-pointer',
              })}
            >
              Cancel
            </DrawerClose>
            <Button className="flex-1 cursor-pointer" disabled={isSubmitting}>
              Confirm
            </Button>
          </DrawerFooter>
        </form>
      </DrawerContent>
    </Drawer>
  );
};
