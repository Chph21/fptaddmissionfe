import { Home, Plus, MessageSquare, Trash2, Edit3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { type ChatSessionUI } from '../../types/chatTypes';

interface ChatSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  currentSessionId?: string | null;
  onSessionSelect: (sessionId: string) => void;
  onNewChat: () => void;
  sessions: ChatSessionUI[];
}

export default function ChatSidebar({ 
  isOpen, 
  onToggle, 
  currentSessionId, 
  onSessionSelect, 
  onNewChat,
  sessions = []
}: ChatSidebarProps) {
  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed left-0 top-0 h-full w-80 bg-white border-r border-gray-200 z-50 transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:z-auto
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Chat Sessions</h2>
              <button
                onClick={onToggle}
                className="lg:hidden p-1 text-gray-400 hover:text-gray-600 rounded"
              >
                ×
              </button>
            </div>
            
            {/* Navigation buttons */}
            <div className="space-y-2">
              <Link
                to="/"
                className="flex items-center gap-3 w-full px-3 py-2 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200"
              >
                <Home className="w-4 h-4" />
                <span className="text-sm font-medium">Back to Home</span>
              </Link>
              
              <button
                onClick={onNewChat}
                className="flex items-center gap-3 w-full px-3 py-2 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200"
              >
                <Plus className="w-4 h-4" />
                <span className="text-sm font-medium">New Chat</span>
              </button>
            </div>
          </div>
          
          {/* Chat Sessions List */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-2">
              {sessions.length === 0 ? (
                <div className="text-center text-gray-500 py-4">
                  No chat sessions yet
                </div>
              ) : (
                sessions.map((session) => (
                  <div
                    key={session.id}
                    className={`
                      group relative p-3 rounded-lg cursor-pointer transition-all duration-200
                      ${currentSessionId === session.id 
                        ? 'bg-orange-50 border border-orange-200' 
                        : 'hover:bg-gray-50 border border-transparent'
                      }
                    `}
                    onClick={() => onSessionSelect(session.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                        <MessageSquare className="w-4 h-4 text-gray-600" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-gray-900 truncate">
                          {session.title}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                          {session.lastMessage || 'No messages yet'}
                        </p>
                        <span className="text-xs text-gray-400 mt-1 block">
                          {session.timestamp || 'Just now'}
                        </span>
                      </div>
                    </div>
                    
                    {/* Action buttons - show on hover */}
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <div className="flex gap-1">
                        <button className="p-1 text-gray-400 hover:text-gray-600 rounded">
                          <Edit3 className="w-3 h-3" />
                        </button>
                        <button className="p-1 text-gray-400 hover:text-red-500 rounded">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          
          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <div className="text-xs text-gray-500 text-center">
              AI Assistant v1.0
            </div>
          </div>
        </div>
      </div>
    </>
  );
}