import apiClient from '../../../services/api/apiClient';
import { tokenManager } from '../../auth/utils/tokenManager';
import {
  Conversation,
  Message,
  SendMessageResponse,
  CreateConversationRequest,
  PaginatedResponse,
} from '../types/chat.types';

class ChatService {
  // ==================== Conversations ====================

  async getConversations(page: number = 0, size: number = 20): Promise<PaginatedResponse<Conversation>> {
    const response = await apiClient.get<PaginatedResponse<Conversation>>(
      `/api/conversations?page=${page}&size=${size}`
    );
    return response.data;
  }

  async getAllConversations(): Promise<Conversation[]> {
    const response = await apiClient.get<Conversation[]>(
      `/api/conversations/all`
    );
    return response.data;
  }

  async getConversationById(id: number): Promise<Conversation> {
    const response = await apiClient.get<Conversation>(
      `/api/conversations/${id}`
    );
    return response.data;
  }

  async createConversation(title?: string): Promise<Conversation> {
    const request: CreateConversationRequest = { title: title || 'New Chat' };
    const response = await apiClient.post<Conversation>(
      `/api/conversations`,
      request
    );
    console.log('✅ Conversation created:', response.data);
    return response.data;
  }

  async renameConversation(id: number, title: string): Promise<void> {
    await apiClient.patch(`/api/conversations/${id}`, { title });
    console.log('✅ Conversation renamed:', id, title);
  }

  async deleteConversation(id: number): Promise<void> {
    await apiClient.delete(`/api/conversations/${id}`);
    console.log('✅ Conversation deleted:', id);
  }

  async getConversationCount(): Promise<number> {
    const response = await apiClient.get<number>(`/api/conversations/count`);
    return response.data;
  }

  // ==================== Messages ====================

  async getMessages(conversationId: number): Promise<Message[]> {
    const response = await apiClient.get<Message[]>(
      `/api/conversations/${conversationId}/messages`
    );
    return response.data;
  }

  async getRecentMessages(conversationId: number, limit: number = 50): Promise<Message[]> {
    const response = await apiClient.get<Message[]>(
      `/api/conversations/${conversationId}/messages/recent?limit=${limit}`
    );
    return response.data;
  }

  async getMessageCount(conversationId: number): Promise<number> {
    const response = await apiClient.get<number>(
      `/api/conversations/${conversationId}/messages/count`
    );
    return response.data;
  }

  async deleteMessage(conversationId: number, messageId: number): Promise<void> {
    await apiClient.delete(`/api/conversations/${conversationId}/messages/${messageId}`);
    console.log('✅ Message deleted:', messageId);
  }

  // ==================== Chat ====================

  async sendMessage(content: string, conversationId: number): Promise<SendMessageResponse> {
    if (!conversationId) {
      throw new Error('conversationId is required. Please create a conversation first.');
    }

    const request = {
      conversationId: conversationId,
      content: content
    };

    console.log('💬 Sending message request:', request);

    const response = await apiClient.post<SendMessageResponse>(
      `/api/chat/send`,
      request
    );

    console.log('💬 Message sent, response received:', response.data);
    return response.data;
  }

  async sendMessageAndCreateNew(message: string, title?: string): Promise<SendMessageResponse> {
    const params = new URLSearchParams();
    params.append('message', message);
    if (title) params.append('title', title);

    console.log('💬 Sending message with new conversation:', { message: message.substring(0, 50), title });

    const response = await apiClient.post<SendMessageResponse>(
      `/api/chat/send/new?${params.toString()}`
    );

    console.log('💬 Message sent, new conversation created');
    return response.data;
  }

  async regenerateLastResponse(conversationId: number): Promise<Message> {
    console.log('🔄 Regenerating last response for conversation:', conversationId);

    const response = await apiClient.post<Message>(
      `/api/chat/${conversationId}/regenerate`
    );

    console.log('🔄 Response regenerated');
    return response.data;
  }

  // ==================== Helper ====================

  isAuthenticated(): boolean {
    return tokenManager.isAuthenticated();
  }
}

export const chatService = new ChatService();
export default chatService;