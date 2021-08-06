const { directory } = require('tempy');

const {
  getProjectRoot,
  getProjectName,
  getProjectNameSync,
  getProjectVersion,
} = require('./npm-pkg-info');
const { setupNpmTestEnv, getNpmProjectRoot } = require('./test-env/npm');

describe('npm-pkg-info', () => {
  describe('gets project root', () => {
    it('gets package.json file path', async () => {
      const projectName = 'my-project';
      const gitRoot = await setupNpmTestEnv([projectName]);
      const projectRoot = getNpmProjectRoot(gitRoot, projectName);

      await expect(getProjectRoot(projectRoot)).resolves.toBe(projectRoot);
    });

    it('fails if no package.json file', async () => {
      await expect(getProjectRoot(directory())).rejects.toThrow(
        'No package.json file'
      );
    });
  });

  describe('gets project name', () => {
    it('gets package.json name', async () => {
      const projectName = 'my-project';
      const gitRoot = await setupNpmTestEnv([projectName]);
      const projectRoot = getNpmProjectRoot(gitRoot, projectName);

      await expect(getProjectName(projectRoot)).resolves.toBe(projectName);
    });

    it('fails if no package.json file', async () => {
      await expect(getProjectName(directory())).rejects.toThrow(
        'No package.json file'
      );
    });
  });

  describe('gets project name synchronously', () => {
    it('gets package.json name', async () => {
      const projectName = 'my-project';
      const gitRoot = await setupNpmTestEnv([projectName]);
      const projectRoot = getNpmProjectRoot(gitRoot, projectName);

      expect(getProjectNameSync(projectRoot)).toBe(projectName);
    });

    it('fails if no package.json file', async () => {
      expect(() => getProjectNameSync(directory())).toThrow(
        'No package.json file'
      );
    });
  });

  describe('gets project version', () => {
    it('gets package.json version', async () => {
      const projectName = 'my-project';
      const gitRoot = await setupNpmTestEnv([projectName]);
      const projectRoot = getNpmProjectRoot(gitRoot, projectName);

      await expect(getProjectVersion(projectRoot)).resolves.toBe('1.0.0');
    });

    it('fails if no package.json file', async () => {
      await expect(getProjectVersion(directory())).rejects.toThrow(
        'No package.json file'
      );
    });
  });
});
