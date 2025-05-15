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
  onOpenChat,
  onDelete,
  onResolve,
}) {
  const { title, description, createdAt, resolved } = ticket;

  return (
    <Card
      sx={{
        display: 'flex',
        alignItems: 'stretch',
        mb: 2,
        boxShadow: 3,
        borderRadius: 3,
        minHeight: 140,
        transition: 'box-shadow 0.2s',
        '&:hover': { boxShadow: 6 },
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
            {new Date(createdAt).toLocaleString() /*provjeri jel ok*/}
          </Typography>
          <Chip
            label={resolved ? 'Resolved' : 'Open'}
            color={resolved ? 'success' : 'warning'}
            size='small'
            icon={
              resolved ? (
                <CheckCircleIcon fontSize='small' />
              ) : (
                <RadioButtonUncheckedIcon fontSize='big' />
              )
            }
            sx={{
              fontWeight: 500,
              ...(resolved
                ? {}
                : {
                    color: '#fff', // bijeli tekst
                    backgroundColor: '#8c0108', // crvena pozadina
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
          gap: 1.5,
          borderLeft: '1px solid #f0f0f0',
          minWidth: 60,
        }}
      >
        <IconButton
          color='primary'
          onClick={() => onOpenChat(ticket)}
          size='large'
        >
          <ChatIcon />
        </IconButton>
        <IconButton color='error' onClick={() => onDelete(ticket)} size='large'>
          <DeleteIcon sx={{ color: '#000000' }} />
        </IconButton>
        <IconButton
          color={resolved ? 'success' : 'warning'}
          onClick={() => onResolve(ticket)}
          size='large'
          disabled={resolved}
        >
          <CheckCircleIcon
            sx={{
              color: resolved ? '#43a047' : '#8c0108',
            }}
          />
        </IconButton>
      </Box>
    </Card>
  );
}
