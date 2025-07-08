import { Bot, User, X } from 'lucide-react';

interface ChatMessageProps {
  message: string;
  isUser: boolean;
  timestamp: string;
  status?: string;
  onCancel?: () => void;
}

export default function ChatMessage({ message, isUser, timestamp, status, onCancel }: ChatMessageProps) {
  return (
    <div className={`flex gap-3 mb-6 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
          <Bot className="w-5 h-5 text-white" />
        </div>
      )}
      
      <div className={`max-w-[70%] ${isUser ? 'order-first' : ''}`}>
        <div
          className={`relative px-4 py-3 rounded-2xl ${
            isUser
              ? 'bg-orange-500 text-white rounded-br-md'
              : 'bg-white text-gray-800 rounded-bl-md shadow-sm border border-gray-100'
          }`}
        >
          <p className="text-sm leading-relaxed">{message}</p>
          
          {/* Cancel button for processing messages */}
          {onCancel && (
            <button 
              onClick={onCancel}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors"
              title="Cancel processing"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
        <div className={`flex items-center text-xs text-gray-400 mt-1 ${isUser ? 'justify-end' : 'justify-start'}`}>
          {status && status !== 'COMPLETED' && status !== 'DELIVERED' && (
            <span className="mr-2 font-medium">
              {status === 'CANCELLED' ? 'Cancelled' : 
               status === 'ERROR' ? 'Error' : status}
            </span>
          )}
          <span>{timestamp}</span>
        </div>
      </div>
      
      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
          <User className="w-5 h-5 text-white" />
        </div>
      )}
    </div>
  );
}