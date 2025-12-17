import { useRef, useEffect } from 'react';
import { Message } from '@/types/chat';
import { MessageItem } from './MessageItem';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/contexts/AuthContext';

interface MessageListProps {
  messages: Message[];
  isStreaming?: boolean;
  streamingContent?: string;
}

export function MessageList({ messages, isStreaming, streamingContent }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const fontSize = (user?.fontSize as 'small' | 'medium' | 'large') || 'medium';

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingContent]);

  return (
    <ScrollArea className="flex-1 px-4 py-6">
      <div className="max-w-3xl mx-auto space-y-4">
        {messages.map((message, index) => (
          <MessageItem 
            key={message.id} 
            message={message}
            fontSize={fontSize}
            onRegenerate={
              message.role === 'assistant' && index === messages.length - 1 
                ? () => {} 
                : undefined
            }
          />
        ))}
        
        {isStreaming && streamingContent && (
          <MessageItem
            message={{
              id: 'streaming',
              role: 'assistant',
              content: streamingContent,
              timestamp: new Date(),
            }}
            isStreaming
            fontSize={fontSize}
          />
        )}
        
        <div ref={bottomRef} />
      </div>
    </ScrollArea>
  );
}
