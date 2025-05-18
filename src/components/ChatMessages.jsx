// @components/ChatMessages.jsx
import { Box } from '@mui/material';
import ChatMessage from './ChatMessage';
import { useEffect, useRef } from 'react';

export default function ChatMessages({ messages = [], userId }) {
  const messagesEndRef = useRef(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <Box
      sx={{
        flex: 1,
        px: 4,
        py: 3,
        overflowY: 'auto',
        bgcolor: '#f7f8fa',
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
        width: '700px',
        scrollbarWidth: 'none', // Firefox
        '&::-webkit-scrollbar': { display: 'none' }, // Chrome/Safari
      }}
    >
      {messages.map((msg) => (
        <ChatMessage
          key={msg.id}
          sender={msg.senderUsername}
          isAdmin={msg.senderUserId === userId}
          text={msg.content}
          time={new Date(msg.sentAt).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
          isPrivate={msg.isPrivate}
        />
      ))}
      <div ref={messagesEndRef} />
    </Box>
  );
}
