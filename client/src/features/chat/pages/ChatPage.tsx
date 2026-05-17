import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChatInterface } from '../components/ChatInterface';
import { Sidebar } from '../components/Sidebar';
import { useChatStore } from '../store/chatStore';
import { useAuth } from '../../auth/hooks/useAuth';
import { Button } from '../../../shared/components/ui/Button';
import { ROUTES } from '../../../constants/app.constants';

export const ChatPage = () => {
  const { conversationId } = useParams<{ conversationId: string }>();
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();
  const {
    conversations,
    currentConversation,
    isLoading,
    fetchConversations,
    createConversation,
    renameConversation,
    deleteConversation,
    setCurrentConversation,
    clearMessages,
  } = useChatStore();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      navigate(ROUTES.LOGIN);
    }
  }, [user, authLoading, navigate]);

  // Fetch conversations on mount
  useEffect(() => {
    if (user) {
      fetchConversations();
    }
  }, [user, fetchConversations]);

  // Set current conversation based on URL param
  useEffect(() => {
    if (conversationId) {
      const conv = conversations.find(c => c.id === parseInt(conversationId));
      if (conv) {
        setCurrentConversation(conv);
      }
    } else {
      setCurrentConversation(null);
      clearMessages();
    }
  }, [conversationId, conversations, setCurrentConversation, clearMessages]);

  const handleNewChat = async () => {
    const newConversation = await createConversation();
    navigate(`/chat/${newConversation.id}`);
    setIsSidebarOpen(false);
  };

  const handleSelectConversation = (conversation: { id: number }) => {
    navigate(`/chat/${conversation.id}`);
    setIsSidebarOpen(false);
  };

  const handleRename = async (id: number, title: string) => {
    await renameConversation(id, title);
  };

  const handleDelete = async (id: number) => {
    await deleteConversation(id);
    if (currentConversation?.id === id) {
      navigate('/chat');
    }
  };

  if (authLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-chatgpt-dark">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-chatgpt-green border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-chatgpt-dark">
      {/* Sidebar */}
      <Sidebar
        conversations={conversations}
        currentConversation={currentConversation}
        isLoading={isLoading}
        onSelectConversation={handleSelectConversation}
        onNewChat={handleNewChat}
        onRenameConversation={handleRename}
        onDeleteConversation={handleDelete}
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-gray-700 bg-chatgpt-sidebar">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-gray-700"
          >
            <svg className="w-5 h-5 text-chatgpt-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-lg font-semibold text-chatgpt-text">
            {currentConversation?.title || 'Qroq AI Chat'}
          </h1>
          <div className="w-9" />
        </div>

        {/* Chat Interface */}
        <div className="flex-1 overflow-hidden">
          <ChatInterface conversationId={conversationId ? parseInt(conversationId) : undefined} />
        </div>
      </div>
    </div>
  );
};

export default ChatPage;