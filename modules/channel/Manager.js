import {
  EVENT_CHANNEL_USER_JOIN
} from './events';

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

  handleUserJoin(dataUser = null) {
    const registeredUser = this.socket.requset.user || {};

    const user = registeredUser.profile || dataUser;

    if (!user) return;

    this.broadcast(EVENT_CHANNEL_USER_JOIN, user);
  }
}
