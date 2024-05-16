'use client';

import { useState } from 'react';

import { useActions, useUIState } from 'ai/rsc';
import { BotMessageSquareIcon, ChevronDownIcon } from 'lucide-react';
import { nanoid } from 'nanoid';

import { useScrollAnchor } from '@/lib/hooks/useScrollAnchor';
import { chatService } from '@/lib/services';
import { Button } from '../ui/button';
import { Card, CardHeader } from '../ui/card';
import { Input } from '../ui/input';
import { UserMessage } from './Messages';

export function Chat() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-0 left-0 m-4 drop-shadow-sm z-50 bg-sky-600 hover:bg-sky-500"
      >
        <BotMessageSquareIcon />
        <span className="sr-only">Toggle Chat</span>
      </Button>
      {isOpen && <ChatWindow setIsOpen={setIsOpen} />}
    </>
  );
}

const ChatWindow = ({ setIsOpen }: { setIsOpen: (isOpen: boolean) => void }) => {
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { submitUserMessage } = useActions<typeof chatService.create>();

  const [messages, setMessages] = useUIState<typeof chatService.create>();
  const [previousMessage, setPreviousMessage] = useState<string | null>(null);

  const { messagesRef, scrollRef, visibilityRef, isAtBottom, scrollToBottom } = useScrollAnchor();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setMessages((currentMessages) => [
      ...currentMessages,
      {
        id: nanoid(),
        role: 'user',
        display: <UserMessage message={inputValue} />,
      },
    ]);
    const responseMessage = await submitUserMessage(inputValue);

    setMessages((currentMessages) => [...currentMessages, responseMessage]);

    setPreviousMessage(inputValue);
    setInputValue('');
    setIsLoading(false);
    scrollToBottom();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp' && previousMessage) {
      setInputValue(previousMessage);
    }
  };

  return (
    <>
      <Card className="fixed w-[28rem] bottom-0 left-0 m-4 p-0 bg-white drop-shadow-sm border z-50 h-[600px] rounded-lg overflow-hidden">
        <CardHeader className="p-0 border-b">
          <div className="flex justify-between items-center py-2 px-2">
            <h2 className="text-sm font-bold ">Daizy Chat</h2>
            <Button
              variant="ghost"
              size="sm"
              className="p-0 aspect-square"
              onClick={() => setIsOpen(false)}
            >
              <ChevronDownIcon />
            </Button>
          </div>
        </CardHeader>
        <div className="overflow-y-auto h-[475px]" ref={scrollRef}>
          <div className="pb-10 px-4 flex flex-col gap-4" ref={messagesRef}>
            {messages.map((message) => (
              <div key={message.id} className="flex flex-col">
                <>{message.display}</>
              </div>
            ))}
          </div>
          <div className="w-full h-px" ref={visibilityRef} />
        </div>
        {isLoading && <div>Loading...</div>}
        <ChatInput
          onSubmit={handleSubmit}
          isLoading={isLoading}
          inputValue={inputValue}
          setInputValue={setInputValue}
          handleKeyDown={handleKeyDown}
        />
      </Card>
    </>
  );
};

type ChatInputProps = {
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  inputValue: string;
  setInputValue: (inputValue: string) => void;
  handleKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
};

const ChatInput = ({
  onSubmit,
  isLoading,
  inputValue,
  setInputValue,
  handleKeyDown,
}: ChatInputProps) => {
  return (
    <form
      className="left-0 right-0 fixed bottom-0 bg-background p-4 border-t shadow-md"
      onSubmit={onSubmit}
    >
      <div className="flex gap-2">
        <Input
          disabled={isLoading}
          value={inputValue}
          placeholder="Write something..."
          onChange={(e) => setInputValue(e.target.value)}
          className="w-full border"
          onKeyDown={handleKeyDown}
        />
        <Button type="submit" disabled={inputValue.length < 1 || isLoading}>
          {isLoading ? 'Loading...' : 'Send'}
        </Button>
      </div>
    </form>
  );
};
