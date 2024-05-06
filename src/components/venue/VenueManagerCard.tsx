import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { venueSchemaExtended } from '@/lib/schema/venueSchema';

import Link from 'next/link';
import { z } from 'zod';
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
      <CardContent>
        <Link href={`/manage/venue/${venue.id}`} className={buttonVariants()}>
          Manage
        </Link>
        <div className="flex gap-2 pt-2"></div>
      </CardContent>
    </Card>
  );
};
