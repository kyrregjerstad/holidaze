import { venueService } from '@/lib/services';
import { Debug } from '@/components/Debug';

const Page = async () => {
  const { venues } = await venueService.search({
    price: { min: 100, max: 20000 },
    sort: { field: 'price', order: 'asc' },
  });
  return (
    <div>
      <p>got a total of {venues.length} venues</p>
      <Debug data={venues} />
    </div>
  );
};

export default Page;
