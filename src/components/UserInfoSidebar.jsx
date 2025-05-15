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
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

export default function UserInfoSidebar() {
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
        <Avatar
          sx={{ width: 72, height: 72, mb: 1 }}
          alt='Regina Polyakova'
          src='' // Placeholder, add image if needed
        />
        <Typography fontWeight={600}>Regina Polyakova</Typography>
        <Typography variant='body2' color='text.secondary'>
          Russia, Saint-Petersburg
        </Typography>
      </Stack>
      <Divider />
      <List dense>
        <ListItem>
          <ListItemIcon>
            <PhoneIcon fontSize='small' />
          </ListItemIcon>
          <ListItemText primary='+7 812 546 28 53' />
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <EmailIcon fontSize='small' />
          </ListItemIcon>
          <ListItemText primary='regina@aptech.ru' />
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <CalendarMonthIcon fontSize='small' />
          </ListItemIcon>
          <ListItemText primary='26.07.1995' />
        </ListItem>
      </List>
      <Divider />
    </Paper>
  );
}
