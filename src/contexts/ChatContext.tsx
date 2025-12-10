import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { Chat, Message } from '@/types/chat';

interface ChatContextType {
  chats: Chat[];
  currentChatId: string | null;
  currentChat: Chat | null;
  createChat: () => string;
  selectChat: (id: string) => void;
  addMessage: (chatId: string, message: Omit<Message, 'id' | 'timestamp'>) => void;
  renameChat: (chatId: string, title: string) => void;
  deleteChat: (chatId: string) => void;
  togglePinChat: (chatId: string) => void;
  archiveChat: (chatId: string) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

const generateId = () => Math.random().toString(36).substring(2, 15);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [chats, setChats] = useState<Chat[]>(() => {
    const stored = localStorage.getItem('crabbio-chats');
    return stored ? JSON.parse(stored) : [];
  });
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);

  const saveChats = (newChats: Chat[]) => {
    setChats(newChats);
    localStorage.setItem('crabbio-chats', JSON.stringify(newChats));
  };

  const createChat = useCallback(() => {
    const newChat: Chat = {
      id: generateId(),
      title: 'Nueva conversación',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      isPinned: false,
      isArchived: false,
    };
    saveChats([newChat, ...chats]);
    setCurrentChatId(newChat.id);
    return newChat.id;
  }, [chats]);

  const selectChat = useCallback((id: string) => {
    setCurrentChatId(id);
  }, []);

  const addMessage = useCallback((chatId: string, message: Omit<Message, 'id' | 'timestamp'>) => {
    setChats(prev => {
      const newChats = prev.map(chat => {
        if (chat.id !== chatId) return chat;
        
        const newMessage: Message = {
          ...message,
          id: generateId(),
          timestamp: new Date(),
        };
        
        // Update title from first user message
        const title = chat.messages.length === 0 && message.role === 'user'
          ? message.content.slice(0, 50) + (message.content.length > 50 ? '...' : '')
          : chat.title;
        
        return {
          ...chat,
          title,
          messages: [...chat.messages, newMessage],
          updatedAt: new Date(),
        };
      });
      localStorage.setItem('crabbio-chats', JSON.stringify(newChats));
      return newChats;
    });
  }, []);

  const renameChat = useCallback((chatId: string, title: string) => {
    setChats(prev => {
      const newChats = prev.map(chat =>
        chat.id === chatId ? { ...chat, title, updatedAt: new Date() } : chat
      );
      localStorage.setItem('crabbio-chats', JSON.stringify(newChats));
      return newChats;
    });
  }, []);

  const deleteChat = useCallback((chatId: string) => {
    setChats(prev => {
      const newChats = prev.filter(chat => chat.id !== chatId);
      localStorage.setItem('crabbio-chats', JSON.stringify(newChats));
      return newChats;
    });
    if (currentChatId === chatId) setCurrentChatId(null);
  }, [currentChatId]);

  const togglePinChat = useCallback((chatId: string) => {
    setChats(prev => {
      const newChats = prev.map(chat =>
        chat.id === chatId ? { ...chat, isPinned: !chat.isPinned, updatedAt: new Date() } : chat
      );
      localStorage.setItem('crabbio-chats', JSON.stringify(newChats));
      return newChats;
    });
  }, []);

  const archiveChat = useCallback((chatId: string) => {
    setChats(prev => {
      const newChats = prev.map(chat =>
        chat.id === chatId ? { ...chat, isArchived: !chat.isArchived, updatedAt: new Date() } : chat
      );
      localStorage.setItem('crabbio-chats', JSON.stringify(newChats));
      return newChats;
    });
  }, []);

  const currentChat = chats.find(chat => chat.id === currentChatId) || null;

  return (
    <ChatContext.Provider value={{
      chats,
      currentChatId,
      currentChat,
      createChat,
      selectChat,
      addMessage,
      renameChat,
      deleteChat,
      togglePinChat,
      archiveChat,
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
