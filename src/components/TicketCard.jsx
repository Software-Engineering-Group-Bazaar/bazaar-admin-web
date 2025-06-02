// @components/TicketCard.jsx
import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  Chip,
  Stack,
} from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';

export default function TicketCard({
  ticket,
  selected,
  unlocked,
  onClick,
  onOpenChat,
  onDelete,
  onResolve,
}) {
  const { title, description, createdAt, status } = ticket;

  const chatIconColor =
    status === 'Requested'
      ? '#bdbdbd'
      : status === 'Open'
        ? '#43a047'
        : '#bdbdbd';

  const statusColor =
    status === 'Requested'
      ? 'warning'
      : status === 'Open'
        ? '#4CAF50'
        : status === 'Resolved'
          ? '#2196F3'
          : 'default';

  return (
    <Card
      onClick={onClick}
      sx={{
        display: 'flex',
        alignItems: 'stretch',
        mb: 2,
        boxShadow: selected ? 6 : 3,
        borderRadius: 3,
        minHeight: 140,
        transition: 'box-shadow 0.2s, border 0.2s',
        border: selected ? '2px solid #1976d2' : '2px solid transparent',
        cursor: 'pointer',
        position: 'relative',
        '&:hover': { boxShadow: 8 },
      }}
    >
      <CardContent sx={{ flex: 1, pr: 0 }}>
        <Typography variant='h6' fontWeight={600} gutterBottom>
          {title}
        </Typography>
        <Typography variant='body2' color='text.secondary' sx={{ mb: 1.5 }}>
          {description}
        </Typography>
        <Stack direction='row' spacing={2} alignItems='center'>
          <Typography variant='caption' color='text.secondary'>
            {new Date(createdAt).toLocaleString()}
          </Typography>
          <Chip
            label={status}
            color={
              status === 'Open'
                ? 'primary'
                : status === 'Resolved'
                  ? 'success'
                  : 'default'
            }
            size='small'
            sx={{
              fontWeight: 500,
              ...(status === 'Requested' && {
                color: '#fff',
                backgroundColor: '#8c0108',
              }),
            }}
          />
        </Stack>
      </CardContent>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          px: 2,
          gap: 1,
          borderLeft: '1px solid #f0f0f0',
          minWidth: 60,
          zIndex: 2,
        }}
        onClick={(e) => e.stopPropagation()} // spriječi bubbling na card
      >
        <IconButton onClick={onOpenChat} size='large'>
          <ChatIcon
            sx={{ color: ticket.status === 'Open' ? '#43a047' : '#bdbdbd' }}
          />
        </IconButton>
        <IconButton color='error' onClick={() => onDelete(ticket)} size='large'>
          <DeleteIcon sx={{ color: '#000000' }} />
        </IconButton>
        <IconButton
          color='success'
          onClick={() => onResolve(ticket)}
          size='large'
          disabled={status === 'Resolved'}
        >
          <CheckCircleIcon
            sx={{
              color: status === 'Resolved' ? '#43a047' : '#8c0108',
            }}
          />
        </IconButton>
      </Box>
    </Card>
  );
}
