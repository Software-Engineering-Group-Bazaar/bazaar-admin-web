// @components/ChatInput.jsx
import { Box, TextField, IconButton, Paper } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import AttachFileIcon from '@mui/icons-material/AttachFile';

export default function ChatInput() {
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
        <IconButton>
          <AttachFileIcon />
        </IconButton>
        <TextField
          fullWidth
          size='small'
          placeholder='Type your message…'
          variant='outlined'
          sx={{ bgcolor: '#f7f8fa', borderRadius: 2 }}
        />
        <IconButton color='primary'>
          <SendIcon />
        </IconButton>
      </Box>
    </Paper>
  );
}
