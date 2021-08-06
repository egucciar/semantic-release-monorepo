const debug = require('debug')('semantic-release:monorepo');
const pLimit = require('p-limit');
const path = require('path');
const { identity, memoizeWith, pipeP } = require('ramda');

const { getCommitFiles, getRelativePath } = require('./git-utils');
const { mapCommits } = require('./options-transforms');

const memoizedGetCommitFiles = memoizeWith(identity, getCommitFiles);

const withFiles = async commits => {
  const limit = pLimit(Number(process.env.SRM_MAX_THREADS) || 500);
  return Promise.all(
    commits.map(commit =>
      limit(async () => {
        const files = await memoizedGetCommitFiles(commit.hash);
        return { ...commit, files };
      })
    )
  );
};

const onlyPackageCommits = getProjectRoot => async commits => {
  const packagePath = await getRelativePath(await getProjectRoot());
  debug('Filter commits by package path: "%s"', packagePath);
  const commitsWithFiles = await withFiles(commits);
  // Convert package root path into segments - one for each folder
  const packageSegments = packagePath.split(path.sep);

  return commitsWithFiles.filter(({ files, subject }) => {
    // Normalise paths and check if any changed files' path segments start
    // with that of the package root.
    const packageFile = files.find(file => {
      const fileSegments = path.normalize(file).split(path.sep);
      // Check the file is a *direct* descendent of the package folder (or the folder itself)
      return packageSegments.every(
        (packageSegment, i) => packageSegment === fileSegments[i]
      );
    });

    if (packageFile) {
      debug(
        'Including commit "%s" because it modified package file "%s".',
        subject,
        packageFile
      );
    }

    return !!packageFile;
  });
};

// Async version of Ramda's `tap`
const tapA = fn => async x => {
  await fn(x);
  return x;
};

const logFilteredCommitCount = getProjectName => logger => async ({
  commits,
}) => {
  const name = await getProjectName();

  logger.log(
    'Found %s commits for package %s since last release',
    commits.length,
    name
  );
};

const withOnlyPackageCommits = (
  getProjectRoot,
  getProjectName
) => plugin => async (pluginConfig, config) => {
  const { logger } = config;

  return plugin(
    pluginConfig,
    await pipeP(
      mapCommits(onlyPackageCommits(getProjectRoot)),
      tapA(logFilteredCommitCount(getProjectName)(logger))
    )(config)
  );
};

module.exports = withOnlyPackageCommits;
