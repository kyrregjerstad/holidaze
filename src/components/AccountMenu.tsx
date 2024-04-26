import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { CookieUser } from '@/lib/utils/cookies';
import { LogOutBtn } from './LogOutBtn';
import { CircleUserIcon, FolderOpenIcon, HomeIcon } from 'lucide-react';
import Link from 'next/link';

type Props = {
  user: CookieUser;
};

export const AccountMenu = ({ user }: Props) => {
  const greeting = getGreetings(user.name);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarImage src={user.avatarUrl || undefined} />
          <AvatarFallback>{user.name[0]}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="p-2">
        <DropdownMenuLabel className="max-w-64 break-all">
          {greeting}
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="mb-2" />
        <DropdownMenuItem asChild>
          <Link
            href={`/profiles/${user.name}`}
            className="flex cursor-pointer gap-1"
          >
            <CircleUserIcon size={18} />
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/bookings" className="flex cursor-pointer gap-1">
            <FolderOpenIcon size={18} />
            My Bookings
          </Link>
        </DropdownMenuItem>
        {user.isVenueManager && (
          <DropdownMenuItem asChild>
            <Link href="/venues" className="flex cursor-pointer gap-1">
              <HomeIcon size={18} />
              My Venues
            </Link>
          </DropdownMenuItem>
        )}
        <Separator className="my-2" />
        <DropdownMenuItem>
          <LogOutBtn />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

function getGreetings(name: string) {
  const date = new Date();
  const hours = date.getHours();

  if (hours >= 0 && hours < 12) {
    return `🌞 Good morning, ${name} `;
  }
  if (hours >= 12 && hours < 18) {
    return `☀️ Good afternoon, ${name}`;
  }
  if (hours >= 18 && hours < 24) {
    return `🌔 Good evening, ${name}`;
  }
}
