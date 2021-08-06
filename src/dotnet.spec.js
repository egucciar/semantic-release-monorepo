const { outputFile } = require('fs-extra');
const { resolve } = require('path');

const { commitAll, applySemRel } = require('./test-env/common');
const {
  setupDotnetTestEnv,
  getDotNetProjectRoot,
} = require('./test-env/dotnet');

describe('dotnet', () => {
  const semanticReleaseMonorepoPath = process.cwd();
  const dotnetMonorepoPluginPath = resolve(
    semanticReleaseMonorepoPath,
    'src',
    'dotnet'
  );

  it('does not release chore commits', async () => {
    const projectName = 'MyProject';
    const gitRoot = await setupDotnetTestEnv([projectName]);

    const projectRoot = getDotNetProjectRoot(gitRoot, projectName);
    const choreSemRel = await applySemRel(
      projectRoot,
      dotnetMonorepoPluginPath
    );
    expect(choreSemRel.stdout).toContain(
      'There are no relevant changes, so no new version is released'
    );
  }, 30000);

  it('releases major version for initial commit', async () => {
    const projectName = 'MyProject';
    const gitRoot = await setupDotnetTestEnv([projectName]);

    const projectRoot = getDotNetProjectRoot(gitRoot, projectName);
    await outputFile(resolve(projectRoot, 'init.txt'), 'init content');
    await commitAll(gitRoot, 'feat: initial commit');

    const initVersion = '1.0.0';
    const initSemRel = await applySemRel(projectRoot, dotnetMonorepoPluginPath);
    expect(initSemRel.stdout).toContain(
      `There is no previous release, the next release version is ${initVersion}`
    );
    expect(initSemRel.stdout).toContain(
      `Created tag ${projectName}-v${initVersion}`
    );
  }, 30000);

  it('releases patch version', async () => {
    const projectName = 'MyProject';
    const gitRoot = await setupDotnetTestEnv([projectName]);

    const projectRoot = getDotNetProjectRoot(gitRoot, projectName);
    await outputFile(resolve(projectRoot, 'init.txt'), 'init content');
    await commitAll(gitRoot, 'feat: initial commit');
    await applySemRel(projectRoot, dotnetMonorepoPluginPath);

    await outputFile(resolve(projectRoot, 'fix.txt'), 'fix content');
    await commitAll(gitRoot, 'fix: a fix');

    const fixVersion = '1.0.1';
    const fixSemRel = await applySemRel(projectRoot, dotnetMonorepoPluginPath);
    expect(fixSemRel.stdout).toContain(
      `The next release version is ${fixVersion}`
    );
    expect(fixSemRel.stdout).toContain(
      `Created tag ${projectName}-v${fixVersion}`
    );
  }, 30000);

  it('releases minor version', async () => {
    const projectName = 'MyProject';
    const gitRoot = await setupDotnetTestEnv([projectName]);

    const projectRoot = getDotNetProjectRoot(gitRoot, projectName);
    await outputFile(resolve(projectRoot, 'init.txt'), 'init content');
    await commitAll(gitRoot, 'feat: initial commit');
    await applySemRel(projectRoot, dotnetMonorepoPluginPath);

    await outputFile(resolve(projectRoot, 'feat.txt'), 'feat content');
    await commitAll(gitRoot, 'feat: a feature');

    const featVersion = '1.1.0';
    const featSemRel = await applySemRel(projectRoot, dotnetMonorepoPluginPath);
    expect(featSemRel.stdout).toContain(
      `The next release version is ${featVersion}`
    );
    expect(featSemRel.stdout).toContain(
      `Created tag ${projectName}-v${featVersion}`
    );
  }, 30000);

  it('releases major version', async () => {
    const projectName = 'MyProject';
    const gitRoot = await setupDotnetTestEnv([projectName]);

    const projectRoot = getDotNetProjectRoot(gitRoot, projectName);
    await outputFile(resolve(projectRoot, 'init.txt'), 'init content');
    await commitAll(gitRoot, 'feat: initial commit');
    await applySemRel(projectRoot, dotnetMonorepoPluginPath);

    await outputFile(
      resolve(projectRoot, 'breaking-change.txt'),
      'breaking change content'
    );
    await commitAll(
      gitRoot,
      `feat: a feature
      BREAKING CHANGE: with a breaking change`
    );

    const breakingChangeVersion = '2.0.0';
    const breakingChangeSemRel = await applySemRel(
      projectRoot,
      dotnetMonorepoPluginPath
    );
    expect(breakingChangeSemRel.stdout).toContain(
      `The next release version is ${breakingChangeVersion}`
    );
    expect(breakingChangeSemRel.stdout).toContain(
      `Created tag ${projectName}-v${breakingChangeVersion}`
    );
  }, 30000);
});
