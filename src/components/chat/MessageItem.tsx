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
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className={cn(
        'flex gap-4 px-6 py-5 rounded-2xl',
        isUser ? 'bg-chat-user' : 'bg-chat-assistant'
      )}
    >
      <Avatar className="w-9 h-9 shrink-0 shadow-sm">
        <AvatarFallback className={cn(
          'text-sm font-semibold',
          isUser ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'
        )}>
          {isUser ? user?.name?.charAt(0).toUpperCase() || 'U' : '🦀'}
        </AvatarFallback>
      </Avatar>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-2">
          <span className={cn(
            'text-sm font-semibold',
            isUser ? 'text-chat-user-foreground' : 'text-chat-assistant-foreground'
          )}>
            {isUser ? 'Vos' : 'Crabbio'}
          </span>
        </div>
        
        <div className={cn(
          'prose max-w-none leading-relaxed',
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
          <div className="flex items-center gap-1 mt-4 pt-3 border-t border-border/50">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className="h-8 px-3 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 mr-1.5" /> : <Copy className="w-3.5 h-3.5 mr-1.5" />}
              {copied ? 'Copiado' : 'Copiar'}
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setFeedback('positive')}
              className={cn(
                'h-8 px-2 text-xs transition-colors',
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
                'h-8 px-2 text-xs transition-colors',
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
                className="h-8 px-3 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
                Regenerar
              </Button>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
