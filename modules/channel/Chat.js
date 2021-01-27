import { EVENT_CHAT_USER_MESSAGE } from './events';

export class Chat {
  constructor(channelManager) {
    this.channel = channelManager;
  }

  handleMessage(socket, data) {
    Object.assign(data, {
      text: data.text,
      user: socket.request.user
    });

    if (!data.user) return;
    this.channel.broadcast(socket, EVENT_CHAT_USER_MESSAGE, data);
  }
}
