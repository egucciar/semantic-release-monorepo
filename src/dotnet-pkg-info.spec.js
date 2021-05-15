const { getProjectRoot, getProjectName } = require('./dotnet-pkg-info');
const { directory } = require('tempy');
const { mkdir, outputFile } = require('fs-extra');
const { resolve } = require('path');

describe('dotnet-pkg-info', () => {
  describe('gets project root', () => {
    it('gets .csproj file path', async () => {
      const gitRoot = directory();
      const projectName = 'test';
      const projectRoot = resolve(gitRoot, projectName);
      await outputFile(resolve(projectRoot, `${projectName}.csproj`), '');

      const cwd = process.cwd();
      process.chdir(projectRoot);

      expect(await getProjectRoot()).toBe(projectRoot);

      process.chdir(cwd);
    });

    it('fails if no .csproj file', async () => {
      const gitRoot = directory();
      const projectName = 'test';
      const projectRoot = resolve(gitRoot, 'projects', projectName);
      await mkdir(projectRoot, { recursive: true });

      const cwd = process.cwd();
      process.chdir(projectRoot);

      await expect(getProjectRoot()).rejects.toThrow('No .csproj file');

      process.chdir(cwd);
    });
  });

  describe('gets project name', () => {
    it('gets .csproj name', async () => {
      const gitRoot = directory();
      const projectName = 'test';
      const projectRoot = resolve(gitRoot, projectName);
      await outputFile(resolve(projectRoot, `${projectName}.csproj`), '');

      const cwd = process.cwd();
      process.chdir(projectRoot);

      expect(await getProjectName()).toBe(projectName);

      process.chdir(cwd);
    });

    it('fails if no .csproj file', async () => {
      const gitRoot = directory();
      const projectName = 'test';
      const projectRoot = resolve(gitRoot, 'projects', projectName);
      await mkdir(projectRoot, { recursive: true });

      const cwd = process.cwd();
      process.chdir(projectRoot);

      await expect(getProjectName()).rejects.toThrow('No .csproj file');

      process.chdir(cwd);
    });
  });
});
