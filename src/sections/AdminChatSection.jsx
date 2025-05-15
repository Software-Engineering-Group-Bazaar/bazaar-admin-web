// @sections/AdminChatSection.jsx
import { Box, Paper } from '@mui/material';
import ChatHeader from '@components/ChatHeader';
import ChatMessages from '@components/ChatMessages';
import ChatInput from '@components/ChatInput';
import UserInfoSidebar from '@components/UserInfoSidebar';

export default function AdminChatSection() {
  return (
    <Box
      sx={{
        display: 'flex',
        height: '100vh',
        bgcolor: '#f7f8fa',
        maxWidth: '1400px'
      }}
    >
      <Paper
        elevation={0}
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          borderRight: '1px solid #e5e7eb',
          bgcolor: '#fff',
        }}
      >
        <ChatHeader />
        <ChatMessages />
        <ChatInput />
      </Paper>
      <UserInfoSidebar />
    </Box>
  );
}
