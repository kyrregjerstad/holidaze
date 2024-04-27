import { NewVenueForm } from './NewVenueForm';

const CreateNewVenuePage = async () => {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
      <div className="py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">
            Create New Venue
          </h1>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            Add details for your new holiday home listing.
          </p>
        </div>
        <NewVenueForm />
      </div>
    </div>
  );
};

export default CreateNewVenuePage;
