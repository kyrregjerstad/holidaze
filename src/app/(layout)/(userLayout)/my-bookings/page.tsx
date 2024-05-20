import Link from 'next/link';
import { notFound } from 'next/navigation';

import { getAccessTokenCookie } from '@/lib/api/getAccessToken';
import { bookingService, profileService } from '@/lib/services';
import { getUserFromCookie } from '@/lib/utils/cookies';
import { Debug } from '@/components/Debug';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookingCard } from './BookingCard';
import { CancelBookingDialog } from './CancelBookingDialog';

type Props = {
  searchParams?: {
    tab?: string;
  };
};

const MyBookingsPage = async ({ searchParams }: Props) => {
  const user = getUserFromCookie();
  const accessToken = await getAccessTokenCookie();
  const tab = searchParams?.tab === 'past' ? 'past' : 'upcoming';

  if (!user || !accessToken) {
    notFound();
  }

  const { bookings, error } = await profileService.getAllBookings(user.name, accessToken);

  if (error) {
    console.error(error);
    return notFound();
  }

  const upcoming = bookings?.filter((booking) => new Date(booking.dateTo) > new Date()) || [];
  const past = bookings?.filter((booking) => new Date(booking.dateTo) < new Date()) || [];

  const handleCancel = async (bookingId: string) => {
    'use server';
    const { status, error } = await bookingService.cancelBooking({ venueId: bookingId });

    if (status === 204) {
      return true;
    }

    console.error('Failed to cancel booking', error);

    return false;
  };

  return (
    <div className="w-full max-w-7xl">
      <Breadcrumb className="self-start p-8">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`/profiles/${user.name}`}>{user.name}</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="max-w-xs truncate">My bookings</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <section className="mx-auto max-w-5xl p-8">
        <Tabs defaultValue={tab}>
          <TabsList>
            <TabsTrigger value="upcoming" asChild>
              <Link href="/my-bookings?tab=upcoming" shallow>
                Upcoming
              </Link>
            </TabsTrigger>
            <TabsTrigger value="past" asChild>
              <Link href="/my-bookings?tab=past" shallow>
                Past
              </Link>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="upcoming">
            <CancelBookingDialog handleCancel={handleCancel}>
              <section className="mx-auto grid max-w-5xl gap-4 gap-y-12 p-8 sm:grid-cols-2">
                {upcoming.map((booking) => (
                  <BookingCard key={booking.id} booking={booking} upcoming={true} />
                ))}
              </section>
            </CancelBookingDialog>
          </TabsContent>
          <TabsContent value="past">
            <section className="mx-auto grid max-w-5xl gap-4 gap-y-12 p-8 sm:grid-cols-2">
              {past.map((booking) => (
                <BookingCard key={booking.id} booking={booking} upcoming={false} />
              ))}
            </section>
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
};

export default MyBookingsPage;
