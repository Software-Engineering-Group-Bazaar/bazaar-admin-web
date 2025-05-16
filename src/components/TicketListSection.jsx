import React, { useState } from 'react';
import { Box, TextField, Typography } from '@mui/material';
import TicketCard from './TicketCard';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import DeleteConfirmModal from '@components/DeleteConfirmModal';
import { apiUpdateTicketStatusAsync } from '../api/api.js'; // prilagodi path
import { apiDeleteTicketAsync } from '../api/api.js'; // prilagodi path

export default function TicketListSection({
  tickets,
  selectedTicketId,
  setSelectedTicketId,
  unlockedTickets,
  onUnlockChat,
  refreshTickets,
  setTickets, // Dodaj ovaj prop iz ChatPage.jsx
}) {
  const [search, setSearch] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [ticketToDelete, setTicketToDelete] = useState(null);

  const handleOpenChat = async (ticketId) => {
    const ticket = tickets.find((t) => t.id === ticketId);
    if (ticket.status === 'Requested') {
      await apiUpdateTicketStatusAsync(ticketId, 'Open');
      if (refreshTickets) await refreshTickets();
    }
    setSelectedTicketId(ticketId); // Samo selektuj ticket
  };

  const handleDelete = (ticket) => {
    setTicketToDelete(ticket);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!ticketToDelete) return;
    const { status } = await apiDeleteTicketAsync(ticketToDelete.id);
    if (status === 204) {
      setTickets((prev) => prev.filter((t) => t.id !== ticketToDelete.id));
      if (selectedTicketId === ticketToDelete.id) setSelectedTicketId(null);
    } else {
      alert('Failed to delete ticket.');
    }
    setDeleteModalOpen(false);
    setTicketToDelete(null);
  };

  const handleResolve = async (ticket) => {
    if (ticket.status !== 'Resolved') {
      await apiUpdateTicketStatusAsync(ticket.id, 'Resolved');
      if (refreshTickets) refreshTickets();
    }
  };

  const filteredTickets = tickets.filter(
    (t) =>
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Box
        sx={{
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
        <Typography variant='h5' fontWeight={700} mb={2} ml={1}>
          Tickets
        </Typography>
        <TextField
          placeholder='Search tickets...'
          variant='outlined'
          size='small'
          fullWidth
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{
            mb: 2,
            ml: 1,
            width: 335,
            borderRadius: 3,
            background: '#fff',
            boxShadow: '0 2px 8px 0 rgba(60,72,88,0.08)',
            '& .MuiOutlinedInput-root': {
              borderRadius: 3,
              background: '#fff',
            },
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: '#e0e0e0',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#bdbdbd',
            },
            '& .MuiInputAdornment-root': {
              color: '#bdbdbd',
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />

        <Box
          sx={{
            flex: 1,
            overflowY: 'auto',
            p: 1,
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
                selected={selectedTicketId === ticket.id}
                unlocked={unlockedTickets.includes(ticket.id)}
                onClick={() => setSelectedTicketId(ticket.id)}
                onOpenChat={() => handleOpenChat(ticket.id)}
                onDelete={handleDelete}
                onResolve={handleResolve}
              />
            ))
          )}
        </Box>
      </Box>
      <DeleteConfirmModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        ticketTitle={ticketToDelete?.title}
      />
    </>
  );
}
