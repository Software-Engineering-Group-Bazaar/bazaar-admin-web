// @models/chatModels.js
export const ChatMessageType = {
  SENT: 'sent',
  RECEIVED: 'received',
};

export class ConversationDto {
  id = 0;
  otherParticipantName = '';
  lastMessageSnippet = '';
  lastMessageTimestamp = '';
  unreadMessagesCount = 0;
  orderId = null;
  storeId = null;
}

export class MessageDto {
  id = 0;
  senderUserId = '';
  senderUsername = '';
  content = '';
  sentAt = '';
  readAt = null;
  isPrivate = false;
}

export class ChatMessage {
  id = 0;
  senderUserId = '';
  senderUsername = '';
  content = '';
  sentAt = '';
  readAt = null;
  isPrivate = false;
  isOwnMessage = false;
}
