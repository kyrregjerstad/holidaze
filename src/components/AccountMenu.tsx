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
  const greeting = getGreetings();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarImage src={user.avatarUrl || undefined} />
          <AvatarFallback>{user.name[0]}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="flex max-w-[200px] flex-col gap-1 p-4 sm:p-2"
      >
        <DropdownMenuLabel className="flex max-w-64 flex-col items-end justify-end text-pretty break-all">
          {greeting}
          <div>{user.name}</div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="mb-2" />
        <DropdownMenuItem asChild>
          <Link
            href={`/profiles/${user.name}`}
            className="flex cursor-pointer justify-end gap-1"
          >
            Profile
            <CircleUserIcon size={18} />
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link
            href="/manage/bookings"
            className="flex cursor-pointer justify-end gap-1"
          >
            My Bookings
            <FolderOpenIcon size={18} />
          </Link>
        </DropdownMenuItem>
        {user.isVenueManager && (
          <DropdownMenuItem asChild>
            <Link
              href="/manage/venues"
              className="flex cursor-pointer justify-end gap-1"
            >
              My Venues
              <HomeIcon size={18} />
            </Link>
          </DropdownMenuItem>
        )}
        <Separator className="my-2" />
        <DropdownMenuItem asChild>
          <LogOutBtn />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

function getGreetings() {
  const date = new Date();
  const hours = date.getHours();

  if (hours >= 0 && hours < 12) {
    return `Good morning,`;
  }
  if (hours >= 12 && hours < 18) {
    return `Good afternoon,`;
  }
  if (hours >= 18 && hours < 24) {
    return `Good evening,`;
  }
}
