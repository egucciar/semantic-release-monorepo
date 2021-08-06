const { pathExists } = require('fs-extra');
const { resolve } = require('path');

const {
  setupNpmWorkspace,
  setupNpmProject,
  setupNpmTestEnv,
} = require('./npm');

describe('npm test-env', () => {
  it('initializes a workspace', async () => {
    const gitRoot = await setupNpmWorkspace();
    await expect(pathExists(resolve(gitRoot, 'package.json'))).resolves.toBe(
      true
    );
    await expect(pathExists(resolve(gitRoot, '.releaserc.json'))).resolves.toBe(
      true
    );
  });

  it('adds a project to the workspace', async () => {
    const gitRoot = await setupNpmWorkspace();
    const projectName = 'test';
    await setupNpmProject(gitRoot, projectName);
    await expect(
      pathExists(resolve(gitRoot, 'projects', projectName, 'package.json'))
    ).resolves.toBe(true);
  }, 30000);

  it('creates a test environment', async () => {
    const projects = ['project1', 'project2'];
    const gitRoot = await setupNpmTestEnv(projects);
    await expect(pathExists(resolve(gitRoot, 'package.json'))).resolves.toBe(
      true
    );
    await expect(pathExists(resolve(gitRoot, '.releaserc.json'))).resolves.toBe(
      true
    );
    for (const project of projects) {
      await expect(
        pathExists(resolve(gitRoot, 'projects', project, 'package.json'))
      ).resolves.toBe(true);
    }
  }, 30000);
});
