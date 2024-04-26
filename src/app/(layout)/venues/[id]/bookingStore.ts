import { addDays, areIntervalsOverlapping, differenceInDays } from 'date-fns';
import { create } from 'zustand';

type FormState = {
  startDate: Date | undefined;
  endDate: Date | undefined;
  guests: number;
  amountOfDays: number;
  areDatesAvailable: boolean;
  setStartDate: (date: Date | undefined) => void;
  setEndDate: (date: Date | undefined) => void;
  setGuests: (guests: number) => void;
  checkAvailability: (bookedDates: Date[]) => void;
  calculateDays: () => void;
};

export const useBookingStore = create<FormState>((set, get) => ({
  startDate: undefined,
  endDate: undefined,
  guests: 2,
  amountOfDays: 1,
  areDatesAvailable: true,
  setStartDate: (date) => {
    set({ startDate: date });
    const { endDate } = get();
    if (endDate && date && differenceInDays(endDate, date) < 1) {
      set({ endDate: addDays(date, 1) });
    }
  },
  setEndDate: (date) => {
    const { startDate } = get();
    if (startDate && date && differenceInDays(date, startDate) < 1) {
      return;
    }
    set({ endDate: date });
    get().calculateDays();
  },
  setGuests: (guests) => set({ guests }),
  calculateDays: () => {
    const { startDate, endDate } = get();
    if (startDate && endDate) {
      set({ amountOfDays: differenceInDays(endDate, startDate) });
    }
  },
  checkAvailability: (bookedDates) => {
    const { startDate, endDate } = get();
    set({
      areDatesAvailable: !(
        startDate &&
        endDate &&
        bookedDates.some((date) =>
          areIntervalsOverlapping(
            { start: startDate, end: endDate },
            { start: date, end: date }
          )
        )
      ),
    });
  },
}));
