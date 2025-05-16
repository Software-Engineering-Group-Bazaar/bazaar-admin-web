// @components/ChatInput.jsx
import { useState } from 'react';
import {
  Box,
  TextField,
  IconButton,
  Paper,
  Switch,
  FormControlLabel,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import AttachFileIcon from '@mui/icons-material/AttachFile';

export default function ChatInput({ disabled, onSendMessage }) {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        px: 3,
        py: 2,
        borderTop: '1px solid #e5e7eb',
        bgcolor: '#fff',
      }}
    >

      <Box display='flex' alignItems='center' gap={1}>
        <TextField
          fullWidth
          size='small'
          placeholder='Type your message…'
          variant='outlined'
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          sx={{ bgcolor: '#f7f8fa', borderRadius: 2 }}
          disabled={disabled}
        />
        <IconButton
          color='primary'
          disabled={disabled || !message.trim()}
          onClick={handleSend}
        >
          <SendIcon />
        </IconButton>
      </Box>
    </Paper>
  );
}
