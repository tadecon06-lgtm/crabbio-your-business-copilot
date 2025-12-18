export interface Attachment {
  id: string;
  name: string;
  type: string;
  url: string;
  size: number;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  feedback?: 'positive' | 'negative';
  attachments?: Attachment[];
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
  isPinned?: boolean;
  isArchived?: boolean;
  projectId?: string | null;
}

export interface Project {
  id: string;
  userId: string;
  name: string;
  emoji: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  language?: string;
  fontSize?: string;
  streamingEnabled?: boolean;
}
