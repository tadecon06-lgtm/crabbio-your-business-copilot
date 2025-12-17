import { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, ThumbsUp, ThumbsDown, RefreshCw, Check } from 'lucide-react';
import { Message } from '@/types/chat';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

interface MessageItemProps {
  message: Message;
  isStreaming?: boolean;
  onRegenerate?: () => void;
  fontSize?: 'small' | 'medium' | 'large';
}

export function MessageItem({ message, isStreaming, onRegenerate, fontSize = 'medium' }: MessageItemProps) {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState<'positive' | 'negative' | null>(message.feedback || null);
  const isUser = message.role === 'user';

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'flex gap-4 p-4 rounded-2xl',
        isUser ? 'bg-chat-user' : 'bg-chat-assistant'
      )}
    >
      <Avatar className="w-8 h-8 shrink-0">
        <AvatarFallback className={cn(
          'text-xs font-semibold',
          isUser ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'
        )}>
          {isUser ? user?.name?.charAt(0).toUpperCase() || 'U' : '🦀'}
        </AvatarFallback>
      </Avatar>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className={cn(
            'text-sm font-semibold',
            isUser ? 'text-chat-user-foreground' : 'text-chat-assistant-foreground'
          )}>
            {isUser ? 'Vos' : 'Crabbio'}
          </span>
        </div>
        
        <div className={cn(
          'prose max-w-none',
          isUser ? 'text-chat-user-foreground' : 'text-chat-assistant-foreground',
          'prose-p:my-2 prose-ul:my-2 prose-ol:my-2 prose-li:my-0.5',
          fontSize === 'small' && 'text-sm',
          fontSize === 'medium' && 'text-base',
          fontSize === 'large' && 'text-lg'
        )}>
          <p className="whitespace-pre-wrap">{message.content}</p>
          {isStreaming && (
            <span className="inline-flex gap-1 ml-1">
              <span className="w-2 h-2 bg-primary rounded-full animate-typing" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 bg-primary rounded-full animate-typing" style={{ animationDelay: '200ms' }} />
              <span className="w-2 h-2 bg-primary rounded-full animate-typing" style={{ animationDelay: '400ms' }} />
            </span>
          )}
        </div>
        
        {!isUser && !isStreaming && (
          <div className="flex items-center gap-1 mt-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
            >
              {copied ? <Check className="w-3.5 h-3.5 mr-1" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
              {copied ? 'Copiado' : 'Copiar'}
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setFeedback('positive')}
              className={cn(
                'h-7 px-2 text-xs',
                feedback === 'positive' ? 'text-green-500' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <ThumbsUp className="w-3.5 h-3.5" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setFeedback('negative')}
              className={cn(
                'h-7 px-2 text-xs',
                feedback === 'negative' ? 'text-red-500' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <ThumbsDown className="w-3.5 h-3.5" />
            </Button>
            
            {onRegenerate && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onRegenerate}
                className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
              >
                <RefreshCw className="w-3.5 h-3.5 mr-1" />
                Regenerar
              </Button>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
