import { Home, Plus, MessageSquare, Trash2, Edit3, Sparkles, ArrowLeft } from 'lucide-react';
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
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onToggle}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed left-0 top-0 h-full w-80 bg-white/95 backdrop-blur-sm border-r border-gray-200/50 z-50 transform transition-all duration-300 ease-in-out shadow-2xl
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:z-auto lg:shadow-none
      `}>
        <div className="flex flex-col h-full">
          {/* Enhanced Header */}
          <div className="p-6 border-b border-gray-200/50 bg-gradient-to-r from-orange-50 to-red-50">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">AI Assistant</h2>
              </div>
              <button
                onClick={onToggle}
                className="lg:hidden p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-white/50 transition-all duration-200"
              >
                ×
              </button>
            </div>
            
            {/* Navigation buttons */}
            <div className="space-y-2">
              <Link
                to="/"
                className="flex items-center gap-3 w-full px-4 py-3 text-left text-gray-700 hover:bg-white/70 hover:text-orange-600 rounded-xl transition-all duration-200 group"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                <span className="text-sm font-medium">Back to Home</span>
              </Link>
              
              <button
                onClick={onNewChat}
                className="flex items-center gap-3 w-full px-4 py-3 text-left text-gray-700 hover:bg-white/70 hover:text-orange-600 rounded-xl transition-all duration-200 group"
              >
                <Plus className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium">New Conversation</span>
              </button>
            </div>
          </div>
          
          {/* Chat Sessions List */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-2">
              {sessions.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm">No conversations yet</p>
                  <p className="text-xs text-gray-400 mt-1">Start a new chat to begin</p>
                </div>
              ) : (
                sessions.map((session) => (
                  <div
                    key={session.id}
                    className={`
                      group relative p-4 rounded-xl cursor-pointer transition-all duration-200 border
                      ${currentSessionId === session.id 
                        ? 'bg-gradient-to-r from-orange-50 to-red-50 border-orange-200 shadow-md' 
                        : 'hover:bg-gray-50 border-transparent hover:border-gray-200 hover:shadow-sm'
                      }
                    `}
                    onClick={() => onSessionSelect(session.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
                        currentSessionId === session.id 
                          ? 'bg-gradient-to-r from-orange-500 to-red-500' 
                          : 'bg-gray-100'
                      }`}>
                        <MessageSquare className={`w-4 h-4 ${
                          currentSessionId === session.id ? 'text-white' : 'text-gray-600'
                        }`} />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-gray-900 truncate mb-1">
                          {session.title}
                        </h3>
                        <p className="text-xs text-gray-500 line-clamp-2 mb-2">
                          {session.lastMessage || 'No messages yet'}
                        </p>
                        <span className="text-xs text-gray-400">
                          {session.timestamp || 'Just now'}
                        </span>
                      </div>
                    </div>
                    
                    {/* Action buttons - show on hover */}
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <div className="flex gap-1">
                        <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-white rounded-lg transition-all duration-200">
                          <Edit3 className="w-3 h-3" />
                        </button>
                        <button className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-white rounded-lg transition-all duration-200">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          
          {/* Enhanced Footer */}
          <div className="p-4 border-t border-gray-200/50 bg-gray-50/50">
            <div className="text-center">
              <div className="text-xs text-gray-500 mb-2">
                Powered by FPT AI Technology
              </div>
              <div className="text-xs text-gray-400">
                Version 2.0 • Always Learning
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}