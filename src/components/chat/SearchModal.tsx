import { useState, useEffect, useRef } from 'react';
import { Search, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useChat } from '@/contexts/ChatContext';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

interface SearchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SearchModal({ open, onOpenChange }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const { chats, selectChat } = useChat();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setQuery('');
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  const filteredChats = query.trim()
    ? chats.filter(chat => 
        chat.title.toLowerCase().includes(query.toLowerCase()) ||
        chat.messages.some(m => m.content.toLowerCase().includes(query.toLowerCase()))
      )
    : chats.slice(0, 10);

  const handleSelect = (chatId: string) => {
    selectChat(chatId);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg p-0 gap-0">
        <div className="flex items-center gap-3 p-4 border-b border-border">
          <Search className="w-5 h-5 text-muted-foreground" />
          <Input
            ref={inputRef}
            placeholder="Buscar conversaciones..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="border-0 p-0 h-auto text-base focus-visible:ring-0 bg-transparent"
          />
          <kbd className="px-2 py-1 text-xs font-mono bg-muted rounded border border-border">
            Esc
          </kbd>
        </div>
        
        <div className="max-h-80 overflow-y-auto">
          <AnimatePresence mode="popLayout">
            {filteredChats.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                No se encontraron conversaciones
              </div>
            ) : (
              filteredChats.map((chat, index) => (
                <motion.button
                  key={chat.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ delay: index * 0.02 }}
                  onClick={() => handleSelect(chat.id)}
                  className={cn(
                    'w-full flex items-center gap-3 px-4 py-3 text-left',
                    'hover:bg-accent transition-colors',
                    'border-b border-border/50 last:border-0'
                  )}
                >
                  <MessageSquare className="w-4 h-4 text-muted-foreground shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{chat.title}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {chat.messages.length} mensajes
                    </p>
                  </div>
                </motion.button>
              ))
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}
