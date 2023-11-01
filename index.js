import { readPackageSync } from 'read-pkg';
import { compose } from 'ramda';
import { withOnlyPackageCommits } from './src/only-package-commits.js';
import versionToGitTag from './src/version-to-git-tag.js';
import logPluginVersion from './src/log-plugin-version.js';
import {
  mapNextReleaseVersion,
  withOptionsTransforms,
} from './src/options-transforms.js';
import wrapStep from './src/wrapStep.js';

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

const tagFormat = `${readPackageSync().name}-v\${version}`;

module.exports = { analyzeCommits, generateNotes, success, fail, tagFormat };
