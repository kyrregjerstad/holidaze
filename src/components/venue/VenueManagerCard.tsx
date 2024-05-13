import Link from 'next/link';

import { z } from 'zod';

import { venueSchemaExtended } from '@/lib/schema/venueSchema';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { buttonVariants } from '../ui/button';

type Props = {
  venue: z.infer<typeof venueSchemaExtended>;
  user: { name: string };
};
export const VenueManagerCard = ({ venue, user }: Props) => {
  return (
    <Card>
      <CardHeader className="">
        <CardTitle>
          <span className="block text-lg font-normal">Your venue</span>
          <span>{venue.name}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex gap-2">
        <Link href={`/manage/venues/${venue.id}`} className={buttonVariants()}>
          Manage
        </Link>
        <Link
          href={`/manage/venues/edit/${venue.id}`}
          className={buttonVariants({ variant: 'secondary' })}
        >
          Edit
        </Link>
        <div className="flex gap-2 pt-2"></div>
      </CardContent>
    </Card>
  );
};
