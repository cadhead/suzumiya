import {
  EVENT_CHANNEL_USER_JOIN,
  EVENT_CHANNEL_USER_JOIN_LOCAL
} from './events';

import { User } from '../../models/User';

export class Manager {
  constructor(socket, channel) {
    this.channel = channel;
    this.socket = socket;
  }

  get(key = '') {
    return key in this.channel
      ? this.channel[key]
      : this.channel;
  }

  broadcast(event, data) {
    this.socket.broadcast.emit(event, data);
  }

  broadcastTo(event, data) {
    this.socket.emit(event, data);
  }

  handleUserJoin(dataUser = null) {
    const registeredUser = this.socket.request.user || {};

    const user = registeredUser.profile || dataUser;

    if (!user) return;
    if (!user.username) return;

    if (User.isExist(user.username)) {
      this.broadcastTo(EVENT_CHANNEL_USER_JOIN, {
        user,
        error: {
          message: `Username ${user.username} is already taken.`
        }
      });
    } else {
      this.socket.request.user = user;
      this.broadcast(EVENT_CHANNEL_USER_JOIN, user);
      this.broadcastTo(EVENT_CHANNEL_USER_JOIN_LOCAL, user);
    }
  }
}
