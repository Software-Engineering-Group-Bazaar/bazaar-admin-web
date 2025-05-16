// @hooks/useSignalR.js
import { useEffect, useRef, useState } from 'react';
import * as signalR from '@microsoft/signalr';

export const useSignalR = (conversationId, userId) => {
  const [messages, setMessages] = useState([]);
  const connectionRef = useRef(null);

  useEffect(() => {
    // Connect to SignalR
    const connect = async () => {
      const storedToken = localStorage.getItem('token');

      if (!conversationId) {
        console.error('Conversation ID is required for SignalR connection.');
        return;
      }

      const connection = new signalR.HubConnectionBuilder()
        .withUrl(`http://localhost:5054/chathub`, {
          accessTokenFactory: () => storedToken,
        })
        .withAutomaticReconnect()
        .configureLogging(signalR.LogLevel.Information)
        .build();

      connection.serverTimeoutInMilliseconds = 60000;

      // Listen for new messages
      connection.on('ReceiveMessage', (receivedMessage) => {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            id: receivedMessage.id,
            senderUserId: receivedMessage.senderUserId,
            senderUsername: receivedMessage.senderUsername,
            content: receivedMessage.content,
            sentAt: receivedMessage.sentAt,
            isOwnMessage: receivedMessage.senderUserId === userId,
          },
        ]);
      });

      try {
        await connection.start();
        console.log('SignalR connected');
        connectionRef.current = connection;

        // Join conversation-specific group
        connection
          .invoke('JoinConversation', conversationId)
          .catch((err) => console.error('Error joining group:', err));
      } catch (err) {
        console.error('SignalR connection error:', err);
      }
    };

    connect();

    return () => {
      connectionRef.current?.stop();
    };
  }, [conversationId, userId]);

  // Send message to the SignalR hub
  const sendMessage = (content) => {
    if (connectionRef.current) {
      connectionRef.current
        .invoke('SendMessage', {
          ConversationId: conversationId,
          Content: content,
        })
        .catch((err) => console.error('Send failed:', err));
    }
  };

  return { messages, sendMessage };
};
