'use client';

import { useRouter } from 'next/navigation';

import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogFooter,
} from '@/components/ui/alert-dialog';
import { useToast } from './ui/use-toast';

export const DeleteDialogActions = ({ deleteVenue }: { deleteVenue: () => Promise<boolean> }) => {
  const { toast } = useToast();
  const router = useRouter();
  const handleDelete = async () => {
    const success = await deleteVenue();
    if (success) {
      toast({
        title: 'Venue deleted',
        description: 'Your venue has been successfully deleted',
      });
      router.push('/manage/venues');
    } else {
      toast({
        title: 'Failed to delete venue',
        description: 'An error occurred while deleting your venue',
        variant: 'error',
      });
    }
  };
  return (
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
    </AlertDialogFooter>
  );
};
