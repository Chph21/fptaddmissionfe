import { Bot, User, X, Sparkles } from 'lucide-react';

interface ChatMessageProps {
  message: string;
  isUser: boolean;
  timestamp: string;
  status?: string;
  onCancel?: () => void;
}

export default function ChatMessage({ message, isUser, timestamp, status, onCancel }: ChatMessageProps) {
  return (
    <div className={`flex gap-4 mb-6 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
      )}
      
      <div className={`max-w-[75%] ${isUser ? 'order-first' : ''}`}>
        <div
          className={`relative px-5 py-4 rounded-2xl shadow-sm ${
            isUser
              ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-br-md'
              : 'bg-white text-gray-800 rounded-bl-md border border-gray-100 shadow-md'
          }`}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message}</p>
          
          {/* Cancel button for processing messages */}
          {onCancel && (
            <button 
              onClick={onCancel}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 shadow-lg hover:bg-red-600 transition-colors"
              title="Cancel processing"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
        
        <div className={`flex items-center text-xs text-gray-400 mt-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
          {status && status !== 'COMPLETED' && status !== 'DELIVERED' && (
            <span className={`mr-2 font-medium px-2 py-1 rounded-full text-xs ${
              status === 'CANCELLED' ? 'bg-red-100 text-red-600' : 
              status === 'ERROR' ? 'bg-red-100 text-red-600' : 
              status === 'SENDING' ? 'bg-orange-100 text-orange-600' :
              'bg-gray-100 text-gray-600'
            }`}>
              {status === 'CANCELLED' ? 'Cancelled' : 
               status === 'ERROR' ? 'Error' : 
               status === 'SENDING' ? 'Sending...' : status}
            </span>
          )}
          <span>{timestamp}</span>
        </div>
      </div>
      
      {isUser && (
        <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center shadow-lg">
          <User className="w-5 h-5 text-white" />
        </div>
      )}
    </div>
  );
}