import React, { useContext, useRef } from 'react'
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { Send } from 'lucide-react';
import { Chat } from 'openai/resources/index.mjs';
import { ChatContext } from './ChatContext';
import { add } from 'date-fns';
interface ChatInputProps {
    isDisabled?: boolean;
}
const ChatInput: React.FC<ChatInputProps> = ({ isDisabled }) => {
  
  const { addMessage, handleInputChange, isLoading, message } = useContext(ChatContext);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

    return (
    <div className='absolute bottom-0 left-0 w-full'>
        <div className='mx-2 flex flex-row gap-3 md:mx-4 md:last:mb-6 lg:mx-auto lg:max-w-2xl xl:max-w-3xl'>
            <div className='relative flex flex-col w-full flex-grow p-4'>
                <div className='relative'>
                    <Textarea 
                    placeholder='Enter your question...'
                    ref={textareaRef}
                    className={`resize-none pr-12 text-base py-3 scrollbar-thumb-blue scrollbar-thumb-rounded - scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch ${isLoading && isDisabled ? 'opacity-50' : ''}`}
                    rows={1}
                    maxRows={4}
                    autoFocus
                    onChange={handleInputChange}
                    value={message}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            addMessage();
                            textareaRef.current?.focus();
                        }
                    }}
                    disabled={isLoading || isDisabled}
                    />
                    <Button 
                    className='absolute bottom-1.5 right-[8px]' 
                    aria-label='send message'
                    disabled={ isLoading || isDisabled }
                    type='submit'
                    onClick={() => {
                        addMessage();

                        textareaRef.current?.focus();
                    }}
                    >
                        <Send className='w-4 h-4'/>
                    </Button>
                </div>
            </div>
        </div>
    </div>
  )
}

export default ChatInput