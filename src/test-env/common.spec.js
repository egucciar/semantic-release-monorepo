const execa = require('execa');
const { pathExists } = require('fs-extra');

const { clone, createOrigin } = require('./common');

describe('test-env', () => {
  it('creates an origin git repository', async () => {
    const originDirectory = await createOrigin();
    await expect(pathExists(originDirectory)).resolves.toBe(true);
    await expect(
      execa('git', ['ls-remote', '--heads', `file://${originDirectory}`])
    ).resolves.toHaveProperty('stdout', '');
  });

  it('clones a git repository', async () => {
    const originDirectory = await createOrigin();
    const gitRepoUrl = `file://${originDirectory}`;
    const gitRoot = await clone(gitRepoUrl);
    await expect(pathExists(gitRoot)).resolves.toBe(true);
  });
});
