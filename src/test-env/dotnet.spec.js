const { pathExists } = require('fs-extra');
const { resolve } = require('path');

const {
  setupDotnetSolution,
  setupDotnetProject,
  setupDotnetTestEnv,
} = require('./dotnet');

describe('dotnet test-env', () => {
  it('initializes a solution', async () => {
    const gitRoot = await setupDotnetSolution();
    await expect(pathExists(resolve(gitRoot, '.releaserc.json'))).resolves.toBe(
      true
    );
  });

  it('adds a project to the solution', async () => {
    const gitRoot = await setupDotnetSolution();
    const projectName = 'TestProject';
    await setupDotnetProject(gitRoot, projectName);
    await expect(
      pathExists(resolve(gitRoot, projectName, `${projectName}.csproj`))
    ).resolves.toBe(true);
  });

  it('creates a test environment', async () => {
    const projectNames = ['Project1', 'Project2'];
    const gitRoot = await setupDotnetTestEnv(projectNames);
    await expect(pathExists(resolve(gitRoot, '.releaserc.json'))).resolves.toBe(
      true
    );
    for (const projectName of projectNames) {
      await expect(
        pathExists(resolve(gitRoot, projectName, `${projectName}.csproj`))
      ).resolves.toBe(true);
    }
  });
});
