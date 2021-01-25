import 'dotenv/config';
import os from 'os';

import {
  name as APP_NAME,
  version as APP_VERSION
} from './package.json';

import app from './app';
import { io } from './socket.io-server';
import http from 'http';

const { console } = global;

const server = http.createServer(app);

const port = process.env.PORT ? Number.parseInt(process.env.PORT, 10) : 3000;
const host = process.env.HOST || 'localhost';

function getDomain(addr) {
  return typeof addr === 'string'
    ? `http://${addr}/`
    : `http://${addr.address}:${addr.port}/`;
}

io.attach(server);
server.listen(port, (error) => {
  if (error) {
    throw new Error(error);
  }

  const memoryUsageFormat = a => Math.round(((a / 1024 / 1024) * 100) / 100);
  const memUsed = memoryUsageFormat(process.memoryUsage().heapUsed);
  const memTotal = memoryUsageFormat(os.freemem());
  const appInfo = `${APP_NAME} v.${APP_VERSION}`;

  console.info('');
  console.info(`\x1b[32m${appInfo} running successfully.\x1b[0m`);
  console.info('');
  // console.info('\x1b[1mListening on:\x1b[34m', getDomain(server.address()), '\x1b[0m');
  console.info('\x1b[1mMemory usage:\x1b[0m', `${memUsed} / ${memTotal} MB`);
  if (process.env.NODE_ENV === 'development') {
    console.info('');
    console.info('This program comes with \x1b[4mabsolutely no warranty\x1b[0m.');
    console.info('This is free software, and you are welcome to redistribute it under certain conditions.');
  }
  console.info('');
});
