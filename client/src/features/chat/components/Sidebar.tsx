import { useState } from 'react';
import { Conversation } from '../types/chat.types';
import { Button } from '../../../shared/components/ui/Button';
import { useThemeStore } from '../../../store/slices/themeSlice';

interface SidebarProps {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  isLoading: boolean;
  onSelectConversation: (conversation: Conversation) => void;
  onNewChat: () => void;
  onRenameConversation: (id: number, title: string) => void;
  onDeleteConversation: (id: number) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export const Sidebar = ({
  conversations,
  currentConversation,
  isLoading,
  onSelectConversation,
  onNewChat,
  onRenameConversation,
  onDeleteConversation,
  isOpen,
  onToggle,
}: SidebarProps) => {
  const { theme } = useThemeStore();
  const [renamingId, setRenamingId] = useState<number | null>(null);
  const [newTitle, setNewTitle] = useState('');

  const handleRename = (conversation: Conversation) => {
    setRenamingId(conversation.id);
    setNewTitle(conversation.title);
  };

  const handleRenameSubmit = (id: number) => {
    if (newTitle.trim()) {
      onRenameConversation(id, newTitle.trim());
    }
    setRenamingId(null);
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this conversation?')) {
      onDeleteConversation(id);
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 z-50 h-full w-72 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } ${theme === 'dark' ? 'bg-chatgpt-sidebar' : 'bg-gray-100'}`}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="p-3 border-b border-gray-700">
            <Button
              onClick={onNewChat}
              variant="primary"
              size="md"
              className="w-full"
            >
              + New Chat
            </Button>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto p-2">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-chatgpt-green border-t-transparent" />
              </div>
            ) : conversations.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No conversations yet</p>
                <p className="text-sm mt-2">Start a new chat!</p>
              </div>
            ) : (
              <div className="space-y-1">
                {conversations.map((conv) => (
                  <div
                    key={conv.id}
                    className={`group relative rounded-lg p-2 cursor-pointer transition-colors ${
                      currentConversation?.id === conv.id
                        ? 'bg-chatgpt-green/20'
                        : 'hover:bg-gray-700'
                    }`}
                    onClick={() => onSelectConversation(conv)}
                  >
                    {renamingId === conv.id ? (
                      <input
                        type="text"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        onBlur={() => handleRenameSubmit(conv.id)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleRenameSubmit(conv.id);
                          if (e.key === 'Escape') setRenamingId(null);
                        }}
                        className="w-full bg-chatgpt-dark text-chatgpt-text rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-chatgpt-green"
                        autoFocus
                      />
                    ) : (
                      <div className="flex items-center justify-between">
                        <span className="flex-1 truncate text-sm text-chatgpt-text">
                          {conv.title}
                        </span>
                        <div className="hidden group-hover:flex gap-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRename(conv);
                            }}
                            className="p-1 rounded hover:bg-gray-600"
                          >
                            <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(conv.id);
                            }}
                            className="p-1 rounded hover:bg-gray-600"
                          >
                            <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-gray-700">
            <div className="text-xs text-gray-500 text-center">
              {conversations.length} conversations
            </div>
          </div>
        </div>
      </div>

      {/* Toggle Button for Mobile */}
      <button
        onClick={onToggle}
        className="fixed bottom-4 left-4 z-50 rounded-lg bg-chatgpt-green p-3 text-white shadow-lg lg:hidden"
      >
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </>
  );
};