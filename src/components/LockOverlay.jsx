// @components/LockOverlay.jsx
import { Box, Typography } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';

export default function LockOverlay({ message = 'Open this ticket' }) {
  return (
    <Box
      sx={{
        position: 'absolute',
        inset: 0,
        bgcolor: 'rgba(240,240,240,0.92)',
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <LockIcon sx={{ fontSize: 64, color: '#bdbdbd', mb: 2 }} />
      <Typography variant='h6' color='text.secondary'>
        {message}
      </Typography>
    </Box>
  );
}
