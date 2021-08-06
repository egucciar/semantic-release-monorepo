const { outputFile } = require('fs-extra');
const { resolve } = require('path');

const { commitAll, applySemRel } = require('./test-env/common');
const { setupNpmTestEnv, getNpmProjectRoot } = require('./test-env/npm');

describe('npm', () => {
  const semanticReleaseMonorepoPath = process.cwd();
  const npmMonorepoPluginPath = resolve(
    semanticReleaseMonorepoPath,
    'src',
    'npm'
  );

  it('does not release chore commits', async () => {
    const projectName = 'my-project';
    const gitRoot = await setupNpmTestEnv([projectName]);

    const projectRoot = getNpmProjectRoot(gitRoot, projectName);
    const choreSemRel = await applySemRel(projectRoot, npmMonorepoPluginPath);
    expect(choreSemRel.stdout).toContain(
      'There are no relevant changes, so no new version is released'
    );
  }, 30000);

  it('releases major version for initial commit', async () => {
    const projectName = 'my-project';
    const gitRoot = await setupNpmTestEnv([projectName]);

    const projectRoot = getNpmProjectRoot(gitRoot, projectName);
    await outputFile(resolve(projectRoot, 'init.txt'), 'init content');
    await commitAll(gitRoot, 'feat: initial commit');

    const initVersion = '1.0.0';
    const initSemRel = await applySemRel(projectRoot, npmMonorepoPluginPath);
    expect(initSemRel.stdout).toContain(
      `There is no previous release, the next release version is ${initVersion}`
    );
    expect(initSemRel.stdout).toContain(
      `Created tag ${projectName}-v${initVersion}`
    );
  }, 30000);

  it('releases patch version', async () => {
    const projectName = 'my-project';
    const gitRoot = await setupNpmTestEnv([projectName]);

    const projectRoot = getNpmProjectRoot(gitRoot, projectName);
    await outputFile(resolve(projectRoot, 'init.txt'), 'init content');
    await commitAll(gitRoot, 'feat: initial commit');
    await applySemRel(projectRoot, npmMonorepoPluginPath);

    await outputFile(resolve(projectRoot, 'fix.txt'), 'fix content');
    await commitAll(gitRoot, 'fix: a fix');

    const fixVersion = '1.0.1';
    const fixSemRel = await applySemRel(projectRoot, npmMonorepoPluginPath);
    expect(fixSemRel.stdout).toContain(
      `The next release version is ${fixVersion}`
    );
    expect(fixSemRel.stdout).toContain(
      `Created tag ${projectName}-v${fixVersion}`
    );
  }, 30000);

  it('releases minor version', async () => {
    const projectName = 'my-project';
    const gitRoot = await setupNpmTestEnv([projectName]);

    const projectRoot = getNpmProjectRoot(gitRoot, projectName);
    await outputFile(resolve(projectRoot, 'init.txt'), 'init content');
    await commitAll(gitRoot, 'feat: initial commit');
    await applySemRel(projectRoot, npmMonorepoPluginPath);

    await outputFile(resolve(projectRoot, 'feat.txt'), 'feat content');
    await commitAll(gitRoot, 'feat: a feature');

    const featVersion = '1.1.0';
    const featSemRel = await applySemRel(projectRoot, npmMonorepoPluginPath);
    expect(featSemRel.stdout).toContain(
      `The next release version is ${featVersion}`
    );
    expect(featSemRel.stdout).toContain(
      `Created tag ${projectName}-v${featVersion}`
    );
  }, 30000);

  it('releases major version', async () => {
    const projectName = 'my-project';
    const gitRoot = await setupNpmTestEnv([projectName]);

    const projectRoot = getNpmProjectRoot(gitRoot, projectName);
    await outputFile(resolve(projectRoot, 'init.txt'), 'init content');
    await commitAll(gitRoot, 'feat: initial commit');
    await applySemRel(projectRoot, npmMonorepoPluginPath);

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
      npmMonorepoPluginPath
    );
    expect(breakingChangeSemRel.stdout).toContain(
      `The next release version is ${breakingChangeVersion}`
    );
    expect(breakingChangeSemRel.stdout).toContain(
      `Created tag ${projectName}-v${breakingChangeVersion}`
    );
  }, 30000);
});
