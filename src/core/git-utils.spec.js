const { outputFile } = require('fs-extra');
const { resolve, relative, normalize } = require('path');

const { getRoot, getRelativePath, getCommitFiles } = require('./git-utils');

const { commitAll } = require('../test-env/common');
const { setupNpmTestEnv } = require('../test-env/npm');

describe('git-utils', () => {
  it('gets commit files', async () => {
    const gitRoot = await setupNpmTestEnv();

    const filePath = resolve(gitRoot, 'projects', 'project1', 'file1.txt');
    await outputFile(filePath, 'content1');

    const hash = await commitAll(gitRoot, 'fix: file1');

    const commitFiles = (await getCommitFiles(hash, gitRoot)).map(x =>
      normalize(x)
    );
    expect(commitFiles).toIncludeAllMembers([relative(gitRoot, filePath)]);
  });

  it('gets git root from root', async () => {
    const gitRoot = await setupNpmTestEnv();

    const root = normalize(await getRoot(gitRoot));
    expect(root).toBe(gitRoot);
  });

  it('gets git root from subdirectory', async () => {
    const projectName = 'my-project';
    const gitRoot = await setupNpmTestEnv([projectName]);
    const project1Root = resolve(gitRoot, 'projects', projectName);

    const root = normalize(await getRoot(project1Root));
    expect(root).toBe(gitRoot);
  });

  it('gets relative path', async () => {
    const projectName = 'my-project';
    const gitRoot = await setupNpmTestEnv([projectName]);
    const project1Root = resolve(gitRoot, 'projects', projectName);

    const relativePath = await getRelativePath(project1Root, project1Root);
    expect(relativePath).toBe(relative(gitRoot, project1Root));
  });
});
