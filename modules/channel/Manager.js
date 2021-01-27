import {
  EVENT_CHANNEL_USER_JOIN,
  EVENT_CHANNEL_USER_LEAVE,
  EVENT_CHANNEL_USER_JOIN_LOCAL
} from './events';

import { User } from '../../models/User';

export class ChannelManager {
  constructor(channel) {
    this.channel = channel;
    this.users = new Set();
  }

  get online() {
    return this.users.size();
  }

  get(key = '') {
    return key in this.channel
      ? this.channel[key]
      : this.channel;
  }

  // eslint-disable-next-line class-methods-use-this
  broadcast(socket, event, data, forAll = true) {
    if (!forAll) {
      socket.emit(event, data);

      return;
    }

    socket.broadcast.emit(event, data);
  }

  handleUserJoin(socket, guest = null) {
    const registeredUser = socket.request.user || {};

    const user = registeredUser.profile || guest;

    if (!user) return;
    if (!user.username) return;

    if (User.isExist(user.username) || this.users.has(user.username)) {
      this.broadcast(socket, EVENT_CHANNEL_USER_JOIN_LOCAL, {
        user,
        error: {
          message: `Username ${user.username} is already taken.`
        }
      }, false);
    } else {
      Object.assign(socket.request, { user });
      this.users.add(user.username);
      this.broadcast(socket, EVENT_CHANNEL_USER_JOIN, user);
      this.broadcast(socket, EVENT_CHANNEL_USER_JOIN_LOCAL, user, false);
    }
  }

  handleUserLeave(socket) {
    if (!socket.request.user) return;

    const { username } = socket.request.user;

    if (this.users.has(username)) {
      this.users.delete(username);
      this.broadcast(socket, EVENT_CHANNEL_USER_LEAVE, socket.request.user);
    }
  }
}
