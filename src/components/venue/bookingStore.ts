import { addDays, areIntervalsOverlapping, differenceInDays } from 'date-fns';
import { create } from 'zustand';

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

  setStartDate: (date, bookedDates) => {
    set({ startDate: date });
    const { endDate } = get();
    if (endDate && date && differenceInDays(endDate, date) < 1) {
      set({ endDate: addDays(date, 1) });
    }
    const available = checkAvailability(date, endDate, bookedDates);
    set({ areDatesAvailable: available });
  },

  setEndDate: (date, bookedDates) => {
    const { startDate } = get();
    if (startDate && date && differenceInDays(date, startDate) < 1) {
      return;
    }
    set({ endDate: date });
    const available = checkAvailability(startDate, date, bookedDates);
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

function checkAvailability(startDate?: Date, endDate?: Date, bookedDates: Date[] = []): boolean {
  return !(
    startDate &&
    endDate &&
    bookedDates.some((date) =>
      areIntervalsOverlapping({ start: startDate, end: endDate }, { start: date, end: date })
    )
  );
}
