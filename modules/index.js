import path from 'path';
import { getFilenamesFromDirMatching } from '../lib/helpers';

const { log } = console;

export const pathModules = path.join(process.cwd(), 'modules');

export const applyModules = async () => {
  const modulesNames = await getFilenamesFromDirMatching(
    pathModules,
    (file) => !file.includes('.')
  );

  modulesNames.forEach(async (moduleName) => {
    const pathModule = path.join(pathModules, moduleName);
    import(pathModule).then((module) => {
      const Module = module.default;

      if (Module.allow) {
        // eslint-disable-next-line no-new
        new Module();
      }
    }).catch(() => {
      if (module.default) {
        log(`Module ${moduleName} not loaded.`);
      }
    });
  });
};
