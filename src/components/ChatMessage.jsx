// @components/ChatMessage.jsx
import { Box, Paper, Typography, Stack, Link as MuiLink } from '@mui/material';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';

export default function ChatMessage({ isAdmin, text, time, attachment }) {
  return (
    <Stack direction='row' justifyContent={isAdmin ? 'flex-end' : 'flex-start'}>
      <Paper
        elevation={0}
        sx={{
          p: 2,
          bgcolor: isAdmin ? '#e3f2fd' : '#fff',
          maxWidth: 480,
          borderRadius: 3,
          borderTopRightRadius: isAdmin ? 0 : 12,
          borderTopLeftRadius: isAdmin ? 12 : 0,
        }}
      >
        <Typography variant='body1' sx={{ mb: attachment ? 1 : 0 }}>
          {text}
        </Typography>
        {attachment && (
          <Stack
            direction='row'
            alignItems='center'
            spacing={1}
            sx={{
              bgcolor: '#f1f5f9',
              p: 1,
              borderRadius: 1,
              mb: 1,
              mt: 1,
            }}
          >
            <InsertDriveFileIcon color='action' fontSize='small' />
            <MuiLink
              href='#'
              underline='hover'
              sx={{ fontSize: 14, fontWeight: 500 }}
            >
              {attachment.name}
            </MuiLink>
          </Stack>
        )}
        <Typography
          variant='caption'
          color='text.secondary'
          sx={{ display: 'block', textAlign: 'right', mt: 0.5 }}
        >
          {time}
        </Typography>
      </Paper>
    </Stack>
  );
}
