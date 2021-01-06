import path from 'path';

import sessionsCfg from './sessionsConfig';

export const viewsConfig = {
  path: path.join(process.cwd(), 'templates')
};

export const publicsConfig = {
  path: path.join(process.cwd(), 'client/public'),
  extends: []
};

export const sessionsConfig = sessionsCfg;
