import express from 'express';
import { before } from '../controllers';
import { render, checkExist } from '../controllers/channel';

const channel = express.Router();

const controllers = [
  before,
  checkExist,
  render
];

channel.get('/c/:channelName', ...controllers);

export default channel;
