import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

type Props = {
  owner: {
    name: string;
    bio: string | null;
    avatar: {
      url: string;
      alt: string;
    } | null;
    banner: {
      url: string;
      alt: string;
    } | null;
  };
};

export const OwnerCard = ({ owner }: Props) => {
  return (
    <Card>
      <CardHeader className="relative flex flex-row gap-2">
        {owner.banner && (
          <img
            src={owner.banner.url}
            alt={owner.banner.alt}
            width={48}
            height={48}
            className="absolute left-0 top-0 h-full w-full rounded-lg object-cover opacity-30"
          />
        )}
        <div className="z-10 flex items-center justify-center gap-2 ">
          <Avatar>
            <AvatarImage src={owner.avatar?.url} alt={owner.avatar?.alt} />
            <AvatarFallback>{owner.name.at(0)}</AvatarFallback>
          </Avatar>
          <CardTitle>
            <Link href={`/profiles/${owner.name}`} className="hover:underline">
              {owner.name}
            </Link>
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription className="pt-8">
          {owner.bio || 'This owner has not written a bio yet.'}
        </CardDescription>
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
};
