const { compose } = require('ramda');
const { wrapStep } = require('semantic-release-plugin-decorators');

const logPluginVersion = require('./log-plugin-version');
const withOnlyPackageCommits = require('./only-package-commits');
const versionToGitTag = require('./version-to-git-tag');

const {
  mapNextReleaseVersion,
  withOptionsTransforms,
} = require('./options-transforms');

const analyzeCommits = (getProjectRoot, getProjectName, getProjectVersion) =>
  wrapStep(
    'analyzeCommits',
    compose(
      logPluginVersion('analyzeCommits', getProjectVersion),
      withOnlyPackageCommits(getProjectRoot, getProjectName)
    ),
    {
      wrapperName: 'semantic-release-monorepo',
    }
  );

const generateNotes = (getProjectRoot, getProjectName, getProjectVersion) =>
  wrapStep(
    'generateNotes',
    compose(
      logPluginVersion('generateNotes', getProjectVersion),
      withOnlyPackageCommits(getProjectRoot, getProjectName),
      withOptionsTransforms([
        mapNextReleaseVersion(versionToGitTag(getProjectName)),
      ])
    ),
    {
      wrapperName: 'semantic-release-monorepo',
    }
  );

const success = (getProjectRoot, getProjectName, getProjectVersion) =>
  wrapStep(
    'success',
    compose(
      logPluginVersion('success', getProjectVersion),
      withOnlyPackageCommits(getProjectRoot, getProjectName),
      withOptionsTransforms([
        mapNextReleaseVersion(versionToGitTag(getProjectName)),
      ])
    ),
    {
      wrapperName: 'semantic-release-monorepo',
    }
  );

const fail = (getProjectRoot, getProjectName, getProjectVersion) =>
  wrapStep(
    'fail',
    compose(
      logPluginVersion('fail', getProjectVersion),
      withOnlyPackageCommits(getProjectRoot, getProjectName),
      withOptionsTransforms([
        mapNextReleaseVersion(versionToGitTag(getProjectName)),
      ])
    ),
    {
      wrapperName: 'semantic-release-monorepo',
    }
  );

module.exports = (
  getProjectRoot,
  getProjectName,
  getProjectNameSync,
  getProjectVersion
) => ({
  analyzeCommits: analyzeCommits(
    getProjectRoot,
    getProjectName,
    getProjectVersion
  ),
  generateNotes: generateNotes(
    getProjectRoot,
    getProjectName,
    getProjectVersion
  ),
  success: success(getProjectRoot, getProjectName, getProjectVersion),
  fail: fail(getProjectRoot, getProjectName, getProjectVersion),
  tagFormat: getProjectNameSync() + '-v${version}',
});
