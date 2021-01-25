import { formatChatMessageText } from '../../lib/chat';
import {
  EVENT_CHAT_USER_MESSAGE
} from './events';

export class Chat {
  constructor(channelManager) {
    this.channel = channelManager;
    this.buffer = [];
  }

  sendMessage(message) {
    this.channel.broadcast(EVENT_CHAT_USER_MESSAGE, message);

    this.buffer.push(message);
    if (this.buffer.length > 10) {
      this.buffer.shift();
    }
  }

  handleMesage(user, message) {
    Object.assign(message, {
      text: formatChatMessageText(message.text),
      user
    });

    if (!message.text.trim()) {
      return;
    }

    this.sendMessage(message);
  }
}
