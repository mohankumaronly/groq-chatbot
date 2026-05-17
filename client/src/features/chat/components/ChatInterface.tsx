import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageBubble } from './MessageBubble';
import { MessageInput } from './MessageInput';
import { useChatStore } from '../store/chatStore';
import { useAuth } from '../../auth/hooks/useAuth';

interface ChatInterfaceProps {
  conversationId?: number;
}

export const ChatInterface = ({ conversationId }: ChatInterfaceProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    messages,
    currentConversation,
    isSending,
    isLoading,
    sendMessage,
    fetchMessages,
    regenerateLastMessage,
    createConversation,
  } = useChatStore();

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasFetched = useRef(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (conversationId && !hasFetched.current) {
      fetchMessages(conversationId);
      hasFetched.current = true;
    }
    return () => {
      hasFetched.current = false;
    };
  }, [conversationId, fetchMessages]);

  const handleSend = async (content: string) => {
    try {
      let convId = conversationId;
      
      // If no conversation exists, create one first
      if (!convId) {
        console.log('No conversation, creating new one...');
        const newConversation = await createConversation();
        convId = newConversation.id;
        console.log('New conversation created with ID:', convId);
        navigate(`/chat/${convId}`);
      }
      
      // Now send message with valid conversationId
      await sendMessage(content, convId);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleRegenerate = async () => {
    if (conversationId) {
      await regenerateLastMessage(conversationId);
    }
  };

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    console.log('Copied to clipboard');
  };

  const safeMessages = messages || [];

  if (!user) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400">Please login to start chatting</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col bg-chatgpt-dark overflow-hidden w-full">
      {/* Header */}
      <div className="border-b border-gray-700 bg-chatgpt-sidebar p-3 sm:p-4">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-lg sm:text-xl font-semibold text-chatgpt-text break-words">
            {currentConversation?.title || 'New Chat'}
          </h1>
          <p className="text-xs sm:text-sm text-gray-400">
            Chat with AI • {safeMessages.length} messages
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-4xl space-y-3 sm:space-y-4 p-3 sm:p-4">
          {safeMessages.length === 0 && !isLoading && (
            <div className="flex h-full min-h-[300px] sm:min-h-[400px] flex-col items-center justify-center text-center">
              <div className="max-w-md px-4">
                <div className="mb-4 text-5xl sm:text-6xl">🤖</div>
                <h2 className="mb-2 text-xl sm:text-2xl font-semibold text-chatgpt-text">
                  How can I help you today?
                </h2>
                <p className="text-sm sm:text-base text-gray-400">
                  Ask me anything! I'm here to help with coding, writing, research, and more.
                </p>
              </div>
            </div>
          )}
          
          {safeMessages.map((message, index) => {
            if (!message || !message.role) {
              console.warn('Invalid message object:', message);
              return null;
            }
            
            return (
              <MessageBubble
                key={message.id || index}
                message={message}
                onCopy={handleCopy}
                onRegenerate={
                  index === safeMessages.length - 1 && 
                  message.role === 'ASSISTANT' && 
                  !isSending
                    ? handleRegenerate
                    : undefined
                }
                isLast={index === safeMessages.length - 1}
              />
            );
          })}
          
          {isSending && (
            <div className="flex justify-start">
              <div className="flex max-w-[95%] sm:max-w-[80%] gap-2 sm:gap-3">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gray-600 flex items-center justify-center">
                  <div className="w-3 h-3 sm:w-4 sm:h-4 animate-pulse rounded-full bg-gray-400" />
                </div>
                <div className="rounded-lg bg-chatgpt-ai-msg px-3 py-2 sm:px-4 sm:py-2">
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: '0ms' }} />
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: '150ms' }} />
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <MessageInput onSend={handleSend} isSending={isSending} />
    </div>
  );
};