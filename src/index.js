import { sync } from 'read-pkg';
import { compose } from 'ramda';
import { withOnlyPackageCommits } from './only-package-commits';
import versionToGitTag from './version-to-git-tag';
import logPluginVersion from './log-plugin-version';
import { wrapStep } from 'semantic-release-plugin-decorators';

import {
  mapNextReleaseVersion,
  withOptionsTransforms,
} from './options-transforms';

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

export default {
  analyzeCommits,
  generateNotes,
  success,
  fail,
  tagFormat: `${sync().name}-v\${version}`,
};
