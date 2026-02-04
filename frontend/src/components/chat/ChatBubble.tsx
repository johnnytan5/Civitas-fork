'use client';

import { Streamdown } from 'streamdown';
import { code } from '@streamdown/code';

interface ChatBubbleProps {
  role: 'user' | 'agent';
  message: string;
  timestamp?: string;
  isLoading?: boolean;
}

export function ChatBubble({ role, message, timestamp, isLoading = false }: ChatBubbleProps) {
  const isUser = role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-6`}>
      <div className="relative max-w-prose">
        {/* Chat bubble container */}
        <div
          className={`px-6 py-4 border-[3px] border-black break-words ${
            isUser
              ? 'bg-hot-pink shadow-[3px_3px_0px_#000]'
              : 'bg-stark-white shadow-[3px_3px_0px_#000]'
          }`}
        >
          {isUser ? (
            <p
              className="text-base font-black text-black leading-relaxed whitespace-pre-wrap"
            >
              {message}
            </p>
          ) : (
            <div className="text-base font-display text-black font-medium leading-relaxed prose-civitas">
              <Streamdown
                plugins={{ code }}
                isAnimating={role === 'agent' && isLoading}
                caret={role === 'agent' && isLoading ? 'block' : undefined}
              >
                {message}
              </Streamdown>
            </div>
          )}
          {timestamp && (
            <span className="block mt-2 text-xs font-display text-black opacity-60 uppercase tracking-wide">
              {timestamp}
            </span>
          )}
        </div>
        
        {/* Notch triangle - positioned absolutely */}
        <div
          className={`absolute ${
            isUser ? 'bubble-tip-right' : 'bubble-tip-left'
          }`}
        />
      </div>
    </div>
  );
}
