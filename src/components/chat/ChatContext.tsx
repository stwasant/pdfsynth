import { trpc } from '@/src/app/_trpc/client';
import { useMutation } from '@tanstack/react-query';
import React, { ReactNode, createContext, useRef, useState } from 'react';
import { useToast } from '../ui/use-toast';
import { add } from 'date-fns';

type StreamResponse = {
  addMessage: () => void;
  message: string;
  handleInputChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  isLoading: boolean;
};

export const ChatContext = createContext<StreamResponse>({
  addMessage: () => {},
  message: '',
  handleInputChange: () => {},
  isLoading: false,
});

interface ChatContextProviderProps {
  fileId: string;
  children: ReactNode;
}

export const ChatContextProvider: React.FC<ChatContextProviderProps> = ({ fileId, children }) => {
  const [message, setMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const utils = trpc.useUtils();

  const { toast } = useToast();

  const backupMessage = useRef<string>('');

  const { mutate: sendMessage } = useMutation({
    mutationFn: async ({ message }: { message: string }) => {
      const response = await fetch('/api/message', {
        method: 'POST',
        body: JSON.stringify({
          fileId,
          message,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      return response.body;
    },
  });

  const addMessage = () => sendMessage({ message });
  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(event.target.value);
  }

  return (
    <ChatContext.Provider
      value={{
        addMessage,
        message,
        handleInputChange,
        isLoading,
      }} >
      {children}
    </ChatContext.Provider>
  )
};
