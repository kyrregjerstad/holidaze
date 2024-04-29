import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export const VenuesGridSkeleton = async () => {
  return (
    <div className="mt-8 grid w-full gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </div>
  );
};

const SkeletonCard = () => {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-48 w-full" />
      </CardHeader>
      <CardContent>
        <CardTitle>
          <Skeleton className="mb-2 h-8 w-1/2" />
        </CardTitle>
        <Skeleton className="mb-4 h-7 w-3/4" />
      </CardContent>
    </Card>
  );
};
