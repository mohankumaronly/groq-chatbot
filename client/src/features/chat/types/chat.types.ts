// Message Types
export interface Message {
  id: number;
  conversationId: number;
  role: 'USER' | 'ASSISTANT';
  content: string;
  createdAt: string;
}

// Conversation Types
export interface Conversation {
  id: number;
  title: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
  messageCount?: number;
}

// Send Message Request - Matches backend DTO with @NotNull on conversationId
export interface SendMessageRequest {
  conversationId: number;
  content: string;
}

// Send Message Response - Matches your backend response structure
export interface SendMessageResponse {
  messageId: number;
  conversationId: number;
  assistantResponse: string;
  timestamp: string;
  tokenCount: number | null;
}

// Create Conversation Request
export interface CreateConversationRequest {
  title?: string;
}

// Paginated Response
export interface PaginatedResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

// Chat State
export interface ChatState {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  messages: Message[];
  isLoading: boolean;
  isSending: boolean;
  
  // Actions
  fetchConversations: () => Promise<void>;
  fetchMessages: (conversationId: number) => Promise<void>;
  sendMessage: (content: string, conversationId: number) => Promise<SendMessageResponse>;
  createConversation: (title?: string) => Promise<Conversation>;
  renameConversation: (id: number, title: string) => Promise<void>;
  deleteConversation: (id: number) => Promise<void>;
  regenerateLastMessage: (conversationId: number) => Promise<void>;
  setCurrentConversation: (conversation: Conversation | null) => void;
  clearMessages: () => void;
}