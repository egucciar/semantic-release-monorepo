const { outputFile } = require('fs-extra');
const { resolve } = require('path');
const { directory } = require('tempy');

const {
  getProjectRoot,
  getProjectName,
  getProjectVersion,
  getProjectNameSync,
} = require('./dotnet-pkg-info');
const {
  setupDotnetTestEnv,
  getDotNetProjectRoot,
} = require('./test-env/dotnet');

describe('dotnet-pkg-info', () => {
  describe('gets project root', () => {
    it('gets .csproj file path', async () => {
      const projectName = 'MyProject';
      const gitRoot = await setupDotnetTestEnv([projectName]);
      const projectRoot = getDotNetProjectRoot(gitRoot, projectName);

      await expect(getProjectRoot(projectRoot)).resolves.toBe(projectRoot);
    });

    it('fails if no .csproj file', async () => {
      await expect(getProjectRoot(directory())).rejects.toThrow(
        'No .csproj file'
      );
    });
  });

  describe('gets project name', () => {
    it('gets .csproj name', async () => {
      const projectName = 'MyProject';
      const gitRoot = await setupDotnetTestEnv([projectName]);
      const projectRoot = getDotNetProjectRoot(gitRoot, projectName);

      await expect(getProjectName(projectRoot)).resolves.toBe(projectName);
    });

    it('fails if no .csproj file', async () => {
      await expect(getProjectName(directory())).rejects.toThrow(
        'No .csproj file'
      );
    });
  });

  describe('gets project name synchronously', () => {
    it('gets .csproj name', async () => {
      const projectName = 'MyProject';
      const gitRoot = await setupDotnetTestEnv([projectName]);
      const projectRoot = getDotNetProjectRoot(gitRoot, projectName);

      expect(getProjectNameSync(projectRoot)).toBe(projectName);
    });

    it('fails if no .csproj file', async () => {
      expect(() => getProjectNameSync(directory())).toThrow('No .csproj file');
    });
  });

  describe('gets project version', () => {
    it('gets .csproj version', async () => {
      const projectName = 'MyProject';
      const gitRoot = await setupDotnetTestEnv([projectName]);
      const projectRoot = getDotNetProjectRoot(gitRoot, projectName);

      await expect(getProjectVersion(projectRoot)).resolves.toBe('1.0.0');
    });

    it('fails if no version in .csproj file', async () => {
      const projectName = 'project1';
      const projectRoot = resolve(directory(), projectName);
      await outputFile(resolve(projectRoot, `${projectName}.csproj`), '');

      await expect(getProjectVersion(projectRoot)).rejects.toThrow(
        'No version in .csproj file'
      );
    });

    it('fails if no .csproj file', async () => {
      await expect(getProjectVersion(directory())).rejects.toThrow(
        'No .csproj file'
      );
    });
  });
});
