import { useEffect, useRef, useState, useCallback } from 'react';
import SockJS from 'sockjs-client';
import { Client, type IMessage } from '@stomp/stompjs';

const SOCKET_URL = 'http://localhost:8080/ws';

export const useWebSocket = (token?: string | null) => {
  const [connected, setConnected] = useState(false);
  const client = useRef<Client | null>(null);

  // Initialize connection
  useEffect(() => {
    if (!token) {
      // Don't connect if no token
      setConnected(false);
      return;
    }

    const stompClient = new Client({
      webSocketFactory: () => new SockJS(SOCKET_URL),
      connectHeaders: {
        'Authorization': `Bearer ${token}` // Add token to connection headers
      },
      debug: (str) => {
        // console.log(str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    stompClient.onConnect = () => {
      // console.log('WebSocket connected with authentication');
      setConnected(true);
    };

    stompClient.onDisconnect = () => {
      // console.log('WebSocket disconnected');
      setConnected(false);
    };

    stompClient.onStompError = (frame) => {
      // console.error('STOMP error:', frame);
      if (frame.headers['message']?.includes('Authentication')) {
        // console.error('WebSocket authentication failed');
        setConnected(false);
      }
    };

    stompClient.activate();
    client.current = stompClient;

    return () => {
      stompClient.deactivate();
    };
  }, [token]); // Reconnect when token changes

  // Subscribe to a topic
  const subscribe = useCallback((destination: string, callback: (message: any) => void) => {
    if (client.current && client.current.connected) {
      return client.current.subscribe(destination, (message: IMessage) => {
        try {
          const parsedMessage = JSON.parse(message.body);
          callback(parsedMessage);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      }, {
        // Add authorization header to subscription if needed
        'Authorization': token ? `Bearer ${token}` : ''
      });
    }
    return { unsubscribe: () => {} };
  }, [token]);

  // Send a message
  const sendMessage = useCallback((destination: string, body: any) => {
    if (client.current && client.current.connected) {
      client.current.publish({
        destination,
        body: JSON.stringify(body),
        headers: {
          'Authorization': token ? `Bearer ${token}` : '' // Add token to message headers
        }
      });
      return true;
    }
    return false;
  }, [token]);

  return {
    connected,
    subscribe,
    sendMessage,
  };
};