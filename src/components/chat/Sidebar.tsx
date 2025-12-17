import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, MessageSquare, Pin, Archive, MoreHorizontal, Pencil, Trash2, ChevronDown, FileText, FileDown, Check, X } from 'lucide-react';
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
import { useToast } from '@/hooks/use-toast';

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
  const editInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const pinnedChats = chats.filter(c => c.isPinned && !c.isArchived);
  const recentChats = chats.filter(c => !c.isPinned && !c.isArchived);
  const archivedChats = chats.filter(c => c.isArchived);

  useEffect(() => {
    if (editingId && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [editingId]);

  const handleNewChat = async () => {
    await createChat();
    onClose?.();
  };

  const handleSelectChat = (id: string) => {
    if (editingId) return; // Don't select while editing
    selectChat(id);
    onClose?.();
  };

  const startEditing = (e: React.MouseEvent, id: string, title: string) => {
    e.stopPropagation();
    setEditingId(id);
    setEditTitle(title);
  };

  const saveEdit = async () => {
    if (editingId && editTitle.trim()) {
      await renameChat(editingId, editTitle.trim());
      toast({ title: 'Chat renombrado' });
    }
    setEditingId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle('');
  };

  const exportToMarkdown = (chat: typeof chats[0]) => {
    const content = chat.messages.map(m => 
      `## ${m.role === 'user' ? 'Tú' : 'Crabbio'}\n\n${m.content}\n`
    ).join('\n---\n\n');
    
    const blob = new Blob([`# ${chat.title}\n\n${content}`], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${chat.title.replace(/[^a-z0-9]/gi, '_')}.md`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: 'Exportado', description: 'Chat exportado a Markdown' });
  };

  const exportToPDF = async (chat: typeof chats[0]) => {
    const content = chat.messages.map(m => 
      `<div style="margin-bottom: 16px;">
        <strong>${m.role === 'user' ? 'Tú' : 'Crabbio'}:</strong>
        <p style="white-space: pre-wrap;">${m.content.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br>')}</p>
      </div>`
    ).join('<hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">');
    
    const html = `
      <!DOCTYPE html>
      <html lang="es">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${chat.title}</title>
          <style>
            @charset "UTF-8";
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; 
              max-width: 800px; 
              margin: 0 auto; 
              padding: 40px;
              line-height: 1.6;
            }
            h1 { color: #F44E3B; margin-bottom: 24px; }
            p { margin: 8px 0; }
            strong { color: #333; }
          </style>
        </head>
        <body>
          <h1>🦀 ${chat.title}</h1>
          ${content}
        </body>
      </html>
    `;
    
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const printWindow = window.open(url, '_blank');
    if (printWindow) {
      printWindow.onload = () => {
        setTimeout(() => printWindow.print(), 250);
      };
    }
    toast({ title: 'Exportando', description: 'Se abrirá el diálogo de impresión' });
  };

  const ChatItem = ({ chat }: { chat: typeof chats[0] }) => {
    const isEditing = editingId === chat.id;
    
    return (
      <div
        className={cn(
          'group flex items-center gap-2 px-3 py-2.5 rounded-lg cursor-pointer transition-colors',
          currentChatId === chat.id && !isEditing
            ? 'bg-sidebar-accent text-sidebar-accent-foreground' 
            : 'hover:bg-sidebar-accent/50 text-sidebar-foreground/80'
        )}
        onClick={() => handleSelectChat(chat.id)}
      >
        <MessageSquare className="w-4 h-4 shrink-0 text-sidebar-foreground/60" />
        
        {isEditing ? (
          <div className="flex-1 flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
            <input
              ref={editInputRef}
              className="flex-1 h-7 px-2 text-sm bg-sidebar-accent border border-sidebar-border rounded text-sidebar-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onKeyDown={(e) => {
                e.stopPropagation();
                if (e.key === 'Enter') saveEdit();
                if (e.key === 'Escape') cancelEdit();
              }}
              autoFocus
            />
            <Button
              variant="ghost"
              size="icon"
              className="w-6 h-6 text-green-500 hover:text-green-400 hover:bg-sidebar-accent"
              onClick={saveEdit}
            >
              <Check className="w-3.5 h-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="w-6 h-6 text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent"
              onClick={cancelEdit}
            >
              <X className="w-3.5 h-3.5" />
            </Button>
          </div>
        ) : (
          <>
            <span className="flex-1 text-sm truncate">{chat.title}</span>
            
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
                <DropdownMenuItem onClick={(e) => startEditing(e, chat.id, chat.title)}>
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
                <DropdownMenuItem onClick={() => exportToMarkdown(chat)}>
                  <FileText className="w-4 h-4 mr-2" />
                  Exportar Markdown
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => exportToPDF(chat)}>
                  <FileDown className="w-4 h-4 mr-2" />
                  Exportar PDF
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
          </>
        )}
      </div>
    );
  };

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
      <div className="p-4 border-b border-sidebar-border/50">
        <Logo className="mb-4" variant="sidebar" />
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
        
        <div className="my-2 mx-3 border-t border-sidebar-border/30" />
        
        <Section title="Recientes" chats={recentChats} isOpen={recentOpen} onToggle={() => setRecentOpen(!recentOpen)} />
        
        {archivedChats.length > 0 && (
          <>
            <div className="my-2 mx-3 border-t border-sidebar-border/30" />
            <Section title="Archivados" chats={archivedChats} isOpen={archivedOpen} onToggle={() => setArchivedOpen(!archivedOpen)} />
          </>
        )}
      </ScrollArea>
    </motion.aside>
  );
}