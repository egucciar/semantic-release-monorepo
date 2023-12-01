import { resolve } from 'path';
import readPkg from 'read-pkg';
import createDebug from 'debug';

const debug = createDebug('semantic-release:monorepo');

const logPluginVersion = type => plugin => async (pluginConfig, config) => {
  if (config.options.debug) {
    const { version } = await readPkg(resolve(__dirname, '../'));
    debug('Running %o version %o', type, version);
  }

  return plugin(pluginConfig, config);
};

export default logPluginVersion;
