import { io } from '../../socket.io-server';
import { Manager } from './Manager';
import { Channel } from '../../models/Channel';
import { Chat } from './Chat';
import {
  EVENT_CHAT_USER_MESSAGE,
  EVENT_CHANNEL_USER_JOIN
} from './events';

export default class ChannelModule {
  static allow = true;

  buffer = new Set();

  constructor() {
    this.initChannels();
  }

  static registerChatEvents(socket, chat) {
    socket.on(EVENT_CHAT_USER_MESSAGE, (data) => chat.handleMesage(socket.request.user, data));
  }

  static registerChannelEvents(socket, channel) {
    socket.on(EVENT_CHANNEL_USER_JOIN, (data) => channel.handleUserJoin(data));
  }

  initChannels() {
    const all = Channel.findAll();

    all.forEach((channel) => {
      io.of(`/c/${channel.name}`).on('connection', (socket) => {
        const manager = new Manager(socket, channel);
        const chat = new Chat(manager);

        ChannelModule.registerChatEvents(socket, chat);
        ChannelModule.registerChannelEvents(socket, manager);

        this.buffer.add({ manager, chat });
      });
    });
  }
}
