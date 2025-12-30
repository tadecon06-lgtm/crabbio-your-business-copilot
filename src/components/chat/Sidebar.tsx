import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, MessageSquare, Pin, MoreHorizontal, Pencil, Trash2, ChevronDown, FileText, FileDown, Check, X, FolderPlus, Folder, FolderOpen, MoveRight, Search } from 'lucide-react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { useChat } from '@/contexts/ChatContext';
import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from '@/components/ui/dropdown-menu';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';

interface SidebarProps {
  isOpen: boolean;
  onClose?: () => void;
}

const EMOJI_OPTIONS = ['📁', '💼', '🚀', '💡', '🎯', '📊', '🛠️', '🌟', '🔥', '📝'];

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { 
    chats, projects, currentChatId, selectedProjectId,
    createChat, selectChat, deleteChat, togglePinChat, renameChat,
    setSelectedProjectId, moveToProject, createProject, deleteProject
  } = useChat();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [projectsOpen, setProjectsOpen] = useState(true);
  const [newProjectDialog, setNewProjectDialog] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectEmoji, setNewProjectEmoji] = useState('📁');
  const [pendingMoveChat, setPendingMoveChat] = useState<string | null>(null);
  const [deleteConfirmChat, setDeleteConfirmChat] = useState<string | null>(null);
  const editInputRef = useRef<HTMLInputElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Filter chats based on selected project and search
  const filteredChats = chats
    .filter(c => {
      // Filter by project
      if (selectedProjectId && c.projectId !== selectedProjectId) return false;
      // Filter out archived
      if (c.isArchived) return false;
      // Filter by search
      if (searchQuery && !c.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });

  // Sort: pinned first, then by date
  const sortedChats = [...filteredChats].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime();
  });

  useEffect(() => {
    if (editingId && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [editingId]);

  useEffect(() => {
    if (searchModalOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  }, [searchModalOpen]);

  const handleNewChat = async () => {
    await createChat();
    onClose?.();
  };

  const handleSelectChat = (id: string) => {
    if (editingId) return;
    selectChat(id);
    onClose?.();
  };

  const startEditing = (e: React.MouseEvent, id: string, title: string) => {
    e.stopPropagation();
    e.preventDefault();
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

  const handleTogglePin = async (e: React.MouseEvent, chatId: string) => {
    e.stopPropagation();
    e.preventDefault();
    await togglePinChat(chatId);
    toast({ title: 'Chat actualizado' });
  };

  const handleMoveToProject = async (chatId: string, projectId: string | null) => {
    await moveToProject(chatId, projectId);
    toast({ title: projectId ? 'Chat movido al proyecto' : 'Chat removido del proyecto' });
  };

  const handleDeleteChat = async () => {
    if (deleteConfirmChat) {
      await deleteChat(deleteConfirmChat);
      toast({ title: 'Chat eliminado' });
      setDeleteConfirmChat(null);
    }
  };

  const handleCreateProject = async () => {
    if (!newProjectName.trim()) return;
    const projectId = await createProject(newProjectName.trim(), newProjectEmoji);
    toast({ title: 'Proyecto creado' });
    setNewProjectDialog(false);
    setNewProjectName('');
    setNewProjectEmoji('📁');
    
    // If we were moving a chat, move it to the new project
    if (pendingMoveChat) {
      await moveToProject(pendingMoveChat, projectId);
      setPendingMoveChat(null);
    }
  };

  const handleDragEnd = async (result: DropResult) => {
    const { draggableId, destination } = result;
    
    if (!destination) return;
    
    // Check if dropped on a project
    if (destination.droppableId.startsWith('project-')) {
      const projectId = destination.droppableId.replace('project-', '');
      await moveToProject(draggableId, projectId);
      toast({ title: 'Chat movido al proyecto' });
    }
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

  const ChatItem = ({ chat, index }: { chat: typeof chats[0]; index: number }) => {
    const isEditing = editingId === chat.id;
    
    return (
      <Draggable draggableId={chat.id} index={index}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className={cn(
              'group flex items-center gap-2 px-3 py-2.5 rounded-lg cursor-pointer transition-colors',
              currentChatId === chat.id && !isEditing
                ? 'bg-sidebar-accent text-sidebar-accent-foreground' 
                : 'hover:bg-sidebar-accent/50 text-sidebar-foreground/80',
              snapshot.isDragging && 'bg-sidebar-accent shadow-lg'
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
                    <DropdownMenuItem onClick={(e) => handleTogglePin(e, chat.id)}>
                      <Pin className="w-4 h-4 mr-2" />
                      {chat.isPinned ? 'Desfijar' : 'Fijar'}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger>
                        <MoveRight className="w-4 h-4 mr-2" />
                        Mover a proyecto
                      </DropdownMenuSubTrigger>
                      <DropdownMenuSubContent>
                        {chat.projectId && (
                          <DropdownMenuItem onClick={() => handleMoveToProject(chat.id, null)}>
                            <X className="w-4 h-4 mr-2" />
                            Sin proyecto
                          </DropdownMenuItem>
                        )}
                        {projects.map(project => (
                          <DropdownMenuItem 
                            key={project.id}
                            onClick={() => handleMoveToProject(chat.id, project.id)}
                            disabled={chat.projectId === project.id}
                          >
                            <span className="mr-2">{project.emoji}</span>
                            {project.name}
                          </DropdownMenuItem>
                        ))}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => {
                          setPendingMoveChat(chat.id);
                          setNewProjectDialog(true);
                        }}>
                          <FolderPlus className="w-4 h-4 mr-2" />
                          Nuevo proyecto...
                        </DropdownMenuItem>
                      </DropdownMenuSubContent>
                    </DropdownMenuSub>
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
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteConfirmChat(chat.id);
                      }}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Eliminar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}
          </div>
        )}
      </Draggable>
    );
  };

  // Chats filtered by search for the modal
  const searchFilteredChats = chats
    .filter(c => !c.isArchived)
    .filter(c => {
      if (!searchQuery) return true;
      return c.title.toLowerCase().includes(searchQuery.toLowerCase());
    })
    .slice(0, 10);

  return (
    <>
      <DragDropContext onDragEnd={handleDragEnd}>
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
          </div>
          
          <div className="px-2 py-3 space-y-2">
            {/* New Chat Button - Top like ChatGPT */}
            <Button 
              onClick={handleNewChat}
              className="w-full justify-start gap-2 bg-primary hover:bg-crab-orange-hover text-primary-foreground"
            >
              <Plus className="w-4 h-4" />
              Nuevo chat
            </Button>
            
            {/* Search Button - Opens Modal like ChatGPT */}
            <Button 
              variant="outline"
              onClick={() => setSearchModalOpen(true)}
              className="w-full justify-start gap-2 text-sidebar-foreground/70 border-sidebar-border hover:bg-sidebar-accent/50"
            >
              <Search className="w-4 h-4" />
              Buscar chats
            </Button>
          </div>
          
          <ScrollArea className="flex-1 px-2 py-2">
            {/* Projects Section */}
            <Collapsible open={projectsOpen} onOpenChange={setProjectsOpen}>
              <div className="flex items-center justify-between px-3 py-2">
                <CollapsibleTrigger className="flex items-center gap-2 text-xs font-semibold text-sidebar-foreground/50 uppercase tracking-wider hover:text-sidebar-foreground/70 transition-colors">
                  <ChevronDown className={cn('w-3 h-3 transition-transform', !projectsOpen && '-rotate-90')} />
                  Proyectos
                </CollapsibleTrigger>
              </div>
              <CollapsibleContent>
                {/* New Project - First item like ChatGPT */}
                <button
                  onClick={() => setNewProjectDialog(true)}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sidebar-foreground/70 hover:bg-sidebar-accent/50 transition-colors"
                >
                  <FolderPlus className="w-4 h-4" />
                  <span className="text-sm">Nuevo proyecto</span>
                </button>
                
                {/* Project list */}
                {projects.map(project => (
                  <Droppable key={project.id} droppableId={`project-${project.id}`}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={cn(
                          'group flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors',
                          selectedProjectId === project.id
                            ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                            : 'hover:bg-sidebar-accent/50 text-sidebar-foreground/80',
                          snapshot.isDraggingOver && 'bg-primary/20 ring-2 ring-primary'
                        )}
                        onClick={() => setSelectedProjectId(project.id)}
                      >
                        {selectedProjectId === project.id ? (
                          <FolderOpen className="w-4 h-4 text-primary" />
                        ) : (
                          <Folder className="w-4 h-4 text-sidebar-foreground/60" />
                        )}
                        <span className="flex-1 text-sm truncate">{project.emoji} {project.name}</span>
                        <span className="text-xs text-sidebar-foreground/40">
                          {chats.filter(c => c.projectId === project.id && !c.isArchived).length}
                        </span>
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
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem 
                              className="text-destructive focus:text-destructive"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteProject(project.id);
                                toast({ title: 'Proyecto eliminado' });
                              }}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Eliminar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                ))}
                
                {/* Show all chats when a project is selected */}
                {selectedProjectId && (
                  <button
                    onClick={() => setSelectedProjectId(null)}
                    className="w-full flex items-center gap-2 px-3 py-2 mt-1 rounded-lg text-sidebar-foreground/60 hover:bg-sidebar-accent/50 transition-colors text-sm"
                  >
                    <X className="w-4 h-4" />
                    Ver todos los chats
                  </button>
                )}
              </CollapsibleContent>
            </Collapsible>
            
            <div className="my-3 mx-3 border-t border-sidebar-border/30" />
            
            {/* Chats List - "Tus chats" like ChatGPT */}
            <div className="px-1">
              <p className="px-3 py-2 text-xs font-semibold text-sidebar-foreground/50 uppercase tracking-wider">
                Tus chats
              </p>
              
              <Droppable droppableId="chats-list" isDropDisabled>
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps}>
                    <AnimatePresence>
                      {sortedChats.map((chat, index) => (
                        <ChatItem key={chat.id} chat={chat} index={index} />
                      ))}
                    </AnimatePresence>
                    
                    {sortedChats.length === 0 && (
                      <p className="px-3 py-4 text-sm text-sidebar-foreground/40 text-center">
                        No hay chats aún
                      </p>
                    )}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          </ScrollArea>
        </motion.aside>
      </DragDropContext>

      {/* Search Modal - Like ChatGPT */}
      <Dialog open={searchModalOpen} onOpenChange={setSearchModalOpen}>
        <DialogContent className="sm:max-w-lg p-0 gap-0">
          <div className="flex items-center gap-3 p-4 border-b border-border">
            <Search className="w-5 h-5 text-muted-foreground" />
            <Input
              ref={searchInputRef}
              placeholder="Buscar chats..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border-0 p-0 h-auto text-base focus-visible:ring-0 bg-transparent"
            />
            <kbd className="px-2 py-1 text-xs font-mono bg-muted rounded border border-border">
              Esc
            </kbd>
          </div>
          
          <div className="max-h-80 overflow-y-auto">
            {/* New chat option */}
            <button
              onClick={() => {
                handleNewChat();
                setSearchModalOpen(false);
                setSearchQuery('');
              }}
              className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-accent transition-colors border-b border-border/50"
            >
              <Plus className="w-4 h-4 text-primary shrink-0" />
              <span className="font-medium">Nuevo chat</span>
            </button>
            
            {searchFilteredChats.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                No se encontraron chats
              </div>
            ) : (
              searchFilteredChats.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => {
                    handleSelectChat(chat.id);
                    setSearchModalOpen(false);
                    setSearchQuery('');
                  }}
                  className={cn(
                    'w-full flex items-center gap-3 px-4 py-3 text-left',
                    'hover:bg-accent transition-colors',
                    'border-b border-border/50 last:border-0'
                  )}
                >
                  <MessageSquare className="w-4 h-4 text-muted-foreground shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium truncate">{chat.title}</p>
                      {chat.isPinned && <Pin className="w-3 h-3 text-primary shrink-0" />}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">
                      {chat.messages.length} mensajes
                    </p>
                  </div>
                </button>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* New Project Dialog */}
      <Dialog open={newProjectDialog} onOpenChange={setNewProjectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nuevo proyecto</DialogTitle>
            <DialogDescription>
              Creá un proyecto para organizar tus chats
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Nombre del proyecto</Label>
              <Input
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                placeholder="Mi proyecto"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleCreateProject();
                }}
              />
            </div>
            <div className="space-y-2">
              <Label>Emoji</Label>
              <div className="flex gap-2 flex-wrap">
                {EMOJI_OPTIONS.map(emoji => (
                  <button
                    key={emoji}
                    className={cn(
                      'w-10 h-10 rounded-lg text-xl transition-colors',
                      newProjectEmoji === emoji
                        ? 'bg-primary/20 ring-2 ring-primary'
                        : 'bg-muted hover:bg-muted/80'
                    )}
                    onClick={() => setNewProjectEmoji(emoji)}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setNewProjectDialog(false);
              setPendingMoveChat(null);
            }}>
              Cancelar
            </Button>
            <Button onClick={handleCreateProject} disabled={!newProjectName.trim()}>
              Crear proyecto
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteConfirmChat} onOpenChange={(open) => !open && setDeleteConfirmChat(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar este chat?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El chat y todos sus mensajes serán eliminados permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteChat}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
