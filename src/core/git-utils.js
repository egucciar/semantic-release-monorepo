const execa = require('execa');
const { relative } = require('path');

const git = async (args, options = {}) => {
  const { stdout } = await execa('git', args, options);
  return stdout;
};

/**
 * // https://stackoverflow.com/questions/424071/how-to-list-all-the-files-in-a-commit
 * @async
 * @param {string} hash Git commit hash.
 * @param {string} cwd Working directory.
 * @return {Promise<Array>} List of modified files in a commit.
 */
const getCommitFiles = async (hash, cwd) =>
  (
    await git(['diff-tree', '--no-commit-id', '--name-only', '-r', hash], {
      cwd,
    })
  ).split('\n');

/**
 * https://stackoverflow.com/a/957978/89594
 * @async
 * @param {string} cwd Working directory.
 * @return {Promise<String>} System path of the git repository.
 */
const getRoot = cwd => git(['rev-parse', '--show-toplevel'], { cwd });

/**
 * @async
 * @param {string} path Absolute path.
 * @param {string} cwd Working directory.
 * @return {Promise<String>} Path relative to the git root.
 */
const getRelativePath = async (path, cwd) => relative(await getRoot(cwd), path);

module.exports = {
  getCommitFiles,
  getRoot,
  getRelativePath,
};
