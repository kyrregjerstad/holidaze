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
import Link from 'next/link';

type Props = {
  user: CookieUser;
};

export const AccountMenu = ({ user }: Props) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarImage src={user.avatarUrl || undefined} />
          <AvatarFallback>{user.name[0]}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>{user.name}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={`/profiles/${user.name}`} className="cursor-pointer">
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/bookings" className="cursor-pointer">
            My Bookings
          </Link>
        </DropdownMenuItem>
        {user.isVenueManager && (
          <DropdownMenuItem asChild>
            <Link href="/venues" className="cursor-pointer">
              My Venues
            </Link>
          </DropdownMenuItem>
        )}
        <Separator />
        <DropdownMenuItem>
          <LogOutBtn />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
