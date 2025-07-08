import { useEffect, useRef, useState } from 'react';
import { Menu } from 'lucide-react';
import ChatHeader from '../../components/ChatBot/ChatHeader';
import ChatSidebar from '../../components/ChatBot/ChatSidebar';
import ChatMessage from '../../components/ChatBot/ChatMessage';
import TypingIndicator from '../../components/ChatBot/TypingIndicator';
import ChatInput from '../../components/ChatBot/ChatInput';
import { useChat } from '../../hooks/useChat';

function ChatBotPage() {
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const { messages, isTyping, sendMessage, sessions, createNewSession, cancelRequest, connected } = useChat(currentSessionId);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [welcomeInput, setWelcomeInput] = useState('');
  
  // Add local state for pending messages
  const [pendingMessages, setPendingMessages] = useState<any[]>([]);

  // Keep track of the previous message count
  const prevMessageCountRef = useRef(0);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, pendingMessages]);

  useEffect(() => {
    // If message count has increased (we received a new message from backend)
    if (messages.length > prevMessageCountRef.current && pendingMessages.length > 0) {
      // Update all pending messages to DELIVERED status
      setPendingMessages(prev => 
        prev.map(message => ({
          ...message,
          status: 'DELIVERED'
        }))
      );
    }
    
    // Update the ref with current count
    prevMessageCountRef.current = messages.length;
  }, [messages.length, pendingMessages.length]);

  const handleToggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSessionSelect = (sessionId: string) => {
    setCurrentSessionId(sessionId);
    setPendingMessages([]); // Clear pending messages when switching sessions
    setIsSidebarOpen(false); // Close sidebar on mobile after selection
  };

  const handleNewChat = async (firstMessage?: string) => {
    try {
      // Clear any existing pending messages when starting a new chat
      setPendingMessages([]);
      
      if (firstMessage) {
        // If there's a first message, create session and send message
        const tempMessage = {
          id: `temp-${Date.now()}`,
          content: firstMessage,
          isUser: true,
          timestamp: 'Just now',
          status: 'SENDING',
          requestId: `req-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
        };
        
        setPendingMessages([tempMessage]);

        // Create new session with the first message
        const newSessionId = await createNewSession(firstMessage);
        
        if (newSessionId) {
          setCurrentSessionId(newSessionId);
          setIsSidebarOpen(false);
          setWelcomeInput(''); 
          
          try {
            await sendMessage(firstMessage, newSessionId);
          } catch (sendError) {
            console.error('Error sending first message:', sendError);
            setPendingMessages(prev => 
              prev.map(msg => ({
                ...msg,
                status: 'ERROR'
              }))
            );
          }
        } else {
          console.error('Failed to create new session');
          setPendingMessages([]);
        }
      } else {
        // If no first message, just clear current session (don't create new one yet)
        setCurrentSessionId(null);
        setIsSidebarOpen(false);
        setWelcomeInput('');
      }
    } catch (error) {
      console.error('Error in handleNewChat:', error);
      setPendingMessages([]);
    }
  };

  const handleWelcomeKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // Prevent new line
      if (welcomeInput.trim()) {
        handleWelcomeSubmit(e as any); // Trigger form submission
      }
    }
  };

  const handleSendMessage = async (content: string) => {
    // Always check if we need to create a new session
    if (!currentSessionId) {
      // Create new session first, then send message
      try {
        const tempMessage = {
          id: `temp-${Date.now()}`,
          content: content,
          isUser: true,
          timestamp: 'Just now',
          status: 'SENDING',
          requestId: `req-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
        };
        
        setPendingMessages([tempMessage]);

        // Create new session
        const newSessionId = await createNewSession(content);
        
        if (newSessionId) {
          setCurrentSessionId(newSessionId);
          
          // Send the message to the new session
          try {
            await sendMessage(content, newSessionId);
          } catch (sendError) {
            console.error('Error sending message:', sendError);
            setPendingMessages(prev => 
              prev.map(msg => ({
                ...msg,
                status: 'ERROR'
              }))
            );
          }
        } else {
          console.error('Failed to create new session');
          setPendingMessages([]);
        }
      } catch (error) {
        console.error('Error creating session and sending message:', error);
        setPendingMessages([]);
      }
    } else {
      // Session exists, just send message normally
      const pendingMessage = {
        id: `temp-${Date.now()}`,
        content: content,
        isUser: true,
        timestamp: 'Just now',
        status: 'SENDING',
        requestId: `req-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
      };
      
      setPendingMessages(prev => [...prev, pendingMessage]);
      
      try {
        await sendMessage(content, currentSessionId);
      } catch (error) {
        console.error('Error sending message:', error);
        setPendingMessages(prev => 
          prev.map(msg => 
            msg.requestId === pendingMessage.requestId 
              ? { ...msg, status: 'ERROR' }
              : msg
          )
        );
      }
    }
  };

  const handleWelcomeInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setWelcomeInput(e.target.value);
  };

  const handleWelcomeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (welcomeInput.trim()) {
      handleNewChat(welcomeInput.trim());
    }
  };

  // Combine backend messages with pending messages
  const displayMessages = [...messages, ...pendingMessages].sort((a, b) => {
    // If messages have createdAt timestamps, use those (from backend)
    if (a.createdAt && b.createdAt) {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    }
    
    // For pending messages that don't have createdAt, extract timestamp from ID
    const getTimeFromId = (id: string) => {
      if (typeof id === 'string' && id.includes('temp-')) {
        const timestamp = id.split('temp-')[1];
        return parseInt(timestamp, 10);
      }
      return 0;
    };
    
    const timeA = a.createdAt ? new Date(a.createdAt).getTime() : getTimeFromId(a.id);
    const timeB = b.createdAt ? new Date(b.createdAt).getTime() : getTimeFromId(b.id);
    
    return timeA - timeB;
  });

  return (
    <div className="h-screen bg-gray-50 flex">
      {/* Connection Status */}
      {!connected && (
        <div className="fixed top-0 left-0 right-0 bg-red-500 text-white text-center py-1 z-50">
          Connection lost. Reconnecting...
        </div>
      )}
      
      {/* Sidebar */}
      <ChatSidebar
        isOpen={isSidebarOpen}
        onToggle={handleToggleSidebar}
        currentSessionId={currentSessionId}
        onSessionSelect={handleSessionSelect}
        onNewChat={() => handleNewChat()}
        sessions={sessions}
      />
      
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header with menu button */}
        <div className="relative">
          <button
            onClick={handleToggleSidebar}
            className="lg:hidden absolute left-4 top-1/2 transform -translate-y-1/2 z-10 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <Menu className="w-5 h-5" />
          </button>
          <ChatHeader 
            title={sessions.find(s => s.id === currentSessionId)?.title || "New Conversation"} 
          />
        </div>
        
        {/* Messages container or Welcome Screen */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {currentSessionId || pendingMessages.length > 0 ? (
            /* Chat Messages */
            <div className="flex-1 overflow-y-auto px-2 sm:px-4 lg:px-6 py-3 sm:py-6">
              <div className="max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-4xl mx-auto">
                {displayMessages.map((message, index) => (
                  <div
                    key={`${message.id || message.requestId || index}-${index}`}
                    className="animate-fadeIn"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <ChatMessage
                      message={message.content}
                      isUser={message.isUser}
                      timestamp={message.timestamp}
                      status={message.status}
                      onCancel={
                        message.isUser && message.status === 'SENDING' && isTyping ? 
                        () => cancelRequest(currentSessionId!, message.requestId || '') : 
                        undefined
                      }
                    />
                  </div>
                ))}
                
                {isTyping && <TypingIndicator isVisible={true} />}
                
                {/* This empty div ensures we always scroll to the bottom */}
                <div ref={messagesEndRef} />
              </div>
            </div>
          ) : (
            /* Welcome Screen with improved input */
            <div className="flex-1 flex items-center justify-center px-4">
              <div className="text-center max-w-md">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Menu className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome to FPT AI Assistant</h2>
                <p className="text-gray-600 mb-6">Ask a question to start a new conversation or select an existing chat.</p>
                
                <form onSubmit={handleWelcomeSubmit} className="mb-4">
                  <textarea
                    value={welcomeInput}
                    onChange={handleWelcomeInputChange}
                    onKeyDown={handleWelcomeKeyDown}
                    placeholder="Ask about FPT University admissions..."
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none mb-3 text-gray-900 bg-white"
                    rows={3}
                  />
                  <button 
                    type="submit"
                    disabled={!welcomeInput.trim()}
                    className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Start New Chat
                  </button>
                </form>
                
                <div className="border-t border-gray-200 pt-4">
                  <button 
                    onClick={() => handleNewChat()}
                    className="text-orange-500 hover:text-orange-600 text-sm font-medium"
                  >
                    Or start with an empty chat
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {/* Input - Fixed at bottom - show for pending messages too */}
          {(currentSessionId || pendingMessages.length > 0) && (
            <ChatInput onSendMessage={handleSendMessage} disabled={isTyping || !connected} />
          )}
        </div>
      </div>
    </div>
  );
}

export default ChatBotPage;