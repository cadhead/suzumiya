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
import findStatic from './config/findStatic';

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

findStatic()
  .then(staticFiles => {
    const { css, js } = staticFiles;
    app.locals.staticFiles = { css, js };
  })
  .then(() => {
    app.use(router);
  });
  
export default app;  
