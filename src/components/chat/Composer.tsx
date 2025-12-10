import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { Send, Paperclip, Settings2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface ComposerProps {
  onSend: (message: string) => void;
  isLoading?: boolean;
  initialValue?: string;
}

export function Composer({ onSend, isLoading, initialValue = '' }: ComposerProps) {
  const [message, setMessage] = useState(initialValue);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (initialValue) {
      setMessage(initialValue);
      textareaRef.current?.focus();
    }
  }, [initialValue]);

  const handleSubmit = () => {
    if (!message.trim() || isLoading) return;
    onSend(message.trim());
    setMessage('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = Math.min(textarea.scrollHeight, 200) + 'px';
    }
  }, [message]);

  return (
    <div className="border-t border-border bg-background/80 backdrop-blur-sm p-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-end gap-3 p-3 rounded-2xl border border-border bg-card shadow-sm focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary/50 transition-all">
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0 text-muted-foreground hover:text-foreground"
            aria-label="Adjuntar archivo"
          >
            <Paperclip className="w-5 h-5" />
          </Button>
          
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Escribí tu mensaje..."
            className="flex-1 min-h-[24px] max-h-[200px] resize-none border-0 bg-transparent p-0 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground/60"
            rows={1}
            disabled={isLoading}
          />
          
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0 text-muted-foreground hover:text-foreground"
            aria-label="Configuración"
          >
            <Settings2 className="w-5 h-5" />
          </Button>
          
          <Button
            onClick={handleSubmit}
            disabled={!message.trim() || isLoading}
            size="icon"
            className={cn(
              'shrink-0 rounded-xl transition-all',
              message.trim() 
                ? 'bg-primary hover:bg-crab-orange-hover text-primary-foreground shadow-glow' 
                : 'bg-muted text-muted-foreground'
            )}
            aria-label="Enviar mensaje"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
        
        <p className="text-xs text-center text-muted-foreground mt-3">
          Crabbio puede cometer errores. Verificá la información importante.
        </p>
      </div>
    </div>
  );
}
