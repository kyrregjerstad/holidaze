import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CardContent, Card } from '@/components/ui/card';
import { HomeIcon } from 'lucide-react';
import { fetchAllVenues } from '@/lib/services/venuesService';

export default async function HomePage() {
  const { venues, error } = await fetchAllVenues();

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex h-14 items-center px-4 lg:px-6">
        <Link className="flex items-center justify-center" href="#">
          <HomeIcon className="h-6 w-6" />
          <span className="sr-only">Holidaze</span>
        </Link>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Holidaze
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 dark:text-gray-400 md:text-xl">
                  Your Gateway to Unforgettable Getaways
                </p>
              </div>
              <div className="w-full max-w-md">
                <Input className="mb-2" placeholder="Search location" />
                <div className="flex gap-2">
                  <Input placeholder="Start date" type="date" />
                  <Input placeholder="End date" type="date" />
                </div>
                <Button className="mt-4 w-full">Search</Button>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Featured Homes
            </h2>
            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {venues.map((venue) => (
                <Card>
                  <CardContent>
                    <img
                      alt={`Holidaze featured Home: ${venue.name} - ${venue.description}`}
                      className="h-48 w-full object-cover"
                      height="200"
                      src={venue.media.at(0)?.url || '/placeholder.jpg'}
                      style={{
                        aspectRatio: '300/200',
                        objectFit: 'cover',
                      }}
                      width="300"
                    />
                    <h3 className="mt-4 text-xl font-semibold">{venue.name}</h3>
                    <p className="mt-2 text-gray-500">
                      {venue.description || 'No description available'}
                    </p>
                    <Link
                      className="mt-4 inline-flex items-center font-semibold text-indigo-600 hover:text-indigo-500"
                      href={`/venues/${venue.id}`}
                    >
                      View Details
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <footer className="flex w-full shrink-0 flex-col items-center gap-2 border-t px-4 py-6 sm:flex-row md:px-6">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          © 2024 Holidaze. All rights reserved.
        </p>
        <nav className="flex gap-4 sm:ml-auto sm:gap-6">
          <Link className="text-xs underline-offset-4 hover:underline" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs underline-offset-4 hover:underline" href="#">
            Privacy
          </Link>
          <Link className="text-xs underline-offset-4 hover:underline" href="#">
            Contact
          </Link>
        </nav>
      </footer>
    </div>
  );
}
