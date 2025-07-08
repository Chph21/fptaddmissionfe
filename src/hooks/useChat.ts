import { useState, useEffect, useCallback, useRef } from 'react';
import { ROLES, type ChatUIMessage, type ChatSessionUI } from '../types/chatTypes';
import { useWebSocket } from './useWebSocket';
import { useAppSelector } from '../store/hooks';
import axios from 'axios';

const API_URL = 'http://localhost:8080/api/chatboxes';

export const useChat = (sessionId?: string | null) => {
  const [messages, setMessages] = useState<ChatUIMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [sessions, setSessions] = useState<ChatSessionUI[]>([]);
  
  // Get token from Redux store
  const { token } = useAppSelector((state) => state.auth);
  const { user } = useAppSelector((state) => state.auth);
  
  const { connected, subscribe, sendMessage } = useWebSocket(token); // Pass token to WebSocket
  const subscriptions = useRef<any[]>([]);

  // Create axios instance with auth header
  const axiosWithAuth = useCallback(() => {
    return axios.create({
      baseURL: API_URL,
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json'
      }
    });
  }, [token]);

  // Load sessions
  useEffect(() => {
    if (!token) return; // Don't fetch if no token
    
    const fetchSessions = async () => {
      try {
        const api = axiosWithAuth();
        const response = await api.get('/sessions/' + (user?.id ? `${user.id}` : ''));
        const sessionsData = response.data.map((session: any) => ({
          id: session.id,
          title: session.title,
          createdAt: session.createdAt,
          lastMessage: '...',
          timestamp: new Date(session.createdAt).toLocaleString()
        }));
        setSessions(sessionsData);
      } catch (error) {
        console.error('Error fetching sessions:', error);
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 401) {
            console.error('Unauthorized: Invalid or expired token');
          }
        }
      }
    };

    fetchSessions();

    // Subscribe to sessions updates
    if (connected) {
      const subscription = subscribe('/topic/sessions', (updatedSession) => {
        console.log('📥 Received session update via WebSocket:', updatedSession);
        
        setSessions(prev => {
          const exists = prev.some(s => s.id === updatedSession.id);
          
          if (exists) {
            // Update existing session (including title updates)
            return prev.map(s => s.id === updatedSession.id ? { 
              ...s, 
              title: updatedSession.title || s.title, // Update title from WebSocket
              createdAt: updatedSession.createdAt || s.createdAt,
              lastMessage: updatedSession.lastMessage || s.lastMessage,
              timestamp: new Date(updatedSession.createdAt || s.createdAt).toLocaleString()
            } : s);
          } else {
            // Add new session (from WebSocket notification)
            return [{
              id: updatedSession.id,
              title: updatedSession.title || 'New Conversation',
              createdAt: updatedSession.createdAt,
              lastMessage: updatedSession.lastMessage || 'New conversation',
              timestamp: new Date(updatedSession.createdAt).toLocaleString()
            }, ...prev];
          }
        });
      });
      
      subscriptions.current.push(subscription);
    }

    return () => {
      subscriptions.current.forEach(sub => sub.unsubscribe());
      subscriptions.current = [];
    };
  }, [connected, subscribe, token, axiosWithAuth]);

  // Load messages for the selected session
  useEffect(() => {
    if (!sessionId || !token) {
      setMessages([]);
      return;
    }

    // Fetch existing messages
    const fetchMessages = async () => {
      try {
        const api = axiosWithAuth();
        const response = await api.get(`/sessions/${sessionId}/messages`);
        const messagesData = response.data.map((msg: any) => ({
          id: msg.id,
          role: msg.role,
          content: msg.content,
          createdAt: msg.createdAt,
          status: msg.status || 'DELIVERED',
          isUser: msg.role === ROLES.USER,
          timestamp: new Date(msg.createdAt).toLocaleString(),
          requestId: msg.requestId
        }));
        setMessages(messagesData);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();

    // Subscribe to message updates for this session
    if (connected) {
      const subscription = subscribe(`/topic/chat/${sessionId}`, (newMessage) => {
        // console.log('Received message update:', newMessage);
        
        // Update typing indicator based on message status
        if (newMessage.role === ROLES.BOT && newMessage.status === 'COMPLETED') {
          setIsTyping(false);
        } else if (newMessage.status === 'PROCESSING') {
          setIsTyping(true);
          return;
        }

        // Only add/update messages with actual content or status updates
        if (newMessage.content || newMessage.status === 'CANCELLED') {
          setMessages(prev => {
            // Check if message already exists by ID or requestId
            const existingIndex = prev.findIndex(m => 
              m.id === newMessage.id || 
              (m.requestId && newMessage.requestId && m.requestId === newMessage.requestId)
            );
            
            if (existingIndex !== -1) {
              // Update existing message
              const updatedMessages = [...prev];
              updatedMessages[existingIndex] = {
                ...newMessage,
                isUser: newMessage.role === ROLES.USER,
                timestamp: new Date(newMessage.createdAt || new Date()).toLocaleString()
              };
              return updatedMessages;
            } else {
              // Add new message
              const newMsg = {
                ...newMessage,
                isUser: newMessage.role === ROLES.USER,
                timestamp: new Date(newMessage.createdAt || new Date()).toLocaleString()
              };
              return [...prev, newMsg];
            }
          });
  
          // Update session list with latest message
          if (newMessage.content && (newMessage.status === 'COMPLETED' || newMessage.role === ROLES.USER)) {
            setSessions(prev => 
              prev.map(session => 
                session.id === sessionId 
                  ? { 
                      ...session, 
                      lastMessage: newMessage.content.substring(0, 50) + (newMessage.content.length > 50 ? '...' : ''),
                      timestamp: new Date(newMessage.createdAt || new Date()).toLocaleString()
                    } 
                  : session
              )
            );
          }
        }
      });
      
      subscriptions.current.push(subscription);
    }

    return () => {
      subscriptions.current.forEach(sub => sub.unsubscribe());
      subscriptions.current = [];
    };
  }, [sessionId, connected, subscribe, token, axiosWithAuth]);

  const sendChatMessage = useCallback((content: string, currentSessionId?: string | null) => {
    if (!currentSessionId || !token) return;
    
    // Don't set typing here - let the WebSocket response handle it
    
    // Create the message object
    const messageDTO = {
      role: ROLES.USER,
      content,
      sessionId: currentSessionId,
      createdAt: new Date().toISOString(),
      requestId: `req-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
    };
    
    // Send via WebSocket if connected, otherwise use REST API
    if (connected) {
      sendMessage('/app/chat.sendMessage', messageDTO);
    } else {
      const api = axiosWithAuth();
      api.post('/message', messageDTO)
        .catch(error => console.error('Error sending message:', error));
    }
  }, [connected, sendMessage, token, axiosWithAuth]);

  const createNewSession = useCallback(async (firstMessage?: string) => {
    if (!token) return null;
    
    try {
      const newSession = {
        title: 'New Conversation',
        userId: (user?.id || ''),
        createdAt: new Date().toISOString(),
        firstMessage: firstMessage
      };
      
      const api = axiosWithAuth();
      const response = await api.post('/session', newSession);
      const createdSession = response.data;
      return createdSession.id;
    } catch (error) {
      console.error('Error creating session:', error);
      return null;
    }
  }, [token, axiosWithAuth, user?.id]);

  const cancelRequest = useCallback((sessionId: string, requestId: string) => {
    if (!token) return;
    
    const api = axiosWithAuth();
    api.delete(`/message/${sessionId}/cancel/${requestId}`)
      .catch(error => console.error('Error cancelling request:', error));
  }, [token, axiosWithAuth]);

  return { 
    messages, 
    isTyping, 
    sendMessage: sendChatMessage, 
    sessions, 
    createNewSession,
    cancelRequest,
    connected
  };
};