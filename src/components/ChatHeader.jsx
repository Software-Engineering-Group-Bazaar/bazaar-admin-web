// @components/ChatHeader.jsx
import { Box, Typography, Stack, Chip } from '@mui/material';
import CircleIcon from '@mui/icons-material/Circle';

export default function ChatHeader() {
  return (
    <Box
      sx={{
        px: 4,
        pt: 3,
        pb: 2,
        borderBottom: '1px solid #e5e7eb',
        bgcolor: '#fff',
      }}
    >
      <Stack direction='row' alignItems='center' spacing={2}>
        <Box>
          <Typography fontWeight={600}>Regina Polyakova</Typography>
          <Stack direction='row' alignItems='center' spacing={1}>
            <CircleIcon sx={{ color: '#4ade80', fontSize: 12 }} />
            <Typography variant='body2' color='success.main'>
              Online
            </Typography>
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
}
