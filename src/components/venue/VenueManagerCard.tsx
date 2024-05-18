'use client';

import type { VenueFull } from '@/lib/types';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { EllipsisVerticalIcon } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DeleteVenueDialog } from '../DeleteVenueDialog';
import { AlertDialogTrigger } from '../ui/alert-dialog';
import { Button, buttonVariants } from '../ui/button';
import { useToast } from '../ui/use-toast';

type Props = {
  venue: VenueFull;
  deleteVenue: (venueId: string) => Promise<boolean>;
};
export const VenueManagerCard = ({ venue, deleteVenue }: Props) => {
  const { toast } = useToast();
  const router = useRouter();

  const handleDelete = async () => {
    const success = await deleteVenue(venue.id);
    if (success) {
      toast({
        title: 'Venue deleted',
        description: 'Your venue has been successfully deleted',
      });
      router.push('/manage/venues');
    } else {
      toast({
        title: 'Failed to delete venue',
        description: 'An error occurred while deleting your venue',
        variant: 'error',
      });
    }
  };
  return (
    <Card>
      <CardHeader className="">
        <CardTitle>
          <span className="block text-lg font-normal">Your venue</span>
          <span>{venue.name}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex gap-2">
        <Link
          href={`/manage/venues/${venue.id}`}
          className={buttonVariants({ className: 'w-full' })}
        >
          Manage
        </Link>
        <DeleteVenueDialog handleDelete={handleDelete}>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <EllipsisVerticalIcon />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem asChild>
                <Link href={`/manage/venues/edit/${venue.id}`} className="cursor-pointer">
                  Edit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/manage/venues/${venue.id}`} className="cursor-pointer">
                  Bookings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/manage/venues`} className="cursor-pointer">
                  All Venues
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="w-full cursor-pointer" size="sm">
                    Delete
                  </Button>
                </AlertDialogTrigger>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </DeleteVenueDialog>
      </CardContent>
    </Card>
  );
};
