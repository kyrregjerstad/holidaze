import { CalendarIcon, HomeIcon, NotepadTextIcon, Undo } from 'lucide-react';

export const paths = [
  { path: '/', Icon: Undo, label: 'Home' },
  { path: '/manage/venues', Icon: HomeIcon, label: 'Venues' },
  { path: '/manage/bookings', Icon: CalendarIcon, label: 'Bookings' },
  { path: '/manage/reports', Icon: NotepadTextIcon, label: 'Reports' },
];
