import { resolve } from 'path';
import { readPackage } from 'read-pkg';
import createDebug from 'debug';

const debug = createDebug('semantic-release:monorepo');

const logPluginVersion = type => plugin => async (pluginConfig, config) => {
  if (config.options.debug) {
    const { version } = await readPackage(resolve(__dirname, '../'));
    debug('Running %o version %o', type, version);
  }

  return plugin(pluginConfig, config);
};

export default logPluginVersion;
