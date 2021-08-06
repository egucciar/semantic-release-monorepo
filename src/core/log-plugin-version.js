const debug = require('debug')('semantic-release:monorepo');

const logPluginVersion = (type, getProjectVersion) => plugin => async (
  pluginConfig,
  config
) => {
  if (config.options.debug) {
    const version = await getProjectVersion();
    debug('Running %o version %o', type, version);
  }

  return plugin(pluginConfig, config);
};

module.exports = logPluginVersion;
