import React, { useState } from 'react';
import { Box, TextField, Typography } from '@mui/material';
import TicketCard from './TicketCard';

export default function TicketListSection({
  tickets,
  onOpenChat,
  onDelete,
  onResolve,
}) {
  const [search, setSearch] = useState('');


  //Mock
  onOpenChat = (ticket) => alert(`Open chat for ticket #${ticket.id}`);
  onDelete = (ticket) => alert(`Delete ticket #${ticket.id}`);
  onResolve = (ticket) => alert(`Resolve ticket #${ticket.id}`);

  tickets = [
    //Mock
    {
      id: 1,
      title: 'Problem with order #1234',
      description: "I haven't received my order yet.",
      createdAt: '2024-05-15T10:30:00Z',
      resolved: false,
      userId: 5,
      conversationId: 101,
      orderId: 1234,
    },
    {
      id: 2,
      title: 'Refund request',
      description: 'I would like to request a refund for my last purchase.',
      createdAt: '2024-05-14T14:20:00Z',
      resolved: true,
      userId: 7,
      conversationId: 102,
      orderId: 1235,
    },
    {
      id: 3,
      title: 'Account issue',
      description: "Can't log in to my account.",
      createdAt: '2024-05-13T09:00:00Z',
      resolved: false,
      userId: 8,
      conversationId: 103,
      orderId: 1236,
    },
  ];

  const filteredTickets = tickets.filter(
    (t) =>
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box
      sx={{
        ml: 70,
        width: 400,
        maxWidth: '100%',
        height: '100vh',
        bgcolor: '#fafbfc',
        borderRight: '1px solid #e0e0e0',
        p: 3,
        boxSizing: 'border-box',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Typography variant='h5' fontWeight={700} mb={2}>
        Tickets
      </Typography>
      <TextField
        placeholder='Search tickets...'
        variant='outlined'
        size='small'
        fullWidth
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ mb: 2 }}
      />
      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          pr: 1,
        }}
      >
        {filteredTickets.length === 0 ? (
          <Typography color='text.secondary' mt={4} align='center'>
            No tickets found.
          </Typography>
        ) : (
          filteredTickets.map((ticket) => (
            <TicketCard
              key={ticket.id}
              ticket={ticket}
              onOpenChat={onOpenChat}
              onDelete={onDelete}
              onResolve={onResolve}
            />
          ))
        )}
      </Box>
    </Box>
  );
}
