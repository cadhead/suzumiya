import express from 'express';
import helmet from 'helmet';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import connectFlash from 'connect-flash';

import {
  viewsConfig,
  publicsConfig,
  sessionsConfig
} from './config';
import { router } from './routes';
import { io } from './socket.io-server';
import findStatic from './config/findStatic';
import { applyModules } from './modules';

const app = express();

app
  .set('views', viewsConfig.path)
  .set('view engine', 'pug')
  .set('trust proxy', true);

app
  .use(session(sessionsConfig))
  .use(helmet())
  .use(cookieParser())
  .use(express.json())
  .use(express.urlencoded({ extended: false }))
  .use(express.static(publicsConfig.path))
  .use(connectFlash());

if (Array.isArray(publicsConfig.extends)) {
  publicsConfig.extends.forEach(extend => {
    const { route, path } = extend;

    app.use(route, express.static(path));
  });
}

(async function apply() {
  const wrap = middleware => (socket, next) => middleware(socket.request, {}, next);
  io.use(wrap(session(sessionsConfig)));

  const { css, js } = await findStatic();
  app.locals.staticFiles = { css, js };

  await applyModules();

  app.use(router);
}());

export default app;
