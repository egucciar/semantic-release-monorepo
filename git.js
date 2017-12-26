const { publish } = require('@semantic-release/git');
const versionToGitTag = require('./src/version-to-git-tag');

const {
  mapNextReleaseVersionToNextReleaseGitTag,
} = require('./src/options-transforms');

module.exports = async (pluginConf, options) =>
  publish(
    pluginConf,
    await mapNextReleaseVersionToNextReleaseGitTag(versionToGitTag)(options)
  );