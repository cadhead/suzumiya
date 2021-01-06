import path from 'path';

import { getFilenamesFromDirMatching } from '../lib/helpers';
import { publicsConfig } from '../config';

const cssPath = path.join(publicsConfig.path, 'css');
const jsPath = path.join(publicsConfig.path, 'js');
const cond = (file) => !file.includes('map');

function staticFilenamesToURLs(filenames, url = '') {
  const URLs = [];

  filenames.forEach(file => {
    URLs.push(`${url}/${file}`);
  });

  return URLs;
}

export default async () => {
  const cssFilesNames = await getFilenamesFromDirMatching(cssPath, css => cond(css));
  const jsFilesNames = await getFilenamesFromDirMatching(jsPath, js => cond(js));

  return {
    css: staticFilenamesToURLs(cssFilesNames, './css'),
    js: staticFilenamesToURLs(jsFilesNames, './js')
  };
};
