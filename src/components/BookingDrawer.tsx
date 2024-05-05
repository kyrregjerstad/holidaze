'use client';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { fetchCreateBooking } from '@/lib/services/bookingService';
import { Venue } from '@/lib/services/venuesService';
import { formatUSD } from '@/lib/utils';
import { ReactNode, useRef } from 'react';
import { Badge } from './ui/badge';
import { Button, buttonVariants } from './ui/button';
import { useToast } from './ui/use-toast';

type Props = {
  venue: Venue;
  guests: number;
  startDate: Date | undefined;
  endDate: Date | undefined;
  totalPrice: number;
  amountOfDays: number;
  children: ReactNode;
};

export const BookingDrawer = ({
  venue,
  guests,
  startDate,
  endDate,
  totalPrice,
  amountOfDays,
  children,
}: Props) => {
  const closeDrawerRef = useRef<HTMLButtonElement | null>(null);
  const { toast } = useToast();
  const handleSubmit = async () => {
    if (!startDate || !endDate) {
      return;
    }
    const res = await fetchCreateBooking({
      dateFrom: startDate.toISOString(),
      dateTo: endDate.toISOString(),
      guests,
      venueId: venue.id,
    });

    if (res.status === 200 && res.error === null) {
      console.log('Booking successful');
      closeDrawerRef.current?.click();

      // Show toast after drawer has closed
      setTimeout(() => {
        toast({
          title: 'Booking successful! ☀️',
          description: `Your booking at ${venue.name} has been confirmed, enjoy your stay!`,
          duration: 8000,
        });
      }, 500);
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
  };
  return (
    <Drawer>
      <>{children}</>
      <DrawerContent className="mx-auto max-w-3xl pb-8">
        <form
          action={async () => {
            await handleSubmit();
          }}
        >
          <DrawerHeader className="flex flex-col">
            <div className="">
              <img
                src={venue.media[0].url}
                alt=""
                className="max-w-full overflow-hidden rounded-md"
              />
            </div>
            <DrawerTitle className="text-3xl">{venue.name}</DrawerTitle>
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
                className: 'flex-1',
              })}
            >
              Cancel
            </DrawerClose>
            <Button className="flex-1">Confirm</Button>
          </DrawerFooter>
        </form>
      </DrawerContent>
    </Drawer>
  );
};
