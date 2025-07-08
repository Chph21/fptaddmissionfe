import React, { useState } from 'react';
import { Send, Paperclip, Mic, Sparkles } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

export default function ChatInput({ onSendMessage, disabled = false }: ChatInputProps) {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="p-6">
      <form onSubmit={handleSubmit} className="flex gap-4 items-end max-w-4xl mx-auto">
        <button
          type="button"
          className="flex-shrink-0 p-3 text-gray-400 hover:text-orange-500 transition-colors duration-200 rounded-xl hover:bg-orange-50"
        >
          <Paperclip className="w-5 h-5" />
        </button>
        
        <div className="flex-1 relative">
          <textarea
            id="chat-message"
            name="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message here..."
            disabled={disabled}
            className="w-full px-5 py-4 pr-14 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-gray-900 bg-white placeholder-gray-500 shadow-sm"
            rows={1}
            style={{ minHeight: '56px', maxHeight: '120px' }}
          />
          
          <button
            type="button"
            className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 text-gray-400 hover:text-orange-500 transition-colors duration-200 rounded-lg hover:bg-orange-50"
          >
            <Mic className="w-4 h-4" />
          </button>
        </div>
        
        <button
          type="submit"
          disabled={!message.trim() || disabled}
          className="flex-shrink-0 p-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl hover:from-orange-600 hover:to-red-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-orange-500 disabled:hover:to-red-500 shadow-lg hover:shadow-xl group"
        >
          {disabled ? (
            <Sparkles className="w-5 h-5 animate-spin" />
          ) : (
            <Send className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
          )}
        </button>
      </form>
    </div>
  );
}