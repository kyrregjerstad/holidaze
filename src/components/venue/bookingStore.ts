import { addDays, differenceInDays } from 'date-fns';
import { create } from 'zustand';

import { checkAvailability } from '@/lib/utils';

type FormState = {
  startDate: Date | undefined;
  endDate: Date | undefined;
  guests: number;
  amountOfDays: number;
  areDatesAvailable: boolean;
  setStartDate: (date: Date | undefined, bookedDates: Date[]) => void;
  setEndDate: (date: Date | undefined, bookedDates: Date[]) => void;
  setGuests: (guests: number) => void;
  calculateTotalDays: () => void;
};

export const useBookingStore = create<FormState>((set, get) => ({
  startDate: undefined,
  endDate: undefined,
  guests: 2,
  amountOfDays: 1,
  areDatesAvailable: true,

  setStartDate: (startDate, bookedDates) => {
    set({ startDate });
    const { endDate } = get();
    if (endDate && startDate && differenceInDays(endDate, startDate) < 1) {
      set({ endDate: addDays(startDate, 1) });
    }
    const available = checkAvailability(startDate, endDate, bookedDates);
    set({ areDatesAvailable: available });
  },

  setEndDate: (endDate, bookedDates) => {
    const { startDate } = get();
    if (startDate && endDate && differenceInDays(endDate, startDate) < 1) {
      return;
    }
    set({ endDate });
    const available = checkAvailability(startDate, endDate, bookedDates);
    set({ areDatesAvailable: available });
  },

  setGuests: (guests) => set({ guests }),
  calculateTotalDays: () => {
    const { startDate, endDate } = get();
    if (startDate && endDate) {
      set({ amountOfDays: differenceInDays(endDate, startDate) });
    }
  },
}));
