import { navbarToggler } from './navbar';
import io from 'socket.io-client';

navbarToggler({
  className: {
    toggler: 'nav-main__toggler',
    navbar: 'nav-main__inner'
  },
  transformedClassName: {
    toggler: 'nav-main__toggler--opened',
    navbar: 'nav-main__inner--opened'
  }
});

const loc = window.location.pathname;
const addMessage = (text) => {
  const message = document.createElement('div');
  message.innerText = text;
  document.querySelector('#chat')
    .appendChild(message);
};

if (loc.includes('/c/')) {
  const socket = io(loc);
  const input = document.querySelector('#input');
  const username = document.querySelector('#username');

  socket.on('chat user message', (message) => {
    addMessage(`${message.user.username}: ${message.text}`);
  });

  socket.on('channel user join local', (data) => {
    if (data.error) {
      username.disabled = false;
      username.style.color = 'red';

      return;
    }

    window.userProfile = data;

    addMessage('You joined');
    username.disabled = true;
  });

  socket.on('channel user join', (data) => {
    addMessage(`${data.username} joined`);
  });

  socket.on('channel user leave', (data) => {
    addMessage(`${data.username} leave`);
  });

  const sendChatMessage = (text) => {
    socket.emit('chat user message', { text });
    addMessage(`You: ${text}`);
  };

  input.onchange = () => {
    if (!input.value.trim()) return;
    sendChatMessage(input.value);

    input.value = '';
  };

  username.onkeypress = ({ keyCode }) => {
    if (!username.value.trim() || keyCode !== 13) return;
    socket.emit('channel user join', { username: username.value });
    username.style.color = '';
  };
}
