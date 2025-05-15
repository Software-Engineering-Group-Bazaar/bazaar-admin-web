// @components/ChatMessages.jsx
import { Box } from '@mui/material';
import ChatMessage from './ChatMessage';

const messages = [
  {
    id: 1,
    sender: 'Regina Polyakova',
    isAdmin: false,
    text: "Hello! Have you already prepared financial statements for the last month? I can't find it anywhere. Tomorrow it will be necessary to print all the documents and hand them over to the customer at the meeting.",
    time: '09:42',
  },
  {
    id: 2,
    sender: 'Admin',
    isAdmin: true,
    text: "Hi! Of course! I've made it! I sent you all the documents two days ago by email. This is what happens when you do not read messages for several days. But it is ok, here you go. Don't lose them...",
    time: '10:12',
  },
  {
    id: 3,
    sender: 'Regina Polyakova',
    isAdmin: false,
    text: "Oh, there's such a bunch of emails. I just can not find yours among the other. I promise not to lose your letters anymore. See you at the meeting tomorrow!",
    time: '10:15',
  },
  {
    id: 4,
    sender: 'Regina Polyakova',
    isAdmin: false,
    text: "Hello! Have you already prepared financial statements for the last month? I can't find it anywhere. Tomorrow it will be necessary to print all the documents and hand them over to the customer at the meeting.",
    time: '09:42',
  },
  {
    id: 5,
    sender: 'Admin',
    isAdmin: true,
    text: "Hi! Of course! I've made it! I sent you all the documents two days ago by email. This is what happens when you do not read messages for several days. But it is ok, here you go. Don't lose them...",
    time: '10:12',
  },
  {
    id: 6,
    sender: 'Regina Polyakova',
    isAdmin: false,
    text: "Oh, there's such a bunch of emails. I just can not find yours among the other. I promise not to lose your letters anymore. See you at the meeting tomorrow!",
    time: '10:15',
  },
];

export default function ChatMessages() {
  return (
    <Box
      sx={{
        flex: 1,
        px: 4,
        py: 3,
        overflowY: 'auto',
        bgcolor: '#f7f8fa',
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
        width: '1050px'
      }}
    >
      {messages.map((msg) => (
        <ChatMessage key={msg.id} {...msg} />
      ))}
    </Box>
  );
}
