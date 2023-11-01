module.exports = {
  extends: './dist/index.cjs',
  branches: ['master'],
  plugins: [
    '@semantic-release/changelog',
    [
      '@semantic-release/exec',
      {
        prepareCmd:
          "yarn version ${nextRelease.version} && echo '::set-output name=version::${nextRelease.version}'",
        publishCmd: 'yarn npm publish --access public',
      },
    ],
    '@semantic-release/github',
    [
      '@semantic-release/git',
      {
        message:
          'RELEASE: chore(release) - ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}',
      },
    ],
  ],
};

