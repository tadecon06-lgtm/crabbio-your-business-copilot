import { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import { Chat, Message, Attachment } from '@/types/chat';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';
import { Json } from '@/integrations/supabase/types';

interface ChatContextType {
  chats: Chat[];
  currentChatId: string | null;
  currentChat: Chat | null;
  isLoadingChats: boolean;
  createChat: () => Promise<string>;
  selectChat: (id: string) => void;
  addMessage: (chatId: string, message: Omit<Message, 'id' | 'timestamp'>) => Promise<void>;
  renameChat: (chatId: string, title: string) => Promise<void>;
  deleteChat: (chatId: string) => Promise<void>;
  togglePinChat: (chatId: string) => Promise<void>;
  archiveChat: (chatId: string) => Promise<void>;
  refreshChats: () => Promise<void>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

function parseAttachments(attachments: Json | null): Attachment[] {
  if (!attachments || !Array.isArray(attachments)) return [];
  return attachments as unknown as Attachment[];
}

export function ChatProvider({ children }: { children: ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [isLoadingChats, setIsLoadingChats] = useState(false);

  const refreshChats = useCallback(async () => {
    if (!isAuthenticated || !user) return;
    
    setIsLoadingChats(true);
    try {
      const { data: chatsData, error: chatsError } = await supabase
        .from('chats')
        .select('*')
        .order('updated_at', { ascending: false });
      
      if (chatsError) throw chatsError;
      
      const chatsWithMessages: Chat[] = await Promise.all(
        (chatsData || []).map(async (chat) => {
          const { data: messagesData } = await supabase
            .from('messages')
            .select('*')
            .eq('chat_id', chat.id)
            .order('created_at', { ascending: true });
          
          return {
            id: chat.id,
            title: chat.title,
            isPinned: chat.is_pinned,
            isArchived: chat.is_archived,
            createdAt: new Date(chat.created_at),
            updatedAt: new Date(chat.updated_at),
            messages: (messagesData || []).map(msg => ({
              id: msg.id,
              role: msg.role as 'user' | 'assistant',
              content: msg.content,
              timestamp: new Date(msg.created_at),
              feedback: msg.feedback as 'positive' | 'negative' | undefined,
              attachments: parseAttachments(msg.attachments),
            })),
          };
        })
      );
      
      setChats(chatsWithMessages);
    } catch (error) {
      console.error('Error loading chats:', error);
    } finally {
      setIsLoadingChats(false);
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    refreshChats();
  }, [refreshChats]);

  const createChat = useCallback(async (): Promise<string> => {
    if (!user) throw new Error('User not authenticated');
    
    const { data, error } = await supabase
      .from('chats')
      .insert({ user_id: user.id, title: 'Nueva conversación' })
      .select()
      .single();
    
    if (error) throw error;
    
    const newChat: Chat = {
      id: data.id,
      title: data.title,
      messages: [],
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
      isPinned: data.is_pinned,
      isArchived: data.is_archived,
    };
    
    setChats(prev => [newChat, ...prev]);
    setCurrentChatId(data.id);
    return data.id;
  }, [user]);

  const selectChat = useCallback((id: string) => {
    setCurrentChatId(id);
  }, []);

  const addMessage = useCallback(async (chatId: string, message: Omit<Message, 'id' | 'timestamp'>) => {
    const { data, error } = await supabase
      .from('messages')
      .insert({
        chat_id: chatId,
        role: message.role,
        content: message.content,
        attachments: (message.attachments || []) as unknown as Json,
      })
      .select()
      .single();
    
    if (error) throw error;
    
    const newMessage: Message = {
      id: data.id,
      role: data.role as 'user' | 'assistant',
      content: data.content,
      timestamp: new Date(data.created_at),
      attachments: parseAttachments(data.attachments),
    };
    
    setChats(prev => prev.map(chat => {
      if (chat.id !== chatId) return chat;
      
      const title = chat.messages.length === 0 && message.role === 'user'
        ? message.content.slice(0, 50) + (message.content.length > 50 ? '...' : '')
        : chat.title;
      
      // Update title in DB if needed
      if (title !== chat.title) {
        supabase.from('chats').update({ title }).eq('id', chatId);
      }
      
      return {
        ...chat,
        title,
        messages: [...chat.messages, newMessage],
        updatedAt: new Date(),
      };
    }));
  }, []);

  const renameChat = useCallback(async (chatId: string, title: string) => {
    const { error } = await supabase
      .from('chats')
      .update({ title })
      .eq('id', chatId);
    
    if (error) throw error;
    
    setChats(prev => prev.map(chat =>
      chat.id === chatId ? { ...chat, title, updatedAt: new Date() } : chat
    ));
  }, []);

  const deleteChat = useCallback(async (chatId: string) => {
    const { error } = await supabase
      .from('chats')
      .delete()
      .eq('id', chatId);
    
    if (error) throw error;
    
    setChats(prev => prev.filter(chat => chat.id !== chatId));
    if (currentChatId === chatId) setCurrentChatId(null);
  }, [currentChatId]);

  const togglePinChat = useCallback(async (chatId: string) => {
    const chat = chats.find(c => c.id === chatId);
    if (!chat) return;
    
    const { error } = await supabase
      .from('chats')
      .update({ is_pinned: !chat.isPinned })
      .eq('id', chatId);
    
    if (error) throw error;
    
    setChats(prev => prev.map(c =>
      c.id === chatId ? { ...c, isPinned: !c.isPinned, updatedAt: new Date() } : c
    ));
  }, [chats]);

  const archiveChat = useCallback(async (chatId: string) => {
    const chat = chats.find(c => c.id === chatId);
    if (!chat) return;
    
    const { error } = await supabase
      .from('chats')
      .update({ is_archived: !chat.isArchived })
      .eq('id', chatId);
    
    if (error) throw error;
    
    setChats(prev => prev.map(c =>
      c.id === chatId ? { ...c, isArchived: !c.isArchived, updatedAt: new Date() } : c
    ));
  }, [chats]);

  const currentChat = chats.find(chat => chat.id === currentChatId) || null;

  return (
    <ChatContext.Provider value={{
      chats,
      currentChatId,
      currentChat,
      isLoadingChats,
      createChat,
      selectChat,
      addMessage,
      renameChat,
      deleteChat,
      togglePinChat,
      archiveChat,
      refreshChats,
    }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) throw new Error('useChat must be used within ChatProvider');
  return context;
}
