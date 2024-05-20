'use server';

import { createAI } from 'ai/rsc';
import { nanoid } from 'nanoid';

import { VenueFull } from '@/lib/types';
import { SystemMessage } from '@/components/chat/Messages';
import { VenueConfirmBookingCardChat } from '@/components/chat/VenueConfirmBookingCardChat';
import { submitUserMessage, userConfirmBooking } from './actions';
import { AIState, UIState } from './types';

// test data for populating the initial UI state

const test = {
  id: '60b5604c-ad99-45e7-bdf1-ef0c6c6f498f',
  name: 'Viviano italia',
  description: 'Heisannheisannheisann',
  media: [
    {
      url: 'https://images.unsplash.com/photo-1615915017883-ff58d7e33b0c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8bWlsYW5vJTIwaG91c2V8ZW58MHx8MHx8fDA%3D',
      alt: 'image of venue',
    },
  ],
  price: 200,
  maxGuests: 4,
  rating: 0,
  created: '2024-05-15T09:12:46.128Z',
  updated: '2024-05-15T09:12:46.128Z',
  meta: { wifi: false, parking: true, breakfast: false, pets: false },
  location: {
    address: 'Formerveien ',
    city: 'bergen',
    zip: null,
    country: 'norway',
    continent: null,
    lat: null,
    lng: null,
  },
  owner: {
    name: 'samsung',
    email: 'samsung@stud.noroff.no',
    bio: 'John Doe',
    avatar: {
      url: 'https://images.unsplash.com/photo-1715292779491-a32d1f086f5a?q=80&w=1931&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      alt: 'abstracqweqweqwe',
    },
    banner: {
      url: 'https://images.unsplash.com/photo-1542779283-429940ce8336?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      alt: 'pokemon image',
    },
  },
  bookings: [],
} satisfies VenueFull;

const initialUIState: {
  id: string;
  role: 'user' | 'assistant';
  display: React.ReactNode;
}[] = [
  {
    id: nanoid(),
    role: 'assistant',
    display: (
      <SystemMessage
        message={`Hi, I'm Daizy! How can i help you find your perfect holiday home?`}
        needsSep={true}
      />
    ),
  },
];

export const AIcreator = createAI<
  AIState,
  UIState,
  { submitUserMessage: typeof submitUserMessage; userConfirmBooking: typeof userConfirmBooking }
>({
  actions: {
    submitUserMessage,
    userConfirmBooking,
  },
  initialUIState,
  initialAIState: { chatId: nanoid(), messages: [] },
});

export type CreateAi = ReturnType<typeof AIcreator>;
export { AIcreator as AIProvider };
