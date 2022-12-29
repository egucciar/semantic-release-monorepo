const { compose } = require('ramda');
const withOnlyPackageCommits = require('./only-package-commits');
const versionToGitTag = require('./version-to-git-tag');
const logPluginVersion = require('./log-plugin-version');
const { getPackageInfoSync } = require('./package-info');
const { wrapStep } = require('semantic-release-plugin-decorators');

const {
  mapNextReleaseVersion,
  withOptionsTransforms,
} = require('./options-transforms');

const analyzeCommits = wrapStep(
  'analyzeCommits',
  compose(logPluginVersion('analyzeCommits'), withOnlyPackageCommits),
  {
    wrapperName: 'semantic-release-monorepo',
  }
);

const generateNotes = wrapStep(
  'generateNotes',
  compose(
    logPluginVersion('generateNotes'),
    withOnlyPackageCommits,
    withOptionsTransforms([mapNextReleaseVersion(versionToGitTag)])
  ),
  {
    wrapperName: 'semantic-release-monorepo',
  }
);

const success = wrapStep(
  'success',
  compose(
    logPluginVersion('success'),
    withOnlyPackageCommits,
    withOptionsTransforms([mapNextReleaseVersion(versionToGitTag)])
  ),
  {
    wrapperName: 'semantic-release-monorepo',
  }
);

const fail = wrapStep(
  'fail',
  compose(
    logPluginVersion('fail'),
    withOnlyPackageCommits,
    withOptionsTransforms([mapNextReleaseVersion(versionToGitTag)])
  ),
  {
    wrapperName: 'semantic-release-monorepo',
  }
);

module.exports = {
  analyzeCommits,
  generateNotes,
  success,
  fail,
  tagFormat: getPackageInfoSync().name + '-v${version}',
};
