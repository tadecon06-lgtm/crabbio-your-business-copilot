import { useState, useCallback, useRef } from 'react';
import { useChat } from '@/contexts/ChatContext';
import { useAuth } from '@/contexts/AuthContext';
import { EmptyState } from './EmptyState';
import { MessageList } from './MessageList';
import { Composer } from './Composer';
import { Attachment } from '@/types/chat';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export function ChatPanel() {
  const { currentChat, currentChatId, createChat, addMessage } = useChat();
  const { session } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const [suggestionText, setSuggestionText] = useState('');
  const abortControllerRef = useRef<AbortController | null>(null);

  const streamAIResponse = async (chatId: string, messages: { role: string; content: string }[]) => {
    setIsLoading(true);
    setStreamingContent('');
    
    abortControllerRef.current = new AbortController();
    
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session?.access_token}`,
          },
          body: JSON.stringify({ messages, chatId }),
          signal: abortControllerRef.current.signal,
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (response.status === 429) {
          toast({ title: 'Límite alcanzado', description: 'Esperá un momento antes de enviar otro mensaje', variant: 'destructive' });
        } else if (response.status === 402) {
          toast({ title: 'Créditos agotados', description: 'Agregá créditos para seguir usando Crabbio', variant: 'destructive' });
        } else {
          toast({ title: 'Error', description: errorData.error || 'Error al procesar tu mensaje', variant: 'destructive' });
        }
        setIsLoading(false);
        return;
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No reader available');

      const decoder = new TextDecoder();
      let textBuffer = '';
      let fullContent = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        textBuffer += decoder.decode(value, { stream: true });
        
        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf('\n')) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);
          
          if (line.endsWith('\r')) line = line.slice(0, -1);
          if (line.startsWith(':') || line.trim() === '') continue;
          if (!line.startsWith('data: ')) continue;
          
          const jsonStr = line.slice(6).trim();
          if (jsonStr === '[DONE]') break;
          
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              fullContent += content;
              setStreamingContent(fullContent);
            }
          } catch {
            // Partial JSON, wait for more data
            textBuffer = line + '\n' + textBuffer;
            break;
          }
        }
      }

      if (fullContent) {
        await addMessage(chatId, { role: 'assistant', content: fullContent });
      }
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        console.error('Streaming error:', error);
        toast({ title: 'Error', description: 'Error al conectar con Crabbio', variant: 'destructive' });
      }
    } finally {
      setStreamingContent('');
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  const handleSend = useCallback(async (message: string, attachments?: Attachment[]) => {
    let chatId = currentChatId;
    
    if (!chatId) {
      chatId = await createChat();
    }
    
    await addMessage(chatId, { role: 'user', content: message, attachments });
    setSuggestionText('');
    
    // Build messages array for AI context
    const currentMessages = currentChat?.messages || [];
    const aiMessages = [
      ...currentMessages.map(m => ({ role: m.role, content: m.content })),
      { role: 'user', content: message }
    ];
    
    await streamAIResponse(chatId, aiMessages);
  }, [currentChatId, currentChat, createChat, addMessage, session]);

  const handleSuggestionClick = (text: string) => {
    setSuggestionText(text);
  };

  const hasMessages = currentChat && currentChat.messages.length > 0;

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {hasMessages ? (
        <MessageList 
          messages={currentChat.messages}
          isStreaming={isLoading}
          streamingContent={streamingContent}
        />
      ) : (
        <EmptyState onSuggestionClick={handleSuggestionClick} />
      )}
      
      <Composer 
        onSend={handleSend} 
        isLoading={isLoading}
        initialValue={suggestionText}
      />
    </div>
  );
}
