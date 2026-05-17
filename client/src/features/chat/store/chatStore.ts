import { create } from 'zustand';
import { chatService } from '../services/chatService';
import { ChatState, Conversation, Message, SendMessageResponse } from '../types/chat.types';

export const useChatStore = create<ChatState>((set, get) => ({
  // Initial state
  conversations: [],
  currentConversation: null,
  messages: [],
  isLoading: false,
  isSending: false,
  
  // Fetch all conversations
  fetchConversations: async () => {
    set({ isLoading: true });
    try {
      const response = await chatService.getAllConversations();
      set({ conversations: response });
    } catch (error) {
      console.error('Failed to fetch conversations:', error);
    } finally {
      set({ isLoading: false });
    }
  },
  
  // Fetch messages for a conversation
  fetchMessages: async (conversationId: number) => {
    set({ isLoading: true });
    try {
      const messages = await chatService.getMessages(conversationId);
      set({ messages });
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    } finally {
      set({ isLoading: false });
    }
  },
  
  // Send a message - conversationId is REQUIRED
  sendMessage: async (content: string, conversationId: number) => {
    if (!conversationId) {
      console.error('Cannot send message: conversationId is required');
      throw new Error('Please create a conversation first');
    }
    
    set({ isSending: true });
    try {
      // Add user message optimistically
      const tempId = Date.now();
      const userMessage: Message = {
        id: tempId,
        conversationId: conversationId,
        role: 'USER',
        content,
        createdAt: new Date().toISOString(),
      };
      
      set((state) => ({ 
        messages: [...state.messages, userMessage] 
      }));
      
      // Send to API
      const response = await chatService.sendMessage(content, conversationId);
      
      // Convert backend response to Message format
      const assistantMessage: Message = {
        id: response.messageId,
        conversationId: response.conversationId,
        role: 'ASSISTANT',
        content: response.assistantResponse,
        createdAt: response.timestamp,
      };
      
      // Update messages: replace temp user message with real one and add assistant message
      set((state) => ({
        messages: [
          ...state.messages.filter(m => m.id !== tempId),
          userMessage,
          assistantMessage
        ]
      }));
      
      // Refresh conversation list to update message count
      await get().fetchConversations();
      
      return response;
    } catch (error) {
      console.error('Failed to send message:', error);
      // Remove the optimistic user message on error
      set((state) => ({
        messages: state.messages.filter(m => m.id !== Date.now())
      }));
      throw error;
    } finally {
      set({ isSending: false });
    }
  },
  
  // Create new conversation
  createConversation: async (title?: string) => {
    set({ isLoading: true });
    try {
      const conversation = await chatService.createConversation(title);
      set((state) => ({ 
        conversations: [conversation, ...state.conversations],
        currentConversation: conversation,
        messages: [],
      }));
      console.log('New conversation created with ID:', conversation.id);
      return conversation;
    } catch (error) {
      console.error('Failed to create conversation:', error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
  
  // Rename conversation
  renameConversation: async (id: number, title: string) => {
    try {
      await chatService.renameConversation(id, title);
      set((state) => ({
        conversations: state.conversations.map(conv =>
          conv.id === id ? { ...conv, title } : conv
        ),
        currentConversation: state.currentConversation?.id === id 
          ? { ...state.currentConversation, title } 
          : state.currentConversation,
      }));
    } catch (error) {
      console.error('Failed to rename conversation:', error);
    }
  },
  
  // Delete conversation
  deleteConversation: async (id: number) => {
    try {
      await chatService.deleteConversation(id);
      set((state) => ({
        conversations: state.conversations.filter(conv => conv.id !== id),
        currentConversation: state.currentConversation?.id === id 
          ? null 
          : state.currentConversation,
        messages: state.currentConversation?.id === id ? [] : state.messages,
      }));
    } catch (error) {
      console.error('Failed to delete conversation:', error);
    }
  },
  
  // Regenerate last message
  regenerateLastMessage: async (conversationId: number) => {
    set({ isSending: true });
    try {
      // Remove last assistant message
      let lastAssistantMessage: Message | null = null;
      set((state) => {
        const messagesCopy = [...state.messages];
        for (let i = messagesCopy.length - 1; i >= 0; i--) {
          if (messagesCopy[i].role === 'ASSISTANT') {
            lastAssistantMessage = messagesCopy[i];
            messagesCopy.splice(i, 1);
            break;
          }
        }
        return { messages: messagesCopy };
      });
      
      // Regenerate
      const newMessage = await chatService.regenerateLastResponse(conversationId);
      
      set((state) => ({
        messages: [...state.messages, newMessage],
      }));
    } catch (error) {
      console.error('Failed to regenerate message:', error);
    } finally {
      set({ isSending: false });
    }
  },
  
  // Set current conversation
  setCurrentConversation: (conversation: Conversation | null) => {
    set({ currentConversation: conversation });
    if (conversation) {
      get().fetchMessages(conversation.id);
    } else {
      set({ messages: [] });
    }
  },
  
  // Clear messages
  clearMessages: () => {
    set({ messages: [] });
  },
}));