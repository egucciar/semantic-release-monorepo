const versionToGitTag = require('./version-to-git-tag');

describe('#versionToGitTag', () => {
  describe('if passed a falsy version', () => {
    it('returns null rather than creating a bad git-tag', async done => {
      expect(
        await versionToGitTag(async () => (await readPkg()).name)('')
      ).toBe(null);
      expect(
        await versionToGitTag(async () => (await readPkg()).name)(undefined)
      ).toBe(null);
      expect(
        await versionToGitTag(async () => (await readPkg()).name)(null)
      ).toBe(null);
      done();
    });
  });
});
