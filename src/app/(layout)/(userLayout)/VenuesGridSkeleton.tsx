import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export const VenuesGridSkeleton = async () => {
  return (
    <div className="mt-8 grid gap-x-6 gap-y-12 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {Array.from({ length: 6 }).map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </div>
  );
};

const SkeletonCard = () => {
  return (
    <Card className="overflow-hidden">
      <CardHeader className=" p-0 pb-2">
        <Skeleton className="h-48 w-full" />
      </CardHeader>
      <CardContent className="px-4 py-2">
        <CardTitle>
          <Skeleton className="mb-2 h-8 w-1/2" />
        </CardTitle>
        <Skeleton className="mb-4 h-7 w-3/4" />
      </CardContent>
    </Card>
  );
};
