import { useState, KeyboardEvent, useRef, useEffect } from 'react';

interface MessageInputProps {
  onSend: (message: string) => void;
  isSending?: boolean;
  disabled?: boolean;
}

export const MessageInput = ({ onSend, isSending = false, disabled = false }: MessageInputProps) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  };

  useEffect(() => {
    adjustHeight();
  }, [message]);

  const handleSend = () => {
    if (message.trim() && !isSending && !disabled) {
      onSend(message.trim());
      setMessage('');
      adjustHeight();
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t border-gray-700 bg-chatgpt-sidebar p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex gap-3 items-end">
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Send a message..."
              rows={1}
              disabled={isSending || disabled}
              className="w-full resize-none rounded-lg border border-gray-600 bg-chatgpt-dark 
                       px-4 py-3 text-chatgpt-text placeholder-gray-400 
                       focus:border-chatgpt-green focus:outline-none focus:ring-1 
                       focus:ring-chatgpt-green disabled:opacity-50"
              style={{ maxHeight: '200px' }}
            />
          </div>
          
          <button
            onClick={handleSend}
            disabled={!message.trim() || isSending || disabled}
            className="flex h-11 w-11 items-center justify-center rounded-lg 
                       bg-chatgpt-green text-white transition-all hover:bg-[#0e8f6f] 
                       disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSending ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            )}
          </button>
        </div>
        
        <p className="text-xs text-gray-500 text-center mt-2">
          Press Enter to send, Shift + Enter for new line
        </p>
      </div>
    </div>
  );
};