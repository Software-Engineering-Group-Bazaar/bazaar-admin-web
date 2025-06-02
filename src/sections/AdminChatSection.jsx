import { Box, Paper } from '@mui/material';
import { useState, useEffect } from 'react';
import ChatHeader from '@components/ChatHeader';
import ChatMessages from '@components/ChatMessages';
import ChatInput from '@components/ChatInput';
import UserInfoSidebar from '@components/UserInfoSidebar';
import LockOverlay from '@components/LockOverlay';
import { useSignalR } from '@hooks/useSignalR';
import { apiFetchMessagesForConversationAsync } from '../api/api.js';
import { useTranslation } from 'react-i18next';

export default function AdminChatSection({ ticket, conversation }) {
  const [messages, setMessages] = useState([]);
  const { t } = useTranslation();
  const adminUserId = conversation?.adminUserId;

  // Prikaz korisnika
  let userLabel = '';
  if (
    conversation?.buyerUserId &&
    ticket?.userId === conversation.buyerUserId
  ) {
    userLabel = conversation.buyerUsername;
  } else if (
    conversation?.sellerUserId &&
    ticket?.userId === conversation.sellerUserId
  ) {
    userLabel = conversation.sellerUsername;
  }

  // Dohvati poruke
  useEffect(() => {
    const fetchMessages = async () => {
      if (!conversation?.id || ticket?.status !== 'Open') return;
      const { data } = await apiFetchMessagesForConversationAsync(
        conversation.id
      );
      setMessages(
        data.map((msg) => ({
          ...msg,
          isOwnMessage: msg.senderUserId === adminUserId,
        }))
      );
    };
    fetchMessages();
  }, [conversation, ticket?.status, adminUserId]);

  // SignalR za real-time poruke
  const { messages: signalRMessages, sendMessage } = useSignalR(
    ticket?.status === 'Open' && conversation ? conversation.id : null,
    adminUserId
  );

  // Dodaj nove SignalR poruke u listu
  useEffect(() => {
    if (
      signalRMessages &&
      signalRMessages.length > 0 &&
      ticket?.status === 'Open'
    ) {
      setMessages((prev) => [
        ...prev,
        signalRMessages[signalRMessages.length - 1],
      ]);
    }
  }, [signalRMessages, ticket?.status]);

  // Kada pošalješ poruku, odmah je dodaj u listu (optimistic update)
  const handleSendMessage = (content) => {
    if (content.trim() && ticket?.status === 'Open') {
      sendMessage(content);
    }
  };

  const locked = ticket?.status !== 'Open';

  return (
    <Box
      sx={{
        display: 'flex',
        height: '100vh',
        bgcolor: '#f7f8fa',
        maxWidth: '1400px',
        position: 'relative',
        flex: 1,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          borderRight: '1px solid #e5e7eb',
          bgcolor: '#fff',
          position: 'relative',
        }}
      >
        <ChatHeader username={userLabel} />
        <Box
          sx={{
            position: 'relative',
            overflowY: 'auto',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <ChatMessages messages={messages} userId={adminUserId} />
          {locked && (
            <LockOverlay message={t('chat.openTicketToViewChat')} />
          )}
        </Box>
        <ChatInput disabled={locked} onSendMessage={handleSendMessage} />
      </Paper>
      <UserInfoSidebar
        username={userLabel}
        storeName={conversation?.storeName}
      />
    </Box>
  );
}
