import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { Message } from '../types/chat.types';
import { useThemeStore } from '../../../store/slices/themeSlice';

// Import highlight.js styles
import 'highlight.js/styles/github-dark.css';

interface MessageBubbleProps {
  message: Message;
  onCopy?: (content: string) => void;
  onRegenerate?: () => void;
  isLast?: boolean;
}

export const MessageBubble = ({ message, onCopy, onRegenerate, isLast }: MessageBubbleProps) => {
  const { theme } = useThemeStore();
  const isUser = message.role === 'USER';
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    onCopy?.(message.content);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRegenerate = () => {
    onRegenerate?.();
  };

  // Custom component for code blocks with copy button and scroll
  const CodeBlock = ({ node, inline, className, children, ...props }: any) => {
    const match = /language-(\w+)/.exec(className || '');
    const codeContent = String(children).replace(/\n$/, '');
    const [codeCopied, setCodeCopied] = useState(false);

    const handleCodeCopy = () => {
      navigator.clipboard.writeText(codeContent);
      setCodeCopied(true);
      setTimeout(() => setCodeCopied(false), 2000);
    };

    if (!inline && match) {
      return (
        <div className="relative group my-3 rounded-lg overflow-hidden w-full">
          <div className="flex items-center justify-between bg-gray-800 px-3 py-1.5 sm:px-4 sm:py-2">
            <span className="text-xs text-gray-400">{match[1]}</span>
            <button
              onClick={handleCodeCopy}
              className="text-xs text-gray-400 hover:text-white transition-colors"
            >
              {codeCopied ? (
                <span className="flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Copied!
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                  </svg>
                  Copy
                </span>
              )}
            </button>
          </div>
          <div className="overflow-x-auto max-w-full">
            <pre className="m-0 p-3 sm:p-4" style={{ backgroundColor: '#1e1e1e' }}>
              <code className={className} style={{ whiteSpace: 'pre', wordBreak: 'normal' }} {...props}>
                {children}
              </code>
            </pre>
          </div>
        </div>
      );
    }
    
    return (
      <code className={`${className} bg-gray-800 px-1 py-0.5 rounded text-sm break-words`} {...props}>
        {children}
      </code>
    );
  };

  return (
    <div
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-fade-in w-full`}
    >
      <div className={`flex max-w-[95%] sm:max-w-[85%] ${isUser ? 'flex-row-reverse' : 'flex-row'} gap-2 sm:gap-3`}>
        {/* Avatar */}
        <div
          className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
            isUser
              ? 'bg-chatgpt-green'
              : theme === 'dark'
              ? 'bg-gray-600'
              : 'bg-gray-300'
          }`}
        >
          {isUser ? (
            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
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
          className={`relative rounded-lg px-3 py-2 sm:px-4 sm:py-3 w-full overflow-hidden ${
            isUser
              ? 'bg-chatgpt-green text-white'
              : theme === 'dark'
              ? 'bg-chatgpt-ai-msg text-chatgpt-text'
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          {isUser ? (
            <div className="whitespace-pre-wrap break-words text-sm sm:text-base">{message.content}</div>
          ) : (
            <div className="prose prose-invert max-w-none prose-sm sm:prose-base">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight]}
                components={{
                  code: CodeBlock,
                  a: ({ href, children }) => (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-chatgpt-green hover:underline break-words"
                    >
                      {children}
                    </a>
                  ),
                  h1: ({ children }) => (
                    <h1 className="text-xl sm:text-2xl font-bold mt-3 mb-2 break-words">{children}</h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-lg sm:text-xl font-bold mt-3 mb-2 break-words">{children}</h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-base sm:text-lg font-bold mt-2 mb-1 break-words">{children}</h3>
                  ),
                  h4: ({ children }) => (
                    <h4 className="text-sm sm:text-base font-bold mt-2 mb-1 break-words">{children}</h4>
                  ),
                  p: ({ children }) => (
                    <p className="text-sm sm:text-base mb-2 break-words">{children}</p>
                  ),
                  ul: ({ children }) => (
                    <ul className="list-disc pl-4 sm:pl-5 my-2 break-words">{children}</ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="list-decimal pl-4 sm:pl-5 my-2 break-words">{children}</ol>
                  ),
                  li: ({ children }) => (
                    <li className="my-1 text-sm sm:text-base break-words">{children}</li>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-chatgpt-green pl-3 sm:pl-4 my-2 text-gray-400 break-words">
                      {children}
                    </blockquote>
                  ),
                  table: ({ children }) => (
                    <div className="overflow-x-auto my-3 w-full">
                      <table className="min-w-full border-collapse border border-gray-700 text-xs sm:text-sm">
                        {children}
                      </table>  
                    </div>
                  ),
                  th: ({ children }) => (
                    <th className="border border-gray-700 px-2 py-1 sm:px-3 sm:py-2 bg-gray-800 font-semibold">
                      {children}
                    </th>
                  ),
                  td: ({ children }) => (
                    <td className="border border-gray-700 px-2 py-1 sm:px-3 sm:py-2">
                      {children}
                    </td>
                  ),
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          )}
          
          {/* Timestamp and Actions */}
          <div className="flex items-center justify-end gap-2 mt-2">
            <span
              className={`text-[10px] sm:text-xs ${
                isUser ? 'text-white/70' : 'text-gray-400'
              }`}
            >
              {new Date(message.createdAt).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
            
            {!isUser && (
              <button
                onClick={handleCopy}
                className={`text-[10px] sm:text-xs hover:text-chatgpt-green transition-colors ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`}
                title={copied ? 'Copied!' : 'Copy response'}
              >
                {copied ? (
                  <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                    />
                  </svg>
                )}
              </button>
            )}
            
            {!isUser && isLast && onRegenerate && (
              <button
                onClick={handleRegenerate}
                className={`text-[10px] sm:text-xs hover:text-chatgpt-green transition-colors ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`}
                title="Regenerate response"
              >
                <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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