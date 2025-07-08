export const ROLES = {
  ADMIN: 'ADMIN',
  STAFF: 'STAFF',
  USER: 'USER',
  BOT: 'BOT',
  SYSTEM: 'SYSTEM'
} as const;

export type Roles = typeof ROLES[keyof typeof ROLES];

export interface ChatSession {
  id: string;
  title: string;
  createdAt: string;
  user?: User; 
}

export interface ChatMessage {
  id: string;
  role: Roles;
  content: string;
  createdAt: string;
  status: string;
  requestId?: string; // Add requestId to base message type
  chatBoxSession?: ChatSession;
}

export interface User {
  id: string;
  username?: string;
  email?: string;
  // Add other fields as needed
}

// Additional types for UI state
export interface ChatUIMessage extends ChatMessage {
  isUser: boolean; // Derived from role === ROLES.USER
  timestamp: string; // Formatted from createdAt
  requestId?: string; // Add requestId here too for explicit clarity
}

// For the sidebar sessions list
export interface ChatSessionUI extends ChatSession {
  lastMessage?: string; // The latest message content
  timestamp?: string; // Formatted from createdAt
}