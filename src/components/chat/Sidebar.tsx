import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, MessageSquare, Pin, Archive, MoreHorizontal, Pencil, Trash2, ChevronDown } from 'lucide-react';
import { useChat } from '@/contexts/ChatContext';
import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

interface SidebarProps {
  isOpen: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { chats, currentChatId, createChat, selectChat, deleteChat, togglePinChat, archiveChat, renameChat } = useChat();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [pinnedOpen, setPinnedOpen] = useState(true);
  const [recentOpen, setRecentOpen] = useState(true);
  const [archivedOpen, setArchivedOpen] = useState(false);

  const pinnedChats = chats.filter(c => c.isPinned && !c.isArchived);
  const recentChats = chats.filter(c => !c.isPinned && !c.isArchived);
  const archivedChats = chats.filter(c => c.isArchived);

  const handleNewChat = () => {
    createChat();
    onClose?.();
  };

  const handleSelectChat = (id: string) => {
    selectChat(id);
    onClose?.();
  };

  const startEditing = (id: string, title: string) => {
    setEditingId(id);
    setEditTitle(title);
  };

  const saveEdit = (id: string) => {
    if (editTitle.trim()) {
      renameChat(id, editTitle.trim());
    }
    setEditingId(null);
  };

  const ChatItem = ({ chat }: { chat: typeof chats[0] }) => (
    <motion.div
      layout
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -10 }}
      className={cn(
        'group flex items-center gap-2 px-3 py-2.5 rounded-lg cursor-pointer transition-colors',
        currentChatId === chat.id 
          ? 'bg-sidebar-accent text-sidebar-accent-foreground' 
          : 'hover:bg-sidebar-accent/50 text-sidebar-foreground/80'
      )}
      onClick={() => handleSelectChat(chat.id)}
    >
      <MessageSquare className="w-4 h-4 shrink-0 text-sidebar-foreground/60" />
      
      {editingId === chat.id ? (
        <input
          autoFocus
          className="flex-1 bg-transparent border-none outline-none text-sm"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          onBlur={() => saveEdit(chat.id)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') saveEdit(chat.id);
            if (e.key === 'Escape') setEditingId(null);
          }}
          onClick={(e) => e.stopPropagation()}
        />
      ) : (
        <span className="flex-1 text-sm truncate">{chat.title}</span>
      )}
      
      {chat.isPinned && <Pin className="w-3 h-3 text-primary" />}
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
          <Button 
            variant="ghost" 
            size="icon" 
            className="w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent"
          >
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={() => startEditing(chat.id, chat.title)}>
            <Pencil className="w-4 h-4 mr-2" />
            Renombrar
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => togglePinChat(chat.id)}>
            <Pin className="w-4 h-4 mr-2" />
            {chat.isPinned ? 'Desfijar' : 'Fijar'}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => archiveChat(chat.id)}>
            <Archive className="w-4 h-4 mr-2" />
            {chat.isArchived ? 'Desarchivar' : 'Archivar'}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            className="text-destructive focus:text-destructive"
            onClick={() => deleteChat(chat.id)}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Eliminar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </motion.div>
  );

  const Section = ({ 
    title, 
    chats, 
    isOpen, 
    onToggle 
  }: { 
    title: string; 
    chats: typeof pinnedChats; 
    isOpen: boolean; 
    onToggle: () => void;
  }) => (
    <Collapsible open={isOpen} onOpenChange={onToggle}>
      <CollapsibleTrigger className="flex items-center gap-2 w-full px-3 py-2 text-xs font-semibold text-sidebar-foreground/50 uppercase tracking-wider hover:text-sidebar-foreground/70 transition-colors">
        <ChevronDown className={cn('w-3 h-3 transition-transform', !isOpen && '-rotate-90')} />
        {title}
        <span className="ml-auto text-sidebar-foreground/30">{chats.length}</span>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <AnimatePresence>
          {chats.map(chat => <ChatItem key={chat.id} chat={chat} />)}
        </AnimatePresence>
      </CollapsibleContent>
    </Collapsible>
  );

  return (
    <motion.aside
      initial={false}
      animate={{ 
        width: isOpen ? 280 : 0,
        opacity: isOpen ? 1 : 0,
      }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
      className={cn(
        'h-screen bg-sidebar border-r border-sidebar-border flex flex-col overflow-hidden',
        'fixed lg:relative z-40'
      )}
    >
      <div className="p-4 border-b border-sidebar-border">
        <Logo className="mb-4" />
        <Button 
          onClick={handleNewChat}
          className="w-full justify-start gap-2 bg-primary hover:bg-crab-orange-hover text-primary-foreground"
        >
          <Plus className="w-4 h-4" />
          Nuevo chat
        </Button>
      </div>
      
      <ScrollArea className="flex-1 px-2 py-2">
        {pinnedChats.length > 0 && (
          <Section title="Fijados" chats={pinnedChats} isOpen={pinnedOpen} onToggle={() => setPinnedOpen(!pinnedOpen)} />
        )}
        
        <Section title="Recientes" chats={recentChats} isOpen={recentOpen} onToggle={() => setRecentOpen(!recentOpen)} />
        
        {archivedChats.length > 0 && (
          <Section title="Archivados" chats={archivedChats} isOpen={archivedOpen} onToggle={() => setArchivedOpen(!archivedOpen)} />
        )}
      </ScrollArea>
      
      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center justify-between text-xs text-sidebar-foreground/50">
          <span>Plan gratuito</span>
          <span>0 / 50 mensajes</span>
        </div>
        <div className="mt-2 h-1.5 bg-sidebar-accent rounded-full overflow-hidden">
          <div className="h-full w-0 bg-primary rounded-full" />
        </div>
      </div>
    </motion.aside>
  );
}
