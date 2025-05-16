// ChatPage.jsx
import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import TicketListSection from '@components/TicketListSection';
import AdminChatSection from '@sections/AdminChatSection';
import {
  apiFetchAllTicketsAsync,
  apiFetchAllConversationsAsync,
} from '../api/api.js';

export default function ChatPage() {
  const [tickets, setTickets] = useState([]);
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [unlockedTickets, setUnlockedTickets] = useState([]);
  const [conversations, setConversations] = useState([]);

  const fetchTickets = async () => {
    const { data } = await apiFetchAllTicketsAsync();
    setTickets(data);
  };

  useEffect(() => {
    const fetchData = async () => {
      const { data: ticketsData } = await apiFetchAllTicketsAsync();
      const { data: conversationsData } = await apiFetchAllConversationsAsync();
      setTickets(ticketsData);
      setConversations(conversationsData);
    };
    fetchData();
  }, []);

  const selectedTicket = tickets.find((t) => t.id === selectedTicketId);
  const selectedConversation = conversations.find(
    (c) => c.id === selectedTicket?.conversationId
  );

  const handleUnlockChat = (ticketId) => {
    setUnlockedTickets((prev) => [...new Set([...prev, ticketId])]);
  };

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'flex-start',
        backgroundColor: '#f7f8fa',
        paddingTop: '50px',
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: '1600px',
          marginLeft: '260px', // prilagodi širini svog sidebar-a
          display: 'flex',
          minHeight: 'calc(100vh - 50px)',
        }}
      >
        <TicketListSection
          tickets={tickets}
          selectedTicketId={selectedTicketId}
          setTickets={setTickets} 
          setSelectedTicketId={setSelectedTicketId}
          unlockedTickets={unlockedTickets}
          onUnlockChat={handleUnlockChat}
          refreshTickets={fetchTickets}
        />
        <AdminChatSection
          ticket={selectedTicket}
          conversation={selectedConversation}
          locked={selectedTicket?.status !== 'Open'}
          onUnlockChat={() =>
            selectedTicketId && handleUnlockChat(selectedTicketId)
          }
        />
      </Box>
    </Box>
  );
}
