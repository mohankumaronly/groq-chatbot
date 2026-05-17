import { Message } from '../types/chat.types';
import { useThemeStore } from '../../../store/slices/themeSlice';

interface MessageBubbleProps {
  message: Message;
  onCopy?: (content: string) => void;
  onRegenerate?: () => void;
  isLast?: boolean;
}

export const MessageBubble = ({ message, onCopy, onRegenerate, isLast }: MessageBubbleProps) => {
  const { theme } = useThemeStore();
  const isUser = message.role === 'USER';

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    onCopy?.(message.content);
  };

  return (
    <div
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-fade-in`}
    >
      <div className={`flex max-w-[80%] ${isUser ? 'flex-row-reverse' : 'flex-row'} gap-3`}>
        {/* Avatar */}
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
            isUser
              ? 'bg-chatgpt-green'
              : theme === 'dark'
              ? 'bg-gray-600'
              : 'bg-gray-300'
          }`}
        >
          {isUser ? (
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm6-2a1 1 0 11-2 0 1 1 0 012 0z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </div>

        {/* Message Content */}
        <div
          className={`relative rounded-lg px-4 py-2 ${
            isUser
              ? 'bg-chatgpt-green text-white'
              : theme === 'dark'
              ? 'bg-chatgpt-ai-msg text-chatgpt-text'
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          <div className="whitespace-pre-wrap break-words">{message.content}</div>
          
          {/* Timestamp and Actions */}
          <div className="flex items-center justify-end gap-2 mt-1">
            <span
              className={`text-xs ${
                isUser ? 'text-white/70' : 'text-gray-400'
              }`}
            >
              {new Date(message.createdAt).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
            
            {!isUser && isLast && (
              <button
                onClick={handleCopy}
                className={`text-xs hover:text-chatgpt-green transition-colors ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`}
                title="Copy response"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                  />
                </svg>
              </button>
            )}
            
            {!isUser && isLast && onRegenerate && (
              <button
                onClick={onRegenerate}
                className={`text-xs hover:text-chatgpt-green transition-colors ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`}
                title="Regenerate response"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};