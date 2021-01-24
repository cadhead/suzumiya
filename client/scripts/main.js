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

  socket.on('chat user message', (message) => {
    addMessage(message.text);
  });

  const sendChatMessage = (text) => {
    socket.emit('chat user message', { text });
    addMessage(text);
  };
  const input = document.querySelector('#input');

  input.onchange = () => {
    if (!input.value.trim()) return;
    sendChatMessage(input.value);

    input.value = '';
  };
}
