import { SearchOptions } from '@/lib/services/venueService/searchOptionsSchema';
import { buttonVariants } from '@/components/ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { SearchCard } from './SearchCard';

export const SearchDrawer = ({ prefilledSearch }: { prefilledSearch?: Partial<SearchOptions> }) => {
  return (
    <Drawer>
      <DrawerTrigger
        className={buttonVariants({
          className: 'fixed bottom-4 left-1/2 z-20 -translate-x-1/2 drop-shadow sm:hidden',
        })}
      >
        Search and filter
      </DrawerTrigger>
      <DrawerContent className="mx-2">
        <DrawerHeader>
          <DrawerTitle>Search and filter</DrawerTitle>
          <SearchCard prefilledSearch={prefilledSearch} />
        </DrawerHeader>
      </DrawerContent>
    </Drawer>
  );
};
