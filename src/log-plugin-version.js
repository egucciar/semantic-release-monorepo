import { resolve } from 'path';
import { readPackage } from 'read-pkg';

const logPluginVersion = type => plugin => async (pluginConfig, config) => {
  const debug = await 'debug'('semantic-release:monorepo');
  if (config.options.debug) {
    const { version } = await readPackage(resolve(__dirname, '../'));
    debug('Running %o version %o', type, version);
  }

  return plugin(pluginConfig, config);
};

export default logPluginVersion;
