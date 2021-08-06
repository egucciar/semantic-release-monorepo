const SemanticReleaseError = require('@semantic-release/error');
const glob = require('glob-promise');
const { resolve } = require('path');
const { readFile } = require('fs-extra');

const getProjectRoot = async cwd => {
  cwd = cwd || process.cwd();

  const csprojPath = (await glob('*.csproj', { absolute: true, cwd }))[0];

  if (csprojPath) {
    return resolve(csprojPath, '..');
  }

  throw new SemanticReleaseError(
    'No .csproj file',
    'NO_CSPROJ',
    'semantic-release should be ran in an individual monorepo package with a .csproj file'
  );
};

const getProjectName = async cwd => {
  cwd = cwd || process.cwd();

  const csprojFile = (await glob('*.csproj', { cwd }))[0];

  if (csprojFile) {
    return csprojFile.slice(0, -'.csproj'.length);
  }

  throw new SemanticReleaseError(
    'No .csproj file',
    'NO_CSPROJ',
    'semantic-release should be ran in an individual monorepo package with a .csproj file'
  );
};

const getProjectNameSync = cwd => {
  cwd = cwd || process.cwd();

  const csprojFile = glob.sync('*.csproj', { cwd })[0];

  if (csprojFile) {
    return csprojFile.slice(0, -'.csproj'.length);
  }

  throw new SemanticReleaseError(
    'No .csproj file',
    'NO_CSPROJ',
    'semantic-release should be ran in an individual monorepo package with a .csproj file'
  );
};

const getProjectVersion = async cwd => {
  cwd = cwd || process.cwd();

  const csprojPath = (await glob('*.csproj', { absolute: true, cwd }))[0];

  if (csprojPath) {
    const content = await readFile(csprojPath, 'utf8');
    const searchVersion = /<Version>(.*)<\/Version>/.exec(content);
    if (searchVersion) {
      return searchVersion[1];
    }

    throw new SemanticReleaseError(
      'No version in .csproj file',
      'NO_CSPROJ_VERSION',
      '.csproj file should contain a version tag'
    );
  }

  throw new SemanticReleaseError(
    'No .csproj file',
    'NO_CSPROJ',
    'semantic-release should be ran in an individual monorepo package with a .csproj file'
  );
};

module.exports = {
  getProjectRoot,
  getProjectName,
  getProjectNameSync,
  getProjectVersion,
};
