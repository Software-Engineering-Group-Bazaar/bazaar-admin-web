// @components/ChatMessage.jsx
import { Box, Paper, Typography, Stack } from '@mui/material';

export default function ChatMessage({
  sender,
  isAdmin,
  text,
  time,
  attachment,
  isPrivate = false,
}) {
  return (
    <Stack direction='row' justifyContent={isAdmin ? 'flex-end' : 'flex-start'}>
      <Paper
        elevation={0}
        sx={{
          p: 2,
          bgcolor: isAdmin
            ? isPrivate
              ? '#e0e0e0'
              : '#e3f2fd'
            : isPrivate
              ? '#a7c7e7'
              : '#fff',
          maxWidth: 480,
          borderRadius: 3,
          borderTopRightRadius: isAdmin ? 0 : 12,
          borderTopLeftRadius: isAdmin ? 12 : 0,
        }}
      >
        {!isAdmin && (
          <Typography
            variant='caption'
            color='text.secondary'
            sx={{ mb: 0.5, display: 'block' }}
          >
            {sender}
          </Typography>
        )}

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

        <Stack
          direction='row'
          spacing={1}
          alignItems='center'
          justifyContent='flex-end'
        >
          <Typography
            variant='caption'
            color='text.secondary'
            sx={{ display: 'block', mt: 0.5 }}
          >
            {time}
          </Typography>

          {isPrivate && (
            <Typography
              variant='caption'
              sx={{
                fontStyle: 'italic',
                color: '#999',
                display: 'block',
                mt: 0.5,
              }}
            >
              Private
            </Typography>
          )}
        </Stack>
      </Paper>
    </Stack>
  );
}
