'use client';

import { ReactNode } from 'react';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/components/ui/use-toast';

export const CancelBookingDialog = ({
  children,
  handleCancel,
}: {
  children: ReactNode;
  handleCancel: (bookingId: string) => Promise<boolean>;
}) => {
  const params = useSearchParams();
  const bookingId = params.get('cancelBookingId');
  const { toast } = useToast();

  const cancelBooking = async () => {
    if (!bookingId) return;

    const success = await handleCancel(bookingId);

    if (success) {
      toast({
        title: 'Booking canceled',
        description: 'Your booking has been canceled',
      });
    } else {
      toast({
        title: 'Failed to cancel booking',
        description: 'Please try again later',
        variant: 'error',
      });
    }
  };

  return (
    <AlertDialog>
      {children}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure you want to cancel this booking?</AlertDialogTitle>
          <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={cancelBooking} asChild>
            <Link href="/my-bookings" shallow>
              Continue
            </Link>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
