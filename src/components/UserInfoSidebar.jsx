// @components/UserInfoSidebar.jsx
import {
  Box,
  Paper,
  Typography,
  Stack,
  Divider,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import StoreIcon from '@mui/icons-material/Store';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

export default function UserInfoSidebar({ username, storeName }) {
  return (
    <Paper
      elevation={0}
      sx={{
        width: '350px',
        bgcolor: '#fff',
        p: 3,
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
      }}
    >
      <Stack alignItems='center' spacing={1}>
        <Avatar sx={{ width: 72, height: 72, mb: 1 }} alt='' src='' />
        <Typography fontWeight={600}>{username || 'User'}</Typography>{' '}
        {storeName && (
          <Stack direction='row' alignItems='center' spacing={1}>
            <StoreIcon fontSize='small' color='primary' />
            <Typography variant='body2' color='text.secondary'>
              {storeName}
            </Typography>
          </Stack>
        )}
      </Stack>
      <Divider />
    </Paper>
  );
}
