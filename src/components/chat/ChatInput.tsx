import React from 'react'
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { Send } from 'lucide-react';
interface ChatInputProps {
    isDisable?: boolean;
}
const ChatInput: React.FC<ChatInputProps> = ({ isDisable }) => {
  return (
    <div className='absolute bottom-0 left-0 w-full'>
        <div className='mx-2 flex flex-row gap-3 md:mx-4 md:last:mb-6 lg:mx-auto lg:max-w-2xl xl:max-w-3xl'>
            <div className='relative flex flex-col w-full flex-grow p-4'>
                <div className='relative'>
                    <Textarea 
                    placeholder='Enter your question...'
                    className='resize-none pr-12 text-base py-3 scrollbar-thumb-blue scrollbar-thumb-rounded - scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch'
                    rows={1}
                    maxRows={4}
                    autoFocus
                    />
                    <Button className='absolute bottom-1.5 right-[8px]' aria-label='send message'>
                        <Send className='w-4 h-4'/>
                    </Button>
                </div>
            </div>
        </div>
    </div>
  )
}

export default ChatInput